import { addXmlElement } from "../xmlElement";
import { xPad } from "../../utils";


/**
 * Modify the current diagram by adding an inclusive gateway at the specified participant.
 * @param {String} gateName 
 * @param {Number} participantId 
 * @param {{gateways: Number, participants: Array, xml: String}} bpmn 
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addInclusiveGateway = (gateName, participantId, bpmn) => {
    const id = bpmn.gateways + 1;
    const width = 50;
    const height = 50;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const gatewayDef = `<bpmn:inclusiveGateway id="Gateway_${id}" name="${gateName}">
        </bpmn:inclusiveGateway>\n`
    const gatewayDiagram = `\t\t<bpmndi:BPMNShape id="Gateway_${id}_di" bpmnElement="Gateway_${id}" isMarkerVisible="true">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n`

    bpmn.xml = addXmlElement(gatewayDef, gatewayDiagram, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "InclusiveGateway",
        id: `Gateway_${id}`,
        name: gateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.gateways += 1;

    return bpmn;
}

export default addInclusiveGateway;