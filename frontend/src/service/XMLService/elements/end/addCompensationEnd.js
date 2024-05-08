import { addXmlElement } from "../xmlElement";
import { xPad } from "../../utils";


/**
 * Modify the current diagram by adding a compensation end event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addCompensationEnd = (endName, participantId, bpmn) => {
    const id = bpmn.endEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const endDef = `\t\t<bpmn:endEvent id="EndEvent_${id}" name="${endName}">
            <bpmn:compensateEventDefinition id="CompensationEnd_${id}" />
        </bpmn:endEvent>\n`;
    const endDiagram = `\t\t<bpmndi:BPMNShape id="EndEvent_${id}_di" bpmnElement="EndEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(endDef, endDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "CompensationEnd",
        id: `EndEvent_${id}`,
        name: endName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.endEvts += 1;
    return bpmn;
}

export default addCompensationEnd;