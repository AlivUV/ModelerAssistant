import {
    API_URL
} from '../utils';

export const createProject = async (data) => {
    return await fetch(`${API_URL}/projects/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': String(data.name),
            'user_id': String(data.user_id),
        })
    }).then(response => response.json())
}

export const listProject = async (userId) => {
    return await fetch(`${API_URL}/projects/list/${userId}`, {
        method: "GET",
    }).then(response => response.json())
}

export const getProject = async (projectId) => {
    return await fetch(`${API_URL}/projects/get/${projectId}`, {
        method: "GET",
    }).then(response => response.json())
}

export const updateProject = async (data, projectId) => {
    return await fetch(`${API_URL}/projects/update/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            'name': String(data.name),
        })

    }).then(response => response.json())
}

export const deleteProject = async (projectId) => {
    return await fetch(`${API_URL}/projects/delete/${projectId}`, {
        method: "DELETE",
    })
}