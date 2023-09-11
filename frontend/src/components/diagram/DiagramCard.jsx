import * as DiagramService from "../../service/DiagramService"
import { Link } from 'react-router-dom';
import React, { useEffect } from "react";

function DiagramCard({ index, diagram, getListDiagrams, showAlert, projectId }) {
    const deleteDiagram = async () => {
        try {
            DiagramService.deleteDiagram(diagram.id).then(res => {
                showAlert('Success', 'Successfully removed');
                getListDiagrams()
            })
        } catch (error) {
            showAlert('Success', 'Successfully removed');
        }
    }

    useEffect(() => {
        document.getElementById('diagram ' + diagram.id).innerHTML = diagram.svg
    }, [diagram]);

    return (
        <div className="cont-card-diagrams">
            <div className="card-diagrams bg-one rounded shadow-lg">
                <div className="d-flex justify-content-between align-items-center py-2 px-3 h-20">
                    <p className="text-white fw-semibold truncated_text mb-0 pe-3">{diagram.name}</p>
                    <button className="btn-one p-0" data-bs-toggle="modal" data-bs-target={`#diagram${diagram.id}`}>
                        <i className="bi bi-trash-fill text-white fs-6"></i>
                    </button>
                </div>
                <div className="h-80 p-1 pt-0">
                    <Link to={`/project/${projectId}/diagram/${diagram.id}`}>
                        <div id={`diagram ${diagram.id}`} className="svg-diagram bg-white rounded overflow-hidden h-100"></div>
                    </Link>
                </div>
            </div>

            {/* Modal delete*/}
            <div className="modal fade" id={`diagram${diagram.id}`} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-two border-0">
                        <div className="modal-header bg-one">
                            <h5 className="modal-title text-white" id="exampleModalLabel">Delete Diagram</h5>
                            <button type="button" className="btn-one px-1" data-bs-dismiss="modal" aria-label="Close">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body text-start">
                            <p className="word_break mb-0">Are you sure to delete '{diagram.name}'?</p>
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Cancel</button>
                            <button id="deleteDiagramButton" className="btn-one shadow-lg py-1" data-bs-dismiss="modal" onClick={() => deleteDiagram()} type="button">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal-end */}
        </div>
    )
}
export default DiagramCard;