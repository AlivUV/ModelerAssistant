import {
    API_URL
} from '../utils';

export const autocomplete = async () => {
    return await fetch(`${API_URL}/assistant/autocomplete/`, {
        method: "GET",
    })
        .then(response => response.json())
}