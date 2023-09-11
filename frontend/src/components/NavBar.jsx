import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LogoutButton from "./LogoutButton";
import * as UserService from "../service/UserService"

const NavBar = () => {
    const userToken = sessionStorage.getItem('userToken')
    const userId = sessionStorage.getItem('userId')
    const [firstName, setFirstName] = useState('')

    let hide
    if (userToken) {
        hide = false
    } else {
        hide = true
    }

    const getInfo = async () => {
        const fullname = await UserService.getFullName(userId)
        setFirstName(fullname.firstName)
    }

    useEffect(() => {
        getInfo()
    }, []);

    return (
        <nav hidden={hide} className="navbar navbar-expand-lg navbar-dark bg-one">
            <div className="d-flex justify-content-between align-items-center w-100 p-2 mx-5">
                <div>
                    <Link className="navbar-brand title text-white fs-32 fw-bold" to="/">SmartCopilot</Link>
                </div>

                <div className="d-flex menu bg-two rounded shadow-lg py-2 px-4">
                    <Link className="nav-link rounded px-3 me-1" to="/">
                        <i className="bi bi-house-fill"></i> Home
                    </Link>
                    <Link className="nav-link rounded px-3 ms-1" to="/projects">
                        <i className="bi bi-folder-fill"></i> My Projects
                    </Link>
                </div>

                <div className='d-flex align-items-center'>
                    <p className='text-white mb-0 me-3'>Hello, {firstName}</p>
                    <i className="bi bi-person-circle text-white fs-4 me-3"></i>
                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;