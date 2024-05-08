import { addXmlElement } from "../xmlElement";
import { xPad } from "../../utils";


/**
 * Modify the current diagram by adding a script task at the specified participant.
 * @param {String} taskName The name of the new task.
 * @param {Number} participantId The id of the participant to which the task is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addScriptTask = (taskName, participantId, bpmn) => {
    const id = bpmn.tasks + 1;
    const width = 100;
    const height = 80
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const taskDef = `\t\t<bpmn:scriptTask id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:scriptTask>\n`;
    const taskXML = `\t\t<bpmndi:BPMNShape id="US-${id}_di" bpmnElement="US-${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(taskDef, taskXML, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "ScriptTask",
        id: `US-${id}`,
        name: taskName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.tasks += 1;

    return bpmn;
}

export default addScriptTask;