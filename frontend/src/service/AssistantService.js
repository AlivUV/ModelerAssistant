import {
    API_URL
} from '../utils';

const makePrompt = (description, activities) => {
    let prompt = `Proporciona un diagrama BPMN en formato BPMN XML 2.0 para ${description}.\n`;

    let finalPrompt = "Por favor, proporciona la representación del proceso en formato BPMN XML 2.0 incluyendo el xml correspondiente al diagrama '<bpmndi:BPMNDiagram'."

    if (activities.length < 1)
        return prompt + finalPrompt;

    prompt += "El diagrama debe incluir las siguientes actividades clave:\n"

    activities.forEach(activity => {
        prompt += `* ${activity[0]}. Responsable: ${activity[1]}\n`
    });

    return prompt + finalPrompt
}

export const autocomplete = async (description, activities) => {
    return await fetch(`${API_URL}/assistant/autocomplete/`, {
        method: "POST",
        body: JSON.stringify({
            prompt: makePrompt(description, activities)
        })
    })
        .then(response => response.json())
}