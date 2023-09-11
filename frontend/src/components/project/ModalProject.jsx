import React from 'react';

function ModalProject(props) {
    return (
        <div className="modal fade" id="modalProject" aria-labelledby="tittleModalDiagram" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-two border-0">
                    <div className="modal-header bg-one">
                        <h5 className="modal-title text-white" id="tittleModalDiagram">{props.mode} Project</h5>
                        <button type="button" className="btn-one px-1" data-bs-dismiss="modal" aria-label="Close">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form onSubmit={props.createNewProject}>
                        <div className="modal-body">
                            <div>
                                <label className="form-label">Name:</label>
                                <input className="form-control" name='name' value={props.name} onChange={props.handle} />
                            </div>
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Cancel</button>
                            {props.mode === 'Create' ?
                                <button type="submit" className="btn-one shadow-lg py-1" data-bs-dismiss="modal">Create</button> :
                                null
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ModalProject;