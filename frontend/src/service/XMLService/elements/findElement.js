/**
 * Finds an element in the list of participants and returns its index and the element itself.
 * @param {String} elementName - The name of the element to find.
 * @param {Array<Object>} participants - An array of participant objects, each containing an array of element objects.
 * @return {Array<Number|Object>} An array containing the index of the participant and the element object, or [-1, undefined] if the element is not found.
 */
const findElement = (elementName, participants) => {
    const index = participants.findIndex(participant => {
        return participant.elements.find(e => e.name === elementName)
    });
    return [index, participants[index].elements.find(e => e.name === elementName)];
}

export default findElement;