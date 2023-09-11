import * as DiagramService from "../../service/DiagramService"
import React, { useState } from 'react';
import { useEffect } from "react";
import { API_URL } from "../../utils";
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Toast, Modal } from "bootstrap";
import { options } from '@bpmn-io/properties-panel/preact';
import * as ProjectService from "../../service/ProjectService";

// Components
import DiagramCard from "./DiagramCard";
import NavBar from "../NavBar";
import ModalDiagram from "./ModalDiagram";
import Alert from '../Alert';
import ModalPdf from '../pdfbacklog/ModalPdf';
import Pagination from "../Pagination";
import Footer from "../Footer";

function DiagramsCardList() {
    const { projectId } = useParams();
    let navigate = useNavigate();
    const [diagrams, setDiagrams] = useState([{}])
    const [project, setProject] = useState({})
    const [newDiagram, setNewDiagram] = useState({
        name: '',
        description: '',
    })
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [refAlertElement] = useState(React.createRef());
    const [modalPdf, setModalPdf] = useState('');
    const [refModalPdf] = useState(React.createRef());
    const [loadDiagrams, setLoadDiagrams] = useState(false);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [diagramsPerPage] = useState(40);
    // Get current diagrams
    const indexOfLastDiagram = currentPage * diagramsPerPage;
    const indexOfFirstDiagram = indexOfLastDiagram - diagramsPerPage;
    const currentDiagrams = diagrams.slice(indexOfFirstDiagram, indexOfLastDiagram);

    const getListDiagrams = () => {
        setLoadDiagrams(false)
        try {
            DiagramService.listDiagram(projectId).then(res => {
                setDiagrams(res.data)
                setLoadDiagrams(true)
            })
        } catch (error) {
            // console.log(error)
        }
    }

    const getProject = () => {
        try {
            ProjectService.getProject(projectId).then(res => {
                setProject(res.data)
            })
        } catch (error) {
            // console.log(error);
        }
    }

    const createNewDiagram = async (e) => {
        e.preventDefault();
        try {
            const xml = await fetch(`${API_URL}/static/xml/base-diagram.bpmn.xml`)
                .then(response => response.text());
            const svg = await fetch(`${API_URL}/static/svg/base-diagram.svg`)
                .then(response => response.text());

            const formData = {
                name: newDiagram.name,
                description: newDiagram.description,
                xml: xml,
                svg: svg,
                json_user_histories: {},
                id_project: projectId,
            }
            const diagram = await DiagramService.createDiagram(formData);
            navigate(`/project/${projectId}/diagram/${diagram.id}`);
        } catch (error) {
            // console.log(error);
        }
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setNewDiagram((prevState) => ({
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

    const sortUserStories = (arrUserStories, sortedUserStories) => {
        var priorities = ['Very low', 'Low', 'Medium', 'High', 'Very high']
        priorities = priorities.reverse();
        var part

        if (arrUserStories.length === 0) {
            return sortedUserStories;
        } else if (sortedUserStories.length === 0) {
            // Filter by dependencies
            part = arrUserStories.filter(element => element.dependencies.length === 0)
        } else {
            // Filter by dependencies
            part = arrUserStories.filter(element => {
                var foundNoDependencies = false
                element.dependencies.forEach(dependence => {
                    if (!sortedUserStories.find(task => task.id === dependence.id)) {
                        foundNoDependencies = true
                    }
                })

                if (foundNoDependencies) {
                    return false
                } else {
                    return true
                }
            });
        }

        // If there is a cycle
        if (part.length === 0) {
            var elements = arrUserStories.sort((a, b) => {
                return priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
            })
            part = [elements[0]]
        }

        // Sort by priorities
        part.sort((a, b) => {
            return priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
        })

        part = [part[0]]
        arrUserStories = arrUserStories.filter(elemento => part.indexOf(elemento) === -1);
        sortedUserStories = sortedUserStories.concat(part)
        return sortUserStories(arrUserStories, sortedUserStories)
    }

    const jsonCreate = () => {
        var arrUserStories = []
        var lengthUserStories = 0
        diagrams.forEach((element, i) => {
            if (element.json_user_histories?.userStories) {
                element.json_user_histories.userStories.map(us => {
                    // Change id user story
                    var usIdNumber = us.id.split('-')[1];
                    var idNumber = parseInt(usIdNumber) + lengthUserStories;
                    us.id = 'US-' + idNumber;

                    // Change id dependencies
                    us.dependencies.map(dependence => {
                        var dependenceIdNumber = dependence.id.split('-')[1];
                        var idNumber = parseInt(dependenceIdNumber) + lengthUserStories;
                        dependence.id = 'US-' + idNumber;
                        return dependence
                    });

                    return us
                })
                lengthUserStories = lengthUserStories + element.json_user_histories.userStories.length;
                arrUserStories = arrUserStories.concat(element.json_user_histories.userStories)
            }
        });

        // Sort tasks by priority and dependencies
        arrUserStories = sortUserStories(arrUserStories, [])

        return {
            projectId: projectId,
            userStories: arrUserStories
        }
    }

    const openModalPdf = async () => {
        const modal = new Modal(refModalPdf.current, options);
        modal.show();
        setModalPdf(modal);
    }

    const getScrollBarWidth = () => {
        const scrollBarWidth = window.innerWidth - document.documentElement.getBoundingClientRect().width;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`)
    }

    useEffect(() => {
        setTimeout(() => {
            getScrollBarWidth()
        }, 200)
    }, [diagrams]);

    useEffect(() => {
        getListDiagrams()
        getProject()

        window.onresize = () => {
            getScrollBarWidth()
        }
    }, [])

    return (
        <div className="bg-two">
            <NavBar />

            <div className="content p-4">
                <div className="mb-4 text-center">
                    <p className="fs-20">Do you want create something?</p>
                    <button className="btn-one py-2" data-bs-toggle="modal" data-bs-target="#modalDiagram">
                        <i className="bi bi-plus-lg"></i> New Diagram
                    </button>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3 px-3 w-100">
                    <div>
                        <h5 className="fs-6 mb-0">Project</h5>
                        <h3 className="fw-semibold mb-0">{project.name}</h3>
                    </div>
                    <button className="btn-one py-2" onClick={() => openModalPdf()}>
                        <i className="bi bi-file-earmark-plus"></i> Create User Stories
                    </button>
                </div>

                <div className="d-flex justify-content-center">
                    {
                        loadDiagrams ?
                            <div>
                                <div className="d-flex flex-wrap mb-5">
                                    {
                                        diagrams.length > 0 ?
                                            (
                                                currentDiagrams.map(
                                                    (element, i) =>
                                                        <DiagramCard key={i} index={i} diagram={element} getListDiagrams={getListDiagrams} showAlert={showAlert} projectId={projectId} />
                                                )
                                            )
                                            :
                                            <div className="cont-card-diagrams">
                                                <div className="card-diagrams bg-three d-flex justify-content-center align-items-center rounded shadow-lg border-dashed m-3">
                                                    <div className="d-flex flex-wrap text-center">
                                                        <i className="bi bi-slash-circle fs-3 w-100"></i>
                                                        <span className="w-100">Empty</span>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </div>
                                <Pagination elementsPerPage={diagramsPerPage} totalElements={diagrams.length} currentPage={currentPage} setCurrentPage={setCurrentPage}></Pagination>
                            </div>
                            :
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                    }
                </div>

                <ModalDiagram mode='Create' handle={handleChange} createNewDiagram={createNewDiagram} />
                <ModalPdf jsonCreate={jsonCreate} modalPdf={modalPdf} refModalPdf={refModalPdf}></ModalPdf>
                <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
            </div>

            <Footer></Footer>
        </div>
    )
}
export default DiagramsCardList;