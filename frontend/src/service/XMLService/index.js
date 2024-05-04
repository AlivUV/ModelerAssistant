import { names } from "./utils";
import { addParticipant, findParticipant } from "./participants";
import { addElement, findElement } from "./elements"
import { addFlow } from "./flows"

/**
 * Creates the object of an empty bpmn.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const initBPMN = () => {
    return {
        startEvts: 0,
        interEvts: 0,
        endEvts: 0,
        tasks: 0,
        flows: 0,
        gateways: 0,
        participants: [],
        xml: `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0xcv3nk" targetNamespace="http://bpmn.io/schema/bpmn" r="Camunda Modeler" rVersion="3.0.0-dev">
    <bpmn:collaboration id="Collaboration_1">
    </bpmn:collaboration>
</bpmn:definitions>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
    </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
    `};
}


const processJson = jsonBPMN => {
    if (!jsonBPMN.process) {
        jsonBPMN.process = jsonBPMN.Process;
        delete jsonBPMN.Process;
    }

    if (!jsonBPMN.participants) {
        jsonBPMN.participants = jsonBPMN.process.participants || [];
        delete jsonBPMN.process.participants
    }

    if (!jsonBPMN.elements) {
        jsonBPMN.elements = jsonBPMN.process.elements || [];
        delete jsonBPMN.process.elements
    }

    if (!jsonBPMN.flows) {
        jsonBPMN.flows = jsonBPMN.process.flows || [];
        delete jsonBPMN.process.flows
    }

    delete jsonBPMN.process

    return jsonBPMN;
}


const buildBPMN = jsonBPMN => {

    let bpmn = initBPMN();

    jsonBPMN = processJson(jsonBPMN);

    jsonBPMN.participants.forEach(participant => {
        if (typeof (participant) === "string")
            bpmn = addParticipant(participant, bpmn);
        else
            bpmn = addParticipant(participant.name, bpmn);
    });

    for (let i = 0; i < jsonBPMN.elements.length; i++) {
        jsonBPMN.elements[i] = {
            ...jsonBPMN.elements[i],
            participant: findParticipant(jsonBPMN.elements, i, bpmn.participants)
        }
        bpmn = addElement(jsonBPMN.elements[i], names, bpmn)
    }

    jsonBPMN.flows.forEach(flow => {
        try {
            const [sParticipant, source] = findElement(flow.source, bpmn.participants);
            const [tParticipant, target] = findElement(flow.target, bpmn.participants);

            bpmn = addFlow(source, sParticipant, target, tParticipant, bpmn);
        } catch (error) {
            // Continue to the next flow.
        }
    });

    return bpmn.xml;
}

export { buildBPMN };