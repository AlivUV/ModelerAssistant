import { addDiagram } from "../elements/xmlElement";
import { yPad } from "../utils";


/**
 * Modify the current diagram by adding a flow conecting the specified elements.
 * @param {{id: String, width: Number, x: Number, y: Number}} sourceTask 
 * @param {{id: String, width: Number, x: Number, y: Number}} targetTask 
 * @param {Number} participantId
 * @param {{flows: Number, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addSequenceFlow = (sourceTask, targetTask, participantId, bpmn) => {
    const flowId = (bpmn.seqFlows += 1) + bpmn.msgFlows;
    let xml;
    let dir;

    //Add definitions.
    {
        const flowOutgoingDef = `\t<bpmn:outgoing>Flow_${flowId}</bpmn:outgoing>\n`;
        const flowIncomingDef = `\t<bpmn:incoming>Flow_${flowId}</bpmn:incoming>\n`;
        const flowDef = `<bpmn:sequenceFlow id="Flow_${flowId}" sourceRef="${sourceTask.id}" targetRef="${targetTask.id}" />`;

        xml = bpmn.xml.split("</bpmn:process>");
        xml[participantId] = xml[participantId].split("</bpmn:");

        const firstLine = xml[participantId][0]
            .substring(0, xml[participantId][0].indexOf(">", 20));
        xml[participantId][0] = xml[participantId][0].substring(firstLine.length);

        let outgoingIndex = xml[participantId].findIndex(e => e.includes(sourceTask.id));
        let incomingIndex = xml[participantId].findIndex(e => e.includes(targetTask.id));
        dir = outgoingIndex < incomingIndex;

        while (/incoming|outgoing/.test(xml[participantId][outgoingIndex + 1].substring(0, 10))) {
            outgoingIndex += 1;
        }

        while (/incoming|outgoing/.test(xml[participantId][incomingIndex + 1].substring(0, 10))) {
            incomingIndex += 1;
        }

        const flowIndex = Math.max(outgoingIndex, incomingIndex) + 1;

        xml[participantId][0] = firstLine + xml[participantId][0];

        xml[participantId][outgoingIndex] += flowOutgoingDef;
        xml[participantId][incomingIndex] += flowIncomingDef;

        const lineInit = xml[participantId][flowIndex]
            .substring(0, xml[participantId][flowIndex].indexOf(">") + 1);
        xml[participantId][flowIndex] = `${lineInit}
        ${flowDef}
        ${xml[participantId][flowIndex].substring(lineInit.length)}\n`;

        xml[participantId] = xml[participantId].join("</bpmn:");

    }

    //Add diagram.
    {
        const flowDiagram = (dir)
            ? `\t\t<bpmndi:BPMNEdge id="Flow_${flowId}_di" bpmnElement="Flow_${flowId}">
            <di:waypoint x="${sourceTask.x + (sourceTask.width / 2)}" y="${sourceTask.y}" />
            <di:waypoint x="${targetTask.x - (targetTask.width / 2)}" y="${targetTask.y}" />\n\t\t</bpmndi:BPMNEdge>\n`
            : `\t\t<bpmndi:BPMNEdge id="Flow_${flowId}_di" bpmnElement="Flow_${flowId}">
            <di:waypoint x="${sourceTask.x}" y="${sourceTask.y - (sourceTask.height / 2)}" />
            <di:waypoint x="${sourceTask.x}" y="${bpmn.participants[participantId].y + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${bpmn.participants[participantId].y + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${targetTask.y - (targetTask.height / 2)}" />\n\t\t</bpmndi:BPMNEdge>\n`;

        xml[xml.length - 1] = addDiagram(flowDiagram, participantId, xml[xml.length - 1]);
    }

    bpmn.xml = xml.join("</bpmn:process>");
    return bpmn;
}

export { addSequenceFlow };