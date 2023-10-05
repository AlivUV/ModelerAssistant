import {
    API_URL
} from '../utils';

const makePrompt = data => {
    return String(data);

    let prompt = `Proporciona un diagrama BPMN en formato BPMN XML 2.0 para ${data.description}`;


}

export const autocomplete = async data => {
    return await fetch(`${API_URL}/assistant/autocomplete/`, {
        method: "POST",
        body: JSON.stringify({
            prompt: makePrompt(data)
        })
    })
        .then(response => response.json())
}