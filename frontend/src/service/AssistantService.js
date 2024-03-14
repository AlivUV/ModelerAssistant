import {
    API_URL
} from '../utils';

import { buildBPMN } from './XMLService'

const makePrompt = (description, activities) => {
    return `Proporcióname detalles descriptivos en formato JSON para el siguiente proceso: ${description}, ten en cuenta que el proceso se debe representar en formato BPMN 2.0 y debe incluir al menos los siguientes elementos: 

Participantes del proceso.
Inicio del proceso (Start Event).
Tareas de usuario (User Tasks).
Tareas de servicio (Service Tasks).
Puertas de enlace Exclusivas (Exclusive Gateways).
Fin del proceso (End Event).

Asegúrate de incluir para cada una de las tareas el nombre de la tarea y el participante al que está asociado, además de indicar cómo estos elementos están conectados mediante flujos de secuencia (Sequence Flows), ten en cuenta el orden de los elementos en el diagrama y quiero que los componentes del JSON sigan el siguiente orden: Process -> participants -> elements -> flows y quiero que incluyas todos los gateways que consideres necesarios dentro de la misma lista de los elements.
Quiero que tu respuesta siga este mismo formato conservando su estructura:
        {
            "participants": [
                { "name": "Participante Implicado" }, ...
        ],
            "elements": [
                {
                    "type": "Task",
                    "name": "Nombre tarea",
                    "participant": "Participante Implicado"
                }
            ]
        "flows": [
            {
                "source": "Nombre tarea",
                "target": "Nombre tarea"
            }
        ]
    } `
}


const makePromptGemini = (description, activities) => {
    return `Proporcióname detalles descriptivos en formato JSON para el siguiente proceso: ${description}, ten en cuenta que el proceso se debe representar en formato BPMN 2.0 y debe incluir al menos los siguientes elementos:

    1. Participantes del proceso(participants).
    2. Inicio del proceso(Start Event).
    3. Tareas de usuario(User Tasks).
    4. Tareas de servicio(Service Tasks).
    5. Puertas de enlace Exclusivas(Exclusive Gateways).
    6. Fin del proceso(End Event).

    Asegúrate de incluir para cada una de las tareas el nombre de la tarea y el participante al que está asociado(participant), además de indicar cómo estos elementos están conectados mediante flujos de secuencia(Sequence Flows) especificando el inicio(source) y el final(target) del flujo, ten en cuenta el orden de los elementos en el diagrama y quiero que los componentes del JSON sigan el siguiente orden: participants -> elements -> flows y quiero que incluyas todos los gateways que consideres necesarios dentro de la misma lista de los elements.

    Quiero que tu respuesta siga este mismo formato conservando su estructura:
        {
            "participants": [
                { "name": "Participante Implicado" }, ...
        ],
            "elements": [
                {
                    "type": "Task",
                    "name": "Nombre tarea",
                    "participant": "Participante Implicado"
                }
            ]
        "flows": [
            {
                "source": "Nombre tarea",
                "target": "Nombre tarea"
            }
        ]
    }`
}

/*
const makePromptOld = (description, activities) => {
    let prompt = `Proporciona el código XML sobre el diagrama BPMN de ${description}.\n`;

    let finalPrompt = "Por favor, proporciona la representación del proceso en formato BPMN XML 2.0 incluyendo el xml correspondiente al diagrama '<bpmndi:BPMNDiagram'."

    if (activities.length < 1)
        return prompt + finalPrompt;

    prompt += "El diagrama debe incluir mínimo las siguientes actividades clave:\n"

    activities.forEach(activity => {
        prompt += `* ${activity[0]}. Responsable: ${activity[1]}\n`
    });

    return prompt + finalPrompt
}
*/

export const gpt = async (description, activities, record = [{ role: 'system', content: 'You are a helpful assistant.' }]) => {
    return await fetch(`${API_URL}/assistant/gpt/`, {
        method: "POST",
        body: JSON.stringify({
            messages: [
                ...record,
                { role: 'user', content: makePrompt(description, activities) }
            ]
        })
    })
        .then(response => response.json())
        .then(({ data }) => { return { message: data.message, json: JSON.parse(data.xml) } })
        .then(({ message, json }) => { console.log(json); return { message: message, xml: buildBPMN(json) } });
}

export const gemini = async (description, activities, record = [{ role: 'system', content: 'You are a helpful assistant.' }]) => {
    return await fetch(`${API_URL}/assistant/gemini/`, {
        method: "POST",
        body: JSON.stringify({
            prompt: makePromptGemini(description, activities)
        })
    })
        .then(response => response.json())
        .then(({ data }) => { return { message: data.message, json: JSON.parse(data.xml) } })
        .then(({ message, json }) => { return { message: message, xml: buildBPMN(json) } });
}

export const regenerate = async (description, record) => {
    return await fetch(`${API_URL}/assistant/gpt/`, {
        method: "POST",
        body: JSON.stringify({
            messages: [
                ...record,
                { role: 'user', content: 'Al código xml que generaste ' + description }
            ]
        })
    })
        .then(response => response.json())
}