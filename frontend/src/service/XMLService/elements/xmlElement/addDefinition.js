/**
 * Auxiliar function that modify the current xml by adding the xml specified.
 * @param {String} xmlDefinition 
 * @param {Number} participantId 
 * @param {String} xml 
 * @returns {String}
 */
const addDefinition = (xmlDefinition, participantId, xml) => {
    xml = xml.split("</bpmn:process>");
    xml[participantId] += xmlDefinition;
    return xml.join("</bpmn:process>")
}

export default addDefinition;