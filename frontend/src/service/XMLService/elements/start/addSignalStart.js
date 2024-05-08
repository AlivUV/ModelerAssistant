import { addXmlElement } from "../xmlElement"
import { xPad } from "../../utils";

/**
 * Modify the current diagram by adding a timer start event which receives a message at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addSignalStart = (startName, participantId, bpmn) => {
    const id = bpmn.startEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:startEvent id="StartEvent_${id}" name="${startName}">
            <bpmn:signalEventDefinition id="Signaltart_${id}" />
        </bpmn:startEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="StartEvent_${id}_di" bpmnElement="StartEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "SignalStart",
        id: `StartEvent_${id}`,
        name: startName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.startEvts += 1;
    return bpmn;
}

export default addSignalStart;