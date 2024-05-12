import {
    API_URL
} from '../utils';

import { buildBPMN } from './XMLService'

const makePrompt = (description) => {
    return `Proporcióname detalles descriptivos para el siguiente proceso: ${description}, ten en cuenta que el proceso se debe representar en formato BPMN 2.0 y debe incluir al menos los siguientes elementos:

    Participantes del proceso (participants).
    Inicio del proceso (Start Event).
    Tareas de usuario (User Tasks).
    Tareas de servicio (Service Tasks).
    Puertas de enlace Exclusivas (Exclusive Gateways).
    Fin del proceso (End Event).

    Asegúrate de incluir para cada uno de los elementos el nombre del elemento y el participante al que está asociado, además de indicar cómo estos elementos están conectados mediante flujos, ten en cuenta el orden de los elementos en el diagrama y quiero que incluyas todos los gateways que consideres necesarios dentro de la misma lista de los elements.
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
const makePromptGpt = (description) => {
    return `Proporcióname detalles descriptivos en formato JSON para el siguiente proceso: ${description}, ten en cuenta que el proceso se debe representar en formato BPMN 2.0 y debe incluir al menos los siguientes elementos: 

    Participantes del proceso (participants).
    Inicio del proceso (Start Event).
    Tareas de usuario (User Tasks).
    Tareas de servicio (Service Tasks).
    Puertas de enlace Exclusivas (Exclusive Gateways).
    Fin del proceso (End Event).

    Asegúrate de incluir para cada una de las tareas el nombre de la tarea y el participante al que está asociado, además de indicar cómo estos elementos están conectados mediante flujos de secuencia (Sequence Flows), ten en cuenta el orden de los elementos en el diagrama y quiero que los componentes del JSON sigan el siguiente orden: participants -> elements -> flows y quiero que incluyas todos los gateways que consideres necesarios dentro de la misma lista de los elements.
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


const makePromptGemini = (description) => {
    return `Proporcióname detalles descriptivos en formato JSON para el siguiente proceso: ${description}, ten en cuenta que el proceso se debe representar en formato BPMN 2.0 y debe incluir al menos los siguientes elementos:

    1. Participantes del proceso (participants).
    2. Inicio del proceso (Start Event).
    3. Tareas de usuario (User Tasks).
    4. Tareas de servicio (Service Tasks).
    5. Puertas de enlace Exclusivas (Exclusive Gateways).
    6. Fin del proceso (End Event).

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
*/


const fetcher = async (model, body) => {
    return await fetch(`${API_URL}/assistant/${model}/`, {
        method: "POST",
        body: body
    })
        .then(response => response.json())
        .then(({ data }) => ({ message: data.message, modelResponse: "```json\n" + data.xml + "```", json: JSON.parse(data.xml) }))
        .then(({ message, modelResponse, json }) => ({ ...buildBPMN(json), message: message, json: modelResponse }))
        .catch(error => ({ error: error }));
}


export const gpt = async (description) => {
    const body = JSON.stringify({
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: makePrompt(description) }
        ]
    })
    return await fetcher("gpt", body)
}

export const gptTunned = async (description) => {
    const body = JSON.stringify({
        messages: [
            { role: 'system', content: 'You are a bpm expert who gives diagrams in json format' },
            { role: 'user', content: description }
        ]
    })
    return await fetcher("gpt/tunned", body)
}

export const gemini = async (description) => {
    const body = JSON.stringify({
        messages: [
            { role: 'user', parts: makePrompt(description) }
        ]
    })
    return await fetcher("gemini", body)
}

export const gptModify = async (description, record) => {
    const body = JSON.stringify({
        messages: [
            ...record,
            { role: 'user', content: 'Al código json que generaste ' + description }
        ]
    })
    return await fetcher("gpt", body)
}

export const gptTunnedModify = async (description, record) => {
    const body = JSON.stringify({
        messages: [
            ...record,
            { role: 'user', content: 'Al código json que generaste ' + description }
        ]
    })
    console.log(record);
    return await fetcher("gpt/tunned", body)
}

export const geminiModify = async (description, record) => {
    const body = JSON.stringify({
        messages: [
            ...record,
            { role: 'user', parts: 'Al código json que generaste ' + description }
        ]
    })
    return await fetcher("gemini", body)
}