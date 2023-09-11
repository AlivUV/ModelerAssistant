import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import * as UserService from "../service/UserService"

function Register() {
    let navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: "",
        email: "",
        password_confirmation: "",
        first_name: "",
        last_name: ""
    })

    const signup = async () => {
        try {
            UserService.register(data)
            navigate('/login')
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
        signup()
    }

    return (
        <div id='register' className='d-flex justify-content-center align-items-center h-100'>
            <div>
                <div className='mb-3'>
                    <h1 className='text-center text-white fw-bold fs-48'>SmartCopilot</h1>
                </div>

                <div className="card shadow-lg bg-one">
                    <div className='card-title py-4 mb-0'>
                        <h4 className='text-white mb-0 text-center'>Register</h4>
                    </div>
                    <div className="card-body px-5 mx-4 py-3">
                        <form onSubmit={sendData} className="text-center">
                            {/* first_name field*/}
                            <div className="input-group col">
                                <span className='input-group-text bg-white border border-0 pe-1'><i className="bi bi-person-lines-fill"></i></span>
                                <input onChange={handleInputChange} type="text" className="form-control border border-0 ps-2" placeholder='First name' name="first_name" />
                            </div>
                            {/* <small className="text-muted">Introduce your first name</small> */}

                            {/* last_name field*/}
                            <div className="input-group col mt-3">
                                <span className='input-group-text bg-white border border-0 pe-1'><i className="bi bi-person-lines-fill"></i></span>
                                <input onChange={handleInputChange} type="text" className="form-control border border-0 ps-2" placeholder='Last name' name="last_name" />
                            </div>
                            {/* <small className="text-muted">Introduce your last name</small> */}

                            {/* Email field*/}
                            <div className="input-group col mt-3">
                                <span className='input-group-text bg-white border border-0 pe-1'><i className="bi bi-envelope"></i></span>
                                <input onChange={handleInputChange} type="email" className="form-control border border-0 ps-2" placeholder='Email' name="email" />
                            </div>
                            {/* <small className="text-muted">Introduce a correct email</small> */}

                            {/* Username field*/}
                            <div className="input-group col mt-3">
                                <span className='input-group-text bg-white border border-0 pe-1'><i className="bi bi-person"></i></span>
                                <input onChange={handleInputChange} type="text" className="form-control border border-0 ps-2" placeholder='Username' name="username" />
                            </div>
                            {/* <small className="text-muted">Min 8 letters</small> */}

                            {/* Password field*/}
                            <div className="input-group col mt-3">
                                <span className='input-group-text bg-white border border-0 pe-1'><i className="bi bi-person"></i></span>
                                <input onChange={handleInputChange} type="password" className="form-control border border-0 ps-2" placeholder='Password' name="password" />
                            </div>
                            {/* <small className="text-muted">Min 8 letters</small> */}

                            {/* Password_confirmation field*/}
                            <div className="input-group col mt-3">
                                <span className='input-group-text bg-white border border-0 pe-1'><i className="bi bi-person"></i></span>
                                <input onChange={handleInputChange} type="password" className="form-control border border-0 ps-2" placeholder='Password confirmation' name="password_confirmation" />
                            </div>
                            {/* <small className="text-muted">Please confirm your password</small> */}

                            <div className='my-3'>
                                <button type="submit" className="btn-three w-100">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;