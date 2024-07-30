import { addXmlElement } from "../xmlElement";
import { xPad } from "../../utils";


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addEscalationIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const intermediateDef = `\t\t<bpmn:intermediateThrowEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:escalationEventDefinition id="EscalationIntermediate_${id}" />
        </bpmn:intermediateThrowEvent>\n`;
    const intermediateDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(intermediateDef, intermediateDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "EscalationIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}

export default addEscalationIntermediate;