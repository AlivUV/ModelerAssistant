import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import * as UserService from "../service/UserService"

function Login() {
    let sessionStorage = window.sessionStorage
    sessionStorage.clear()

    let navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: "",
    })

    const signin = async () => {
        try {
            const res = await UserService.login(data)
            const cred = await res.json()
            if (cred.access_token) {
                sessionStorage.setItem('userToken', cred.access_token)
                sessionStorage.setItem('userId', cred.user.id)
                navigate('/')
            } else {
                navigate('/login')
            }

        } catch (error) {
            // console.log(error)
        }
    }
    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const sendData = (event) => {
        event.preventDefault()
        signin()
    }

    return (
        <div id="login" className='d-flex justify-content-center align-items-center h-100'>
            <div>
                <div className='mb-3'>
                    <h1 className='text-center text-white fw-bold fs-48'>SmartCopilot</h1>
                </div>

                <div className="card shadow-lg bg-one">
                    <div className='card-title py-4 mb-0'>
                        <h4 className='text-white mb-0 text-center'>Sign in</h4>
                    </div>
                    <div className="card-body px-5 mx-4 py-3">
                        <form onSubmit={sendData} className="text-center">
                            <div className="input-group col">
                                <span className='input-group-text bg-white border border-0 pe-1'><i className="bi bi-person"></i></span>
                                <input onChange={handleInputChange} type="text" className="form-control border border-0 ps-2" placeholder='Username' name="username" />
                            </div>
                            {/* <small className="text-white">Min 8 letters</small> */}

                            <div className="input-group col mt-3">
                                <span className='input-group-text bg-white border border-0 pe-1'><i className="bi bi-lock"></i></span>
                                <input onChange={handleInputChange} type="password" className="form-control border border-0 ps-2" placeholder='Password' name="password" />
                            </div>
                            {/* <small className="text-white">Please introduce secure password</small> */}

                            <div className='mt-3'>
                                <button type="submit" className="btn-three w-100">Log in</button>
                            </div>
                        </form>
                    </div>
                    <div className='card-footer bg-one border border-0 py-4 p-0'>
                        <div className="text-center">
                            <p className='text-white mb-0'>Not a member? <Link to="/register" className='text-white fw-semibold'>Register</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;