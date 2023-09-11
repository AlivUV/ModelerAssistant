import * as ProjectService from "../../service/ProjectService"
import * as DiagramService from "../../service/DiagramService"
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useCallback } from "react";

function Project({ index, project, getListProjects, showAlert }) {
    const [newProject, setNewProject] = useState({
        name: '',
    })
    const [diagrams, setDiagrams] = useState([])
    const [loadDiagrams, setLoadDiagrams] = useState(false)

    const deleteProject = async (projectId) => {
        try {
            ProjectService.deleteProject(projectId).then(res => {
                getListProjects()
                showAlert('Success', 'Successfully removed');
            })
        } catch (error) {
            showAlert('Error', 'Something wrong happened');
        }
    }

    const updateProject = (e, projectId) => {
        e.preventDefault();
        try {
            const formData = {
                name: newProject.name,
            }
            ProjectService.updateProject(formData, projectId).then(res => {
                getListProjects()
                showAlert('Success', 'Successfully updated');
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

    const getListDiagrams = useCallback(async () => {
        setLoadDiagrams(false)
        if (project?.id) {
            try {
                await DiagramService.listDiagram(project.id).then(res => {
                    setDiagrams(res.data)
                    setLoadDiagrams(true)
                })
            } catch (error) {
                // console.log(error)
            }
        }
    }, [project.id])

    useEffect(() => {
        getListDiagrams()
    }, [getListDiagrams]);

    return (
        <div className="cont-card-projects">
            {
                loadDiagrams ?
                    <div className="card-projects position-relative rounded shadow-lg m-3">
                        <div className="d-flex h-20">
                            <div className="d-flex position-relative w-85">
                                <div className="bg-one position-absolute end-0 w-50 h-100"></div>
                                <div className="name bg-three rounded-top w-100 py-2 px-3">
                                    <p className="text-center truncated_text fw-semibold mb-0">{project.name}</p>
                                </div>
                            </div>
                            <button className="bg-one rounded-bot-left rounded-top-right w-15" data-bs-toggle="modal" data-bs-target={`#project${project.id}`}>
                                <i className="bi bi-trash-fill text-white fs-6"></i>
                            </button>
                        </div>

                        <div className="d-flex justify-content-center align-items-center flex-wrap p-4 pb-5 h-80">

                            <div className="w-100 h-100">
                                {
                                    diagrams.length > 0 ?
                                        (
                                            <div className="d-flex align-items-center w-100 h-100">
                                                <div className="w-100">
                                                    {
                                                        diagrams.slice(0).reverse().map((element, i) =>
                                                            i === diagrams.length - 1 ?
                                                                <div key={i} className="card-diagram-project bg-white rounded shadow-lg w-100 py-2 px-3">
                                                                    <p className="text-center truncated_text mb-0">{element.name}</p>
                                                                </div>
                                                                : i === 0 || i === 1 ?
                                                                    <div key={i} className="card-diagram-project bg-white rounded-top shadow-lg w-100 p-2"></div>
                                                                    : ''
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ) :
                                        <div className="h-100">
                                            <div className="d-flex justify-content-center align-items-center rounded border-dashed h-100">
                                                <i className="bi bi-slash-circle fs-5"></i>
                                            </div>
                                        </div>
                                }
                            </div>

                        </div>

                        <div className="d-flex justify-content-center position-absolute top-100 start-50 translate-middle">
                            <Link className="btn-one m-2" to={`/project/${project.id}/diagrams`}>
                                <i className="bi bi-diagram-2 text-white fs-5"></i>
                            </Link>
                            <button className="btn-one m-2" data-bs-toggle="modal" data-bs-target={`#projectUpdate${project.id}`}>
                                <i className="bi bi-pencil text-white fs-6"></i>
                            </button>
                        </div>
                    </div>
                    :
                    <div className="card-projects rounded shadow-lg m-3">
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
            }

            {/* Modal delete*/}
            <div className="modal fade" id={`project${project.id}`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-two border-0">
                        <div className="modal-header bg-one">
                            <h5 className="modal-title text-white" id="exampleModalLabel">Delete Project</h5>
                            <button type="button" className="btn-one px-1" data-bs-dismiss="modal" aria-label="Close">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body text-start">
                            <p className="word_break mb-0">Are you sure to delete '{project.name}'?</p>
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Cancel</button>
                            <button id="deleteProjectButton" className="btn-one shadow-lg py-1" data-bs-dismiss="modal" onClick={() => deleteProject(project.id)} type="button">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal-end */}


            {/* Modal update*/}
            <div className="modal fade" id={`projectUpdate${project.id}`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-two border-0">
                        <div className="modal-header bg-one">
                            <h5 className="modal-title text-white" id="exampleModalLabel">Update Project</h5>
                            <button type="button" className="btn-one px-1" data-bs-dismiss="modal" aria-label="Close">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={(e) => updateProject(e, project.id)}>
                            <div className="modal-body text-start">
                                <p className="word_break">Are you sure to update '{project.name}'?</p>
                                <input className="form-control" name='name' onChange={handleChange} />
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Cancel</button>
                                <button id="deleteProjectButton" className="btn-one shadow-lg py-1" data-bs-dismiss="modal" type="submit">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Modal update */}
        </div>
    )
}
export default Project;