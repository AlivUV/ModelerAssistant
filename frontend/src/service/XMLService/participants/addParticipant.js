import { xInit } from "../utils";


/**
 * Modify the current diagram by adding a participant.
 * @param {String} participantName The name of the new participant.
 * @param {{participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addParticipant = (participantName, bpmn) => {
    const id = bpmn.participants.length + 1;
    const width = 900;
    const height = 250;
    const lastY = (bpmn.participants.length === 0)
        ? 0
        : bpmn.participants[bpmn.participants.length - 1].y + bpmn.participants[bpmn.participants.length - 1].height;
    let xml;

    //Add definitions.
    {
        const participantDef = `\t<bpmn:participant id="Participant_${id}" name="${participantName}" processRef="Process_${id}" />\n`;
        const participantProcess = `\n\t<bpmn:process id="Process_${id}">\n`;

        xml = bpmn.xml.split("</bpmn:collaboration>");
        xml[0] += participantDef;

        xml[1] = xml[1].split("</bpmn:process>");
        xml[1].splice(xml[1].length - 1, 0, participantProcess);
        xml[1] = xml[1].join("</bpmn:process>");
    }

    //Add diagram.
    {
        const diagramXML = `\t<bpmndi:BPMNShape id="Participant_${id}_di" bpmnElement="Participant_${id}" isHorizontal="true">
            <dc:Bounds x="${xInit}" y="${lastY}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

        xml[1] = xml[1].split("</bpmndi:BPMNPlane>");
        xml[1][0] += diagramXML;
        xml[1] = xml[1].join("</bpmndi:BPMNPlane>");
    }

    bpmn.xml = xml.join("</bpmn:collaboration>");
    bpmn.participants.push({ name: participantName, width: width, height: height, y: lastY, lastX: xInit, elements: [] });
    return bpmn;
}

export default addParticipant;