/**
 * Auxiliar function that modify the current xml by adding the xml specified.
 * @param {String} xmlDiagram 
 * @param {Number} participantId 
 * @param {String} xml 
 * @returns {String}
 */
const addDiagram = (xmlDiagram, participantId, xml) => {
    xml = xml.split("</bpmndi:BPMNPlane>");
    xml[0] = xml[0].split(`<bpmndi:BPMNShape id="Participant_`);
    xml[0][participantId + 1] += xmlDiagram;
    xml[0] = xml[0].join(`<bpmndi:BPMNShape id="Participant_`);
    return xml.join("</bpmndi:BPMNPlane>");
}

export default addDiagram;