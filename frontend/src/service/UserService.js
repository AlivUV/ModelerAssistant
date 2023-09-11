import {
    API_URL
} from '../utils';

export const login = async (data) => {
    return await fetch(`${API_URL}/users/login/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": String(data.username),
            "password": String(data.password),
        })
    })
}

export const register = async (data) => {
    return await fetch(`${API_URL}/users/signup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': String(data.username),
            'password': String(data.password),
            'email': String(data.email),
            'password_confirmation': String(data.password_confirmation),
            'first_name': String(data.first_name),
            'last_name': String(data.last_name)
        })
    })
}

export const getFullName = async (userId) => {
    return await fetch(`${API_URL}/user/firstName/${userId}`, {
        method: "GET",
    }).then(response => response.json())
}