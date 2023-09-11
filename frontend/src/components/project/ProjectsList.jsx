import * as ProjectService from "../../service/ProjectService"
import React, { useState } from 'react';
import { useEffect } from "react";
import { Toast } from "bootstrap";

// Components
import NavBar from "../NavBar";
import Project from "./Project";
import ModalProject from "./ModalProject";
import Alert from "../Alert";
import Pagination from "../Pagination";
import Footer from "../Footer";

function ProjectsList() {
    const [projects, setProjects] = useState([{}])
    const userId = sessionStorage.getItem('userId')
    const [newProject, setNewProject] = useState({
        name: '',
        user_id: '',
    })
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [refAlertElement] = useState(React.createRef());
    const [loadProjects, setLoadProjects] = useState(false);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(56);
    // Get current projects
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const getListProjects = async () => {
        setLoadProjects(false)
        try {
            await ProjectService.listProject(userId).then(res => {
                setProjects(res.data)
                setLoadProjects(true)
            })
        } catch (error) {
            // console.log(error)
        }
    }

    const createNewProject = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                name: newProject.name,
                user_id: userId
            }
            ProjectService.createProject(formData).then(res => {
                getListProjects()
                showAlert('Success', 'Successfully created');
            })
        } catch (error) {
            showAlert('Error', 'Something wrong happened');
        }
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setNewProject((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const showAlert = (type, message) => {
        setAlertMessage(message);
        setAlertType(type);
        const toast = new Toast(refAlertElement.current);
        toast.show();
    }

    const getScrollBarWidth = () => {
        const scrollBarWidth = window.innerWidth - document.documentElement.getBoundingClientRect().width;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`)
    }

    useEffect(() => {
        setTimeout(() => {
            getScrollBarWidth()
        }, 200)
    }, [projects]);

    useEffect(() => {
        getListProjects()

        window.onresize = () => {
            getScrollBarWidth()
        }
    }, [])

    return (
        <div className="bg-two">
            <NavBar />

            <div className="content p-4">
                <div className="mb-4 text-center">
                    <p className="fs-20">To get started, create a new project</p>
                    <button onClick={() => setNewProject((prevState) => ({ ...prevState, 'name': '' }))} className="btn-one py-2" data-bs-toggle="modal" data-bs-target="#modalProject">
                        <i className="bi bi-plus-lg"></i> New project
                    </button>
                </div>

                <div className="d-flex justify-content-center">
                    {
                        loadProjects ?
                            <div>
                                <div className="d-flex justify-content-center">
                                    <div className="d-flex flex-wrap mb-5">
                                        {
                                            projects.length > 0 ?
                                                (
                                                    currentProjects.map(
                                                        (element, i) =>
                                                            <Project key={i} index={i} project={element} getListProjects={getListProjects} showAlert={showAlert} />
                                                    )
                                                )
                                                :
                                                <div className="cont-card-projects">
                                                    <div className="card-projects d-flex justify-content-center align-items-center rounded shadow-lg border-dashed m-3">
                                                        <div className="d-flex flex-wrap text-center">
                                                            <i className="bi bi-slash-circle fs-3 w-100"></i>
                                                            <span className="w-100">Empty</span>
                                                        </div>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <Pagination elementsPerPage={projectsPerPage} totalElements={projects.length} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
                            </div>
                            :
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                    }
                </div>

                <ModalProject mode='Create' name={newProject.name} handle={handleChange} createNewProject={createNewProject} />
                <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
            </div>

            <Footer></Footer>
        </div>
    )
}
export default ProjectsList;