import addDefinition from "./addDefinition"
import addDiagram from "./addDiagram"


/**
 * Auxiliar function that modify the current xml by adding the xml specified.
 * @param {String} xmlDefinition 
 * @param {String} xmlDiagram 
 * @param {Number} participantId 
 * @param {String} xml 
 * @returns {String}
 */
const addXmlElement = (xmlDefinition, xmlDiagram, participantId, xml) => {
    xml = addDefinition(xmlDefinition, participantId, xml)

    return addDiagram(xmlDiagram, participantId, xml)
}

export default addXmlElement;