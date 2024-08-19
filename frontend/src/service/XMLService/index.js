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
        seqFlows: 0,
        msgFlows: 0,
        gateways: 0,
        TNDO: 0,
        PDOPIn: 0,
        TNCS: 0,
        PDOPOut: 0,
        PDOTOut: 0,
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

    return {
        // Código XML del diagrama
        xml: bpmn.xml,
        metrics: {
            // Número Total de Eventos de Inicio del Modelo.
            NTSE: bpmn.startEvts,
            // Número Total de Eventos Intermedios del Modelo.
            NTIE: bpmn.interEvts,
            // Número Total de Eventos Finales del Modelo.
            TNEE: bpmn.endEvts,
            // Número Total de Tareas del Modelo.
            TNT: bpmn.tasks,
            // Número Total de Sub-Procesos Colapsados del Modelo.
            TNCS: bpmn.TNCS,
            // Número Total de Eventos del Modelo.
            TNE: (bpmn.startEvts + bpmn.interEvts + bpmn.endEvts),
            // Número Total de Decisiones/Uniones del Modelo.
            TNG: bpmn.gateways,
            // Número Total de Objetos de Datos en el Modelo.
            TNDO: bpmn.TNDO,
            // Nivel de Conectividad entre Actividades.
            CLA: (bpmn.tasks / bpmn.seqFlows),
            // Nivel de Conectividad entre Participantes.
            CLP: (bpmn.msgFlows / bpmn.participants.length),
            // Proporción de Objetos de Datos como Producto entrante y el total de Objetos de Datos.
            PDOPIn: bpmn.PDOPIn,
            // Proporción de Objetos de Datos como Producto de salida y el total de Objetos de Datos.
            PDOPOut: bpmn.PDOPOut,
            // Proporción de Objetos de Datos como Producto de salida de Actividades del Modelo.
            PDOTOut: bpmn.PDOTOut,
            // Proporción Participantes y/o Carriles y las Actividades del Modelo.
            PLT: (bpmn.participants.length / bpmn.tasks)
        }
    };
}

export { buildBPMN };