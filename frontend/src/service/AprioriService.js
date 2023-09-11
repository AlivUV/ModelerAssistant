import {
    API_URL
} from '../utils';

export const getRecommendations = async (data) => {
    let keyword = String(data)
    return await fetch(`${API_URL}/association_rules/list/${keyword}`, {
        method: "GET",
    }).then(response => response.json())
}

export const addRules = async (rules) => {
    return await fetch(`${API_URL}/association_rules/add/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'rules': rules
        })
    }).then(response => response.json())
}