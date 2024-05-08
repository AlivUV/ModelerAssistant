import {
    addConditionalStart,
    addMessageStart,
    addSignalStart,
    addTimerStart,
    addStart
} from "./start"
import {
    addCompensationEnd,
    addEscalationEnd,
    addTerminateEnd,
    addMessageEnd,
    addSignalEnd,
    addErrorEnd,
    addEnd
} from "./end";
import {
    addCompensationIntermediate,
    addMessageCatchIntermediate,
    addMessageThrowIntermediate,
    addConditionalIntermediate,
    addSignalCatchIntermediate,
    addSignalThrowIntermediate,
    addEscalationIntermediate,
    addLinkCatchIntermediate,
    addLinkThrowIntermediate,
    addTimerIntermediate,
    addIntermediateEvent
} from "./intermediate"
import {
    addBusinessRuleTask,
    addMessageCatchTask,
    addMessageThrowTask,
    addServiceTask,
    addManualTask,
    addScriptTask,
    addUserTask,
    addTask
} from "./task"
import {
    addEventBasedGateway,
    addExclusiveGateway,
    addInclusiveGateway,
    addParallelGateway,
    addComplexGateway
} from "./gateway"


const addElement = (element, names, bpmn) => {
    switch (element.type.replaceAll(" ", "").toLowerCase()) {
        // Start Events
        case names.conditionalStart:
            return addConditionalStart(element.name, element.participant, bpmn);
        case names.messageStart:
            return addMessageStart(element.name, element.participant, bpmn);
        case names.signalStart:
            return addSignalStart(element.name, element.participant, bpmn);
        case names.timerStart:
            return addTimerStart(element.name, element.participant, bpmn);
        case names.startEvent:
            return addStart(element.name, element.participant, bpmn);
        // End Events
        case names.compensationEnd:
            return addCompensationEnd(element.name, element.participant, bpmn);
        case names.escalationEnd:
            return addEscalationEnd(element.name, element.participant, bpmn);
        case names.terminateEnd:
            return addTerminateEnd(element.name, element.participant, bpmn);
        case names.messageEnd:
            return addMessageEnd(element.name, element.participant, bpmn);
        case names.signalEnd:
            return addSignalEnd(element.name, element.participant, bpmn);
        case names.errorEnd:
            return addErrorEnd(element.name, element.participant, bpmn);
        case names.endEvent:
            return addEnd(element.name, element.participant, bpmn);
        // Intermediate events
        case names.messageCatchIntermediate:
            return addMessageCatchIntermediate(element.name, element.participant, bpmn);
        case names.messageThrowIntermediate:
            return addMessageThrowIntermediate(element.name, element.participant, bpmn);
        case names.compensationIntermediate:
            return addCompensationIntermediate(element.name, element.participant, bpmn);
        case names.conditionalIntermediate:
            return addConditionalIntermediate(element.name, element.participant, bpmn);
        case names.signalCatchIntermediate:
            return addSignalCatchIntermediate(element.name, element.participant, bpmn);
        case names.signalThrowIntermediate:
            return addSignalThrowIntermediate(element.name, element.participant, bpmn);
        case names.escalationIntermediate:
            return addEscalationIntermediate(element.name, element.participant, bpmn);
        case names.linkCatchIntermediate:
            return addLinkCatchIntermediate(element.name, element.participant, bpmn);
        case names.linkThrowIntermediate:
            return addLinkThrowIntermediate(element.name, element.participant, bpmn);
        case names.timerIntermediate:
            return addTimerIntermediate(element.name, element.participant, bpmn);
        case names.intermediateEvent:
            return addIntermediateEvent(element.name, element.participant, bpmn);
        // Tasks
        case names.messageCatchTask:
            return addMessageCatchTask(element.name, element.participant, bpmn);
        case names.messageThrowTask:
            return addMessageThrowTask(element.name, element.participant, bpmn);
        case names.businessRuleTask:
            return addBusinessRuleTask(element.name, element.participant, bpmn);
        case names.serviceTask:
            return addServiceTask(element.name, element.participant, bpmn);
        case names.manualTask:
            return addManualTask(element.name, element.participant, bpmn);
        case names.scriptTask:
            return addScriptTask(element.name, element.participant, bpmn);
        case names.userTask:
            return addUserTask(element.name, element.participant, bpmn);
        case names.task:
            return addTask(element.name, element.participant, bpmn);
        // Gateways
        case names.eventBasedGateway:
            return addEventBasedGateway(element.name, element.participant, bpmn);
        case names.exclusiveGateway:
            return addExclusiveGateway(element.name, element.participant, bpmn);
        case names.inclusiveGateway:
            return addInclusiveGateway(element.name, element.participant, bpmn);
        case names.parallelGateway:
            return addParallelGateway(element.name, element.participant, bpmn);
        case names.complexGateway:
            return addComplexGateway(element.name, element.participant, bpmn);

        default:
            return addTask(element.name, element.participant, bpmn);
    }
}

export default addElement;