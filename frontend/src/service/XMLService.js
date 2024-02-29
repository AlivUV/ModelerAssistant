const xInit = 0;
const xPad = 50;
const yPad = 50;

/**
 * Creates the object of an empty bpmn.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const initBPMN = () => {
    return {
        startEvts: 0,
        endEvts: 0,
        tasks: 0,
        flows: 0,
        gateways: 0,
        participants: [],
        xml: `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_0xcv3nk" targetNamespace="http://bpmn.io/schema/bpmn" r="Camunda Modeler" rVersion="3.0.0-dev">
    <bpmn:collaboration id="Collaboration_1">
    </bpmn:collaboration>
</bpmn:definitions>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_1">
    </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
    `};
}

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

/**
 * Modify the current diagram by adding a start event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addStart = (startName, participantId, bpmn) => {
    const id = bpmn.startEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:startEvent id="StartEvent_${id}" name="${startName}">\n\t\t</bpmn:startEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="StartEvent_${id}_di" bpmnElement="StartEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "StartEvent",
        id: `StartEvent_${id}`,
        name: startName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.startEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding a start event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addEnd = (endName, participantId, bpmn) => {
    const id = bpmn.endEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const endDef = `\t\t<bpmn:endEvent id="EndEvent_${id}" name="${endName}">\n\t\t</bpmn:endEvent>\n`;
    const endDiagram = `\t\t<bpmndi:BPMNShape id="EndEvent_${id}_di" bpmnElement="EndEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(endDef, endDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "EndEvent",
        id: `EndEvent_${id}`,
        name: endName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.endEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding a task at the specified participant.
 * @param {String} taskName The name of the new task.
 * @param {Number} participantId The id of the participant to which the task is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addTask = (taskName, participantId, bpmn) => {
    const id = bpmn.tasks + 1;
    const width = 100;
    const height = 80
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const taskDef = `\t\t<bpmn:Task id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:Task>\n`;
    const taskXML = `\t\t<bpmndi:BPMNShape id="US-${id}_di" bpmnElement="US-${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(taskDef, taskXML, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "Task",
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
    const flowId = bpmn.flows + 1;
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
    bpmn.flows += 1;
    return bpmn;
}


const addMessageFlow = (sourceTask, targetTask, bpmn) => {
    const id = bpmn.flows + 1;
    let xml;

    //Add definitions.
    {
        const flowDef = `\t\t<bpmn:messageFlow id="Flow_${id}" sourceRef="${sourceTask.id}" targetRef="${targetTask.id}" />`

        xml = bpmn.xml.split("</bpmn:collaboration>");
        xml[0] += flowDef;
    }

    //Add diagram.
    {
        const flowDiagram = (sourceTask.y < targetTask.y)
            ? `\t\t<bpmndi:BPMNEdge id="Flow_${id}_di" bpmnElement="Flow_${id}">
            <di:waypoint x="${sourceTask.x}" y="${sourceTask.y + (sourceTask.height / 2)}" />
            <di:waypoint x="${sourceTask.x}" y="${sourceTask.y + (sourceTask.height / 2) + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${sourceTask.y + (sourceTask.height / 2) + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${targetTask.y - (targetTask.height / 2)}" />\n\t\t</bpmndi:BPMNEdge>\n`
            : `\t\t<bpmndi:BPMNEdge id="Flow_${id}_di" bpmnElement="Flow_${id}">
            <di:waypoint x="${sourceTask.x}" y="${sourceTask.y - (sourceTask.height / 2)}" />
            <di:waypoint x="${sourceTask.x}" y="${targetTask.y + (targetTask.height / 2) + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${targetTask.y + (targetTask.height / 2) + yPad}" />
            <di:waypoint x="${targetTask.x}" y="${targetTask.y + (targetTask.height / 2)}" />\n\t\t</bpmndi:BPMNEdge>\n`;

        xml[1] = xml[1].split("</bpmndi:BPMNPlane>");
        xml[1][0] += flowDiagram;
        xml[1] = xml[1].join("</bpmndi:BPMNPlane>");
    }
    bpmn.flows += 1;
    bpmn.xml = xml.join("</bpmn:collaboration>");
    return bpmn;
}


const addFlow = (sourceTask, sourceParticipant, targetTask, targetParticipant, bpmn) => {
    if (sourceParticipant === targetParticipant)
        return addSequenceFlow(sourceTask, targetTask, sourceParticipant, bpmn);

    return addMessageFlow(sourceTask, targetTask, bpmn);
}


/**
 * 
 * @param {String} gateName 
 * @param {Number} participantId 
 * @param {{gateways: Number, participants: Array, xml: String}} bpmn 
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addGateway = (gateName, participantId, bpmn) => {
    const id = bpmn.gateways + 1;
    const width = 50;
    const height = 50;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const gatewayDef = `<bpmn:exclusiveGateway id="Gateway_${id}" name="${gateName}">
        </bpmn:exclusiveGateway>\n`
    const gatewayDiagram = `\t\t<bpmndi:BPMNShape id="Gateway_${id}_di" bpmnElement="Gateway_${id}" isMarkerVisible="true">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n`

    bpmn.xml = addXmlElement(gatewayDef, gatewayDiagram, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "Gateway",
        id: `Gateway_${id}`,
        name: gateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.gateways += 1;

    return bpmn;
}


const addElement = (element, names, bpmn) => {
    switch (element.type.replaceAll(" ", "").toLowerCase()) {
        case names.startEvent:
            return addStart(element.name, element.participant, bpmn);
        case names.task:
            return addTask(element.name, element.participant, bpmn);
        case names.usertask:
            return addTask(element.name, element.participant, bpmn);
        case names.servicetask:
            return addTask(element.name, element.participant, bpmn);
        case names.gateway:
            return addGateway(element.name, element.participant, bpmn);
        case names.endEvent:
            return addEnd(element.name, element.participant, bpmn);

        default:
            return addTask(element.name, element.participant, bpmn);
    }
}


const findUndefinedParticipant = (elements, i) => {
    let modifier = -1;

    if (i < 1)
        elements[i].participant = elements[i = modifier = 1].participant;

    while (!elements[i].participant && (i + modifier) > 0 && (i + modifier) < elements.length)
        elements[i].participant = elements[i += modifier].participant;

    return elements[i].participant;
}


const findParticipant = (elements, i, participants) => {

    if (!elements[i].participant)
        elements[i].participant = findUndefinedParticipant(elements, i);

    if (typeof (elements[i].participant) !== "number")
        elements[i].participant = participants.findIndex(e => e.name === elements[i].participant);

    return (elements[i].participant === -1) ? 0 : elements[i].participant;
}


const findElement = (elementName, participants) => {
    const index = participants.findIndex(participant => {
        return participant.elements.find(e => e.name === elementName)
    });
    return [index, participants[index].elements.find(e => e.name === elementName)];
}


export const buildBPMN = (jsonBPMN) => {
    let bpmn = initBPMN();

    //console.log(`Init xml building`);

    if (!jsonBPMN.process) {
        jsonBPMN.process = jsonBPMN.Process;
        delete jsonBPMN.Process;
    }

    if (!jsonBPMN.participants) {
        jsonBPMN.participants = jsonBPMN.process.participants || [];
        delete jsonBPMN.process.participants
    }

    if (!jsonBPMN.elements) {
        jsonBPMN.elements = jsonBPMN.process.elements || [];
        delete jsonBPMN.process.elements
    }

    if (!jsonBPMN.flows) {
        jsonBPMN.flows = jsonBPMN.process.flows || [];
        delete jsonBPMN.process.flows
    }

    delete jsonBPMN.process

    jsonBPMN.participants.forEach(participant => {
        if (typeof (participant) === "string")
            bpmn = addParticipant(participant, bpmn);
        else
            bpmn = addParticipant(participant.name, bpmn);
    });

    const names = {
        startEvent: "startevent",
        task: "task",
        usertask: "usertask",
        servicetask: "servicetask",
        gateway: "exclusivegateway",
        endEvent: "endevent"
    };
    for (let i = 0; i < jsonBPMN.elements.length; i++) {
        jsonBPMN.elements[i] = {
            ...jsonBPMN.elements[i],
            participant: findParticipant(jsonBPMN.elements, i, bpmn.participants)
        }
        bpmn = addElement(jsonBPMN.elements[i], names, bpmn)
    }

    jsonBPMN.flows.forEach(flow => {
        const [sParticipant, source] = findElement(flow.source, bpmn.participants);
        const [tParticipant, target] = findElement(flow.target, bpmn.participants);

        bpmn = addFlow(source, sParticipant, target, tParticipant, bpmn);
    });

    return bpmn.xml;
}