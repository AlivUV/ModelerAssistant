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
        interEvts: 0,
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
 * Modify the current diagram by adding a message start event which receives a message at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addMessageStart = (startName, participantId, bpmn) => {
    const id = bpmn.startEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:startEvent id="StartEvent_${id}" name="${startName}">
            <bpmn:messageEventDefinition id="MessageStart_${id}" />
        </bpmn:startEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="StartEvent_${id}_di" bpmnElement="StartEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "MessageStart",
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
 * Modify the current diagram by adding a timer start event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addTimerStart = (startName, participantId, bpmn) => {
    const id = bpmn.startEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:startEvent id="StartEvent_${id}" name="${startName}">
            <bpmn:timerEventDefinition id="TimerStart_${id}" />
        </bpmn:startEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="StartEvent_${id}_di" bpmnElement="StartEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "TimerStart",
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
 * Modify the current diagram by adding a start event which receives a condition at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addConditionalStart = (startName, participantId, bpmn) => {
    const id = bpmn.startEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:startEvent id="StartEvent_${id}" name="${startName}">
            <bpmn:conditionalEventDefinition id="ConditionalStart_${id}">
                <bpmn:condition xsi:type="bpmn:tFormalExpression" />
            </bpmn:conditionalEventDefinition>
        </bpmn:startEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="StartEvent_${id}_di" bpmnElement="StartEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "ConditionalStart",
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
 * Modify the current diagram by adding a timer start event which receives a message at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addSignalStart = (startName, participantId, bpmn) => {
    const id = bpmn.startEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:startEvent id="StartEvent_${id}" name="${startName}">
            <bpmn:signalEventDefinition id="Signaltart_${id}" />
        </bpmn:startEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="StartEvent_${id}_di" bpmnElement="StartEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "SignalStart",
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
 * Modify the current diagram by adding an end event at the specified participant.
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
 * Modify the current diagram by adding an message end event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addMessageEnd = (endName, participantId, bpmn) => {
    const id = bpmn.endEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const endDef = `\t\t<bpmn:endEvent id="EndEvent_${id}" name="${endName}">
            <bpmn:messageEventDefinition id="MessageEnd_${id}" />
        </bpmn:endEvent>\n`;
    const endDiagram = `\t\t<bpmndi:BPMNShape id="EndEvent_${id}_di" bpmnElement="EndEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(endDef, endDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "MessageEnd",
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
 * Modify the current diagram by adding an error end event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addErrorEnd = (endName, participantId, bpmn) => {
    const id = bpmn.endEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const endDef = `\t\t<bpmn:endEvent id="EndEvent_${id}" name="${endName}">
            <bpmn:errorEventDefinition id="ErrorEnd_${id}" />
        </bpmn:endEvent>\n`;
    const endDiagram = `\t\t<bpmndi:BPMNShape id="EndEvent_${id}_di" bpmnElement="EndEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(endDef, endDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "ErrorEnd",
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
 * Modify the current diagram by adding an escalation end event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addEscalationEnd = (endName, participantId, bpmn) => {
    const id = bpmn.endEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const endDef = `\t\t<bpmn:endEvent id="EndEvent_${id}" name="${endName}">
            <bpmn:escalationEventDefinition id="EscalationEnd_${id}" />
        </bpmn:endEvent>\n`;
    const endDiagram = `\t\t<bpmndi:BPMNShape id="EndEvent_${id}_di" bpmnElement="EndEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(endDef, endDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "EscalationEnd",
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
 * Modify the current diagram by adding a signal end event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addSignalEnd = (endName, participantId, bpmn) => {
    const id = bpmn.endEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const endDef = `\t\t<bpmn:endEvent id="EndEvent_${id}" name="${endName}">
            <bpmn:signalEventDefinition id="SignalEnd_${id}" />
        </bpmn:endEvent>\n`;
    const endDiagram = `\t\t<bpmndi:BPMNShape id="EndEvent_${id}_di" bpmnElement="EndEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(endDef, endDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "SignalEnd",
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
 * Modify the current diagram by adding a compensation end event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addCompensationEnd = (endName, participantId, bpmn) => {
    const id = bpmn.endEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const endDef = `\t\t<bpmn:endEvent id="EndEvent_${id}" name="${endName}">
            <bpmn:compensateEventDefinition id="CompensationEnd_${id}" />
        </bpmn:endEvent>\n`;
    const endDiagram = `\t\t<bpmndi:BPMNShape id="EndEvent_${id}_di" bpmnElement="EndEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(endDef, endDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "CompensationEnd",
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
 * Modify the current diagram by adding a terminate end event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addTerminateEnd = (endName, participantId, bpmn) => {
    const id = bpmn.endEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const endDef = `\t\t<bpmn:endEvent id="EndEvent_${id}" name="${endName}">
            <bpmn:terminateEventDefinition id="TerminateEnd_${id}" />
        </bpmn:endEvent>\n`;
    const endDiagram = `\t\t<bpmndi:BPMNShape id="EndEvent_${id}_di" bpmnElement="EndEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(endDef, endDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "TerminateEnd",
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
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addIntermediateEvent = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateThrowEvent id="IntermediateEvent_${id}" name="${intermediateName}">\n\t\t</bpmn:intermediateThrowEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "IntermediateEvent",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addTimerIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateCatchEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:timerEventDefinition id="TimerIntermediate_${id}" />
        </bpmn:intermediateCatchEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "TimerIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addMessageCatchIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateCatchEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:messageEventDefinition id="MessageCatchIntermediate_${id}" />
        </bpmn:intermediateCatchEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "MessageCatchIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addMessageThrowIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateThrowEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:messageEventDefinition id="MessageThrowIntermediate_${id}" />
        </bpmn:intermediateThrowEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "MessageThrowIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addEscalationIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateThrowEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:escalationEventDefinition id="EscalationIntermediate_${id}" />
        </bpmn:intermediateThrowEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "EscalationIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addConditionalIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateCatchEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:conditionalEventDefinition id="ConditionalIntermediate_${id}">
                <bpmn:condition xsi:type="bpmn:tFormalExpression" />
            </bpmn:conditionalEventDefinition>
        </bpmn:intermediateCatchEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "ConditionalIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addCompensationIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateThrowEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:compensateEventDefinition id="CompensationIntermediate_${id}" />
        </bpmn:intermediateThrowEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "CompensationIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addLinkCatchIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateCatchEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:linkEventDefinition id="LinkCatchIntermediate_${id}" />
        </bpmn:intermediateCatchEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "LinkCatchIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addLinkThrowIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateThrowEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:linkEventDefinition id="LinkThrowIntermediate_${id}" />
        </bpmn:intermediateThrowEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "LinkThrowIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addSignalCatchIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateCatchEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:signalEventDefinition id="SignalCatchIntermediate_${id}" />
        </bpmn:intermediateCatchEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "SignalCatchIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
    return bpmn;
}


/**
 * Modify the current diagram by adding an intermediate event at the specified participant.
 * @param {Number} participantId The id of the participant to which the event is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addSignalThrowIntermediate = (intermediateName, participantId, bpmn) => {
    const id = bpmn.interEvts + 1;
    const width = 36;
    const height = 36;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const startDef = `\t\t<bpmn:intermediateThrowEvent id="IntermediateEvent_${id}" name="${intermediateName}">
            <bpmn:signalEventDefinition id="SignalThrowIntermediate_${id}" />
        </bpmn:intermediateThrowEvent>\n`;
    const startDiagram = `\t<bpmndi:BPMNShape id="IntermediateEvent_${id}_di" bpmnElement="IntermediateEvent_${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(startDef, startDiagram, participantId, bpmn.xml);

    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "SignalThrowIntermediate",
        id: `IntermediateEvent_${id}`,
        name: intermediateName,
        width: width,
        height: height,
        x: bpmn.participants[participantId].lastX - (width / 2),
        y: yCenter
    });
    bpmn.interEvts += 1;
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
    const taskDef = `\t\t<bpmn:task id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:task>\n`;
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
 * Modify the current diagram by adding an user task at the specified participant.
 * @param {String} taskName The name of the new task.
 * @param {Number} participantId The id of the participant to which the task is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addUserTask = (taskName, participantId, bpmn) => {
    const id = bpmn.tasks + 1;
    const width = 100;
    const height = 80
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const taskDef = `\t\t<bpmn:userTask id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:userTask>\n`;
    const taskXML = `\t\t<bpmndi:BPMNShape id="US-${id}_di" bpmnElement="US-${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(taskDef, taskXML, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "UserTask",
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
 * Modify the current diagram by adding a manual task at the specified participant.
 * @param {String} taskName The name of the new task.
 * @param {Number} participantId The id of the participant to which the task is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addManualTask = (taskName, participantId, bpmn) => {
    const id = bpmn.tasks + 1;
    const width = 100;
    const height = 80
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const taskDef = `\t\t<bpmn:manualTask id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:manualTask>\n`;
    const taskXML = `\t\t<bpmndi:BPMNShape id="US-${id}_di" bpmnElement="US-${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(taskDef, taskXML, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "ManualTask",
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
 * Modify the current diagram by adding a service task at the specified participant.
 * @param {String} taskName The name of the new task.
 * @param {Number} participantId The id of the participant to which the task is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addServiceTask = (taskName, participantId, bpmn) => {
    const id = bpmn.tasks + 1;
    const width = 100;
    const height = 80
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const taskDef = `\t\t<bpmn:serviceTask id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:serviceTask>\n`;
    const taskXML = `\t\t<bpmndi:BPMNShape id="US-${id}_di" bpmnElement="US-${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(taskDef, taskXML, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "ServiceTask",
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
 * Modify the current diagram by adding a message catch task at the specified participant.
 * @param {String} taskName The name of the new task.
 * @param {Number} participantId The id of the participant to which the task is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addMessageCatchTask = (taskName, participantId, bpmn) => {
    const id = bpmn.tasks + 1;
    const width = 100;
    const height = 80
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const taskDef = `\t\t<bpmn:receiveTask id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:receiveTask>\n`;
    const taskXML = `\t\t<bpmndi:BPMNShape id="US-${id}_di" bpmnElement="US-${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(taskDef, taskXML, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "MessageCatchTask",
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
 * Modify the current diagram by adding a message throw task at the specified participant.
 * @param {String} taskName The name of the new task.
 * @param {Number} participantId The id of the participant to which the task is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addMessageThrowTask = (taskName, participantId, bpmn) => {
    const id = bpmn.tasks + 1;
    const width = 100;
    const height = 80
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const taskDef = `\t\t<bpmn:sendTask id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:sendTask>\n`;
    const taskXML = `\t\t<bpmndi:BPMNShape id="US-${id}_di" bpmnElement="US-${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(taskDef, taskXML, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "MessageThrowTask",
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
 * Modify the current diagram by adding a business rule task at the specified participant.
 * @param {String} taskName The name of the new task.
 * @param {Number} participantId The id of the participant to which the task is to be added.
 * @param {{startEvts: Number, participants: Array, xml: String}} bpmn 
 *  A valid object representing the actual bpmn diagram.
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addBusinessRuleTask = (taskName, participantId, bpmn) => {
    const id = bpmn.tasks + 1;
    const width = 100;
    const height = 80
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const taskDef = `\t\t<bpmn:businessRuleTask id="US-${id}" name="${taskName}" uh:priority="Very low" uh:points="1" uh:smart="false">\n\t\t</bpmn:businessRuleTask>\n`;
    const taskXML = `\t\t<bpmndi:BPMNShape id="US-${id}_di" bpmnElement="US-${id}">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
            <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>\n\t`;

    bpmn.xml = addXmlElement(taskDef, taskXML, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "BusinessRuleTask",
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
    // Both tasks belong to the same participant.
    if (sourceParticipant === targetParticipant)
        return addSequenceFlow(sourceTask, targetTask, sourceParticipant, bpmn);
    // Two participants communicate between tasks
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


/**
 * 
 * @param {String} gateName 
 * @param {Number} participantId 
 * @param {{gateways: Number, participants: Array, xml: String}} bpmn 
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addInclusiveGateway = (gateName, participantId, bpmn) => {
    const id = bpmn.gateways + 1;
    const width = 50;
    const height = 50;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const gatewayDef = `<bpmn:inclusiveGateway id="Gateway_${id}" name="${gateName}">
        </bpmn:inclusiveGateway>\n`
    const gatewayDiagram = `\t\t<bpmndi:BPMNShape id="Gateway_${id}_di" bpmnElement="Gateway_${id}" isMarkerVisible="true">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n`

    bpmn.xml = addXmlElement(gatewayDef, gatewayDiagram, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "InclusiveGateway",
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


/**
 * 
 * @param {String} gateName 
 * @param {Number} participantId 
 * @param {{gateways: Number, participants: Array, xml: String}} bpmn 
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addParallelGateway = (gateName, participantId, bpmn) => {
    const id = bpmn.gateways + 1;
    const width = 50;
    const height = 50;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const gatewayDef = `<bpmn:parallelGateway id="Gateway_${id}" name="${gateName}">
        </bpmn:parallelGateway>\n`
    const gatewayDiagram = `\t\t<bpmndi:BPMNShape id="Gateway_${id}_di" bpmnElement="Gateway_${id}" isMarkerVisible="true">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n`

    bpmn.xml = addXmlElement(gatewayDef, gatewayDiagram, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "ParallelGateway",
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


/**
 * 
 * @param {String} gateName 
 * @param {Number} participantId 
 * @param {{gateways: Number, participants: Array, xml: String}} bpmn 
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addEventBasedGateway = (gateName, participantId, bpmn) => {
    const id = bpmn.gateways + 1;
    const width = 50;
    const height = 50;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const gatewayDef = `<bpmn:eventBasedGateway id="Gateway_${id}" name="${gateName}">
        </bpmn:eventBasedGateway>\n`
    const gatewayDiagram = `\t\t<bpmndi:BPMNShape id="Gateway_${id}_di" bpmnElement="Gateway_${id}" isMarkerVisible="true">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n`

    bpmn.xml = addXmlElement(gatewayDef, gatewayDiagram, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "EventBasedGateway",
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


/**
 * 
 * @param {String} gateName 
 * @param {Number} participantId 
 * @param {{gateways: Number, participants: Array, xml: String}} bpmn 
 * @returns {{startEvts: Number, endEvts: Number, tasks: Number, flows: Number, gateways: Number, participants: Array, xml: String}}
 */
const addComplexGateway = (gateName, participantId, bpmn) => {
    const id = bpmn.gateways + 1;
    const width = 50;
    const height = 50;
    const yCenter = bpmn.participants[participantId].y + (bpmn.participants[participantId].height / 2);
    const gatewayDef = `<bpmn:complexGateway id="Gateway_${id}" name="${gateName}">\n\t\t</bpmn:complexGateway>\n`
    const gatewayDiagram = `\t\t<bpmndi:BPMNShape id="Gateway_${id}_di" bpmnElement="Gateway_${id}" isMarkerVisible="true">
            <dc:Bounds x="${bpmn.participants[participantId].lastX + xPad}" y="${yCenter - (height / 2)}" width="${width}" height="${height}" />
        </bpmndi:BPMNShape>\n`

    bpmn.xml = addXmlElement(gatewayDef, gatewayDiagram, participantId, bpmn.xml);
    bpmn.participants[participantId].lastX += xPad + width;
    bpmn.participants[participantId].elements.push({
        type: "ComplexGateway",
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
        // Start Events
        case names.startEvent:
            return addStart(element.name, element.participant, bpmn);
        case names.messageStart:
            return addMessageStart(element.name, element.participant, bpmn);
        case names.timerStart:
            return addTimerStart(element.name, element.participant, bpmn);
        case names.signalStart:
            return addSignalStart(element.name, element.participant, bpmn);
        case names.conditionalStart:
            return addConditionalStart(element.name, element.participant, bpmn);
        // End Events
        case names.endEvent:
            return addEnd(element.name, element.participant, bpmn);
        case names.messageEnd:
            return addMessageEnd(element.name, element.participant, bpmn);
        case names.errorEnd:
            return addErrorEnd(element.name, element.participant, bpmn);
        case names.escalationEnd:
            return addEscalationEnd(element.name, element.participant, bpmn);
        case names.signalEnd:
            return addSignalEnd(element.name, element.participant, bpmn);
        case names.compensationEnd:
            return addCompensationEnd(element.name, element.participant, bpmn);
        case names.terminateEnd:
            return addTerminateEnd(element.name, element.participant, bpmn);
        // Intermediate events
        case names.intermediateEvent:
            return addIntermediateEvent(element.name, element.participant, bpmn);
        case names.timerIntermediate:
            return addTimerIntermediate(element.name, element.participant, bpmn);
        case names.messageCatchIntermediate:
            return addMessageCatchIntermediate(element.name, element.participant, bpmn);
        case names.messageThrowIntermediate:
            return addMessageThrowIntermediate(element.name, element.participant, bpmn);
        case names.escalationIntermediate:
            return addEscalationIntermediate(element.name, element.participant, bpmn);
        case names.conditionalIntermediate:
            return addConditionalIntermediate(element.name, element.participant, bpmn);
        case names.compensationIntermediate:
            return addCompensationIntermediate(element.name, element.participant, bpmn);
        case names.linkCatchIntermediate:
            return addLinkCatchIntermediate(element.name, element.participant, bpmn);
        case names.linkThrowIntermediate:
            return addLinkThrowIntermediate(element.name, element.participant, bpmn);
        case names.signalCatchIntermediate:
            return addSignalCatchIntermediate(element.name, element.participant, bpmn);
        case names.signalThrowIntermediate:
            return addSignalThrowIntermediate(element.name, element.participant, bpmn);
        // Tasks
        case names.task:
            return addTask(element.name, element.participant, bpmn);
        case names.userTask:
            return addUserTask(element.name, element.participant, bpmn);
        case names.manualTask:
            return addManualTask(element.name, element.participant, bpmn);
        case names.serviceTask:
            return addServiceTask(element.name, element.participant, bpmn);
        case names.messageCatchTask:
            return addMessageCatchTask(element.name, element.participant, bpmn);
        case names.messageThrowTask:
            return addMessageThrowTask(element.name, element.participant, bpmn);
        case names.businessRuleTask:
            return addBusinessRuleTask(element.name, element.participant, bpmn);
        case names.scriptTask:
            return addScriptTask(element.name, element.participant, bpmn);
        // Gateways
        case names.exclusiveGateway:
            return addGateway(element.name, element.participant, bpmn);
        case names.inclusiveGateway:
            return addInclusiveGateway(element.name, element.participant, bpmn);
        case names.parallelGateway:
            return addParallelGateway(element.name, element.participant, bpmn);
        case names.eventBasedGateway:
            return addEventBasedGateway(element.name, element.participant, bpmn);
        case names.complexGateway:
            return addComplexGateway(element.name, element.participant, bpmn);

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
    const names = {
        startEvent: "startevent",
        timerStart: "timerstart",
        messageStart: "messagestart",
        conditionalStart: "conditionalstart",
        signalStart: "signalstart",
        endEvent: "endevent",
        messageEnd: "messageend",
        errorEnd: "errorend",
        escalationEnd: "escalationend",
        signalEnd: "signalend",
        compensationEnd: "compensationend",
        terminateEnd: "terminateend",
        intermediateEvent: "intermediateevent",
        timerIntermediate: "timerintermediate",
        messageCatchIntermediate: "messagecatchintermediate",
        messageThrowIntermediate: "messagethrowintermediate",
        escalationIntermediate: "escalationintermediate",
        conditionalIntermediate: "conditionalintermediate",
        compensationIntermediate: "compensationintermediate",
        linkCatchIntermediate: "linkcatchintermediate",
        linkThrowIntermediate: "linkthrowintermediate",
        signalCatchIntermediate: "signalcatchintermediate",
        signalThrowIntermediate: "signalthrowintermediate",
        task: "task",
        userTask: "usertask",
        manualTask: "manualtask",
        serviceTask: "servicetask",
        messageCatchTask: "messagecatchtask",
        messageThrowTask: "messagethrowtask",
        businessRuleTask: "businessruletask",
        scriptTask: "scripttask",
        exclusiveGateway: "exclusivegateway",
        inclusiveGateway: "inclusivegateway",
        parallelGateway: "parallelgateway",
        eventBasedGateway: "eventbasedgateway",
        complexGateway: "complexgateway"
    }

    let bpmn = initBPMN();

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

    for (let i = 0; i < jsonBPMN.elements.length; i++) {
        jsonBPMN.elements[i] = {
            ...jsonBPMN.elements[i],
            participant: findParticipant(jsonBPMN.elements, i, bpmn.participants)
        }
        bpmn = addElement(jsonBPMN.elements[i], names, bpmn)
    }

    jsonBPMN.flows.forEach(flow => {
        try {
            const [sParticipant, source] = findElement(flow.source, bpmn.participants);
            const [tParticipant, target] = findElement(flow.target, bpmn.participants);

            bpmn = addFlow(source, sParticipant, target, tParticipant, bpmn);
        } catch (error) {
            // Continue to the next flow.
        }
    });

    return bpmn.xml;
}