import {
    API_URL
} from '../utils';

export const saveDiagram = async (data) => {
    return await fetch(`${API_URL}/diagram/save/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/text'
        },
        body: JSON.stringify({
            "xml": String(data),
        })
    })
}

export const getDiagram = async (data) => {
    return await fetch(`${API_URL}/diagram/get/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/text'
        },
        body: JSON.stringify({
            'id': data 
        })
    })
}