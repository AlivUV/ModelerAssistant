import { addSequenceFlow } from "./addSequenceFlow";
import { addMessageFlow } from "./addMessageFlow";

/**
 * Modify the current diagram by adding a flow conecting the specified elements.
 * @param {{id: String, width: Number, x: Number, y: Number}} sourceTask 
 * @param {{id: String, width: Number, x: Number, y: Number}} targetTask 
 * @param {Number} participantId
 * @param {{flows: Number, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addFlow = (sourceTask, sourceParticipant, targetTask, targetParticipant, bpmn) => {
    // Both tasks belong to the same participant.
    if (sourceParticipant === targetParticipant)
        return addSequenceFlow(sourceTask, targetTask, sourceParticipant, bpmn);
    // Two participants communicate between tasks
    return addMessageFlow(sourceTask, targetTask, bpmn);
}

export { addFlow };