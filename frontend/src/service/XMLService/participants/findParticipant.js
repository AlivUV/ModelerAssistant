/**
 * Finds the participant for an element in the array.
 * If the participant is undefined, it searches for the next defined participant.
 *
 * @param {Array<Object>} elements - The array of elements.
 * @param {Number} i - The index of the element for which to find a participant.
 * @returns {Number} The participant's index in the participants Array for the element at index i.
 */
const findUndefinedParticipant = (elements, i) => {
    let modifier = -1;

    if (i < 1)
        elements[i].participant = elements[i = modifier = 1].participant;

    while (!elements[i].participant && (i + modifier) > 0 && (i + modifier) < elements.length)
        elements[i].participant = elements[i += modifier].participant;

    return elements[i].participant;
}


/**
 * Finds the participant for an element in the array, using findUndefinedParticipant.
 * If the participant is a string, it finds the index of the participant in the participants array.
 *
 * @param {Array<Object>} elements - The array of elements.
 * @param {Number} i - The index of the element for which to find a participant.
 * @param {Array<Object>} participants - The array of participants.
 * @returns {Number} The participant's index in the participants Array for the element at index i.
 */
const findParticipant = (elements, i, participants) => {

    if (!elements[i].participant)
        elements[i].participant = findUndefinedParticipant(elements, i);

    if (typeof (elements[i].participant) !== "number")
        elements[i].participant = participants.findIndex(e => e.name === elements[i].participant);

    return (elements[i].participant === -1) ? 0 : elements[i].participant;
}

export default findParticipant;