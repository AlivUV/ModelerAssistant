import { yPad } from "../utils";


/**
 * Modify the current diagram by adding a flow that connects the specified elements that communicate to the different participants.
 * @param {{id: String, width: Number, x: Number, y: Number}} sourceTask 
 * @param {{id: String, width: Number, x: Number, y: Number}} targetTask 
 * @param {Number} participantId
 * @param {{flows: Number, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addMessageFlow = (sourceTask, targetTask, bpmn) => {
    const id = bpmn.flows + 1;
    let xml;

    //Add definitions.
    {
        const flowDef = `\t\t<bpmn:messageFlow id="Flow_${id}" sourceRef="${sourceTask.id}" targetRef="${targetTask.id}" />`

        xml = bpmn.xml.split("</bpmn:collaboration>");
        xml[0] += flowDef;
    }

    //Add diagram.
    {
        const flowDiagram = (sourceTask.y < targetTask.y)
            ? `\t\t<bpmndi:BPMNEdge id="Flow_${id}_di" bpmnElement="Flow_${id}">
            <di:waypoint x="${sourceTask.x}" y="${sourceTask.y + (sourceTask.height / 2)}" />
            <di:waypoint x="${sourceTask.x}" y="${sourceTask.y + (sourceTask.height / 2) + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${sourceTask.y + (sourceTask.height / 2) + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${targetTask.y - (targetTask.height / 2)}" />\n\t\t</bpmndi:BPMNEdge>\n`
            : `\t\t<bpmndi:BPMNEdge id="Flow_${id}_di" bpmnElement="Flow_${id}">
            <di:waypoint x="${sourceTask.x}" y="${sourceTask.y - (sourceTask.height / 2)}" />
            <di:waypoint x="${sourceTask.x}" y="${targetTask.y + (targetTask.height / 2) + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${targetTask.y + (targetTask.height / 2) + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${targetTask.y + (targetTask.height / 2)}" />\n\t\t</bpmndi:BPMNEdge>\n`;

        xml[1] = xml[1].split("</bpmndi:BPMNPlane>");
        xml[1][0] += flowDiagram;
        xml[1] = xml[1].join("</bpmndi:BPMNPlane>");
    }
    bpmn.flows += 1;
    bpmn.xml = xml.join("</bpmn:collaboration>");
    return bpmn;
}

export { addMessageFlow };