import React, { useEffect, useState } from 'react'

function ModalUserStories(props) {
    const [userStories, setUserStories] = useState([]);
    const [selectedUserStory, setSelectedUserStory] = useState({
        id: '',
        name: '',
        actor: '',
        priority: '',
        points: '',
        developer: '',
        purpose: '',
        restrictions: '',
        acceptanceCriteria: '',
        dependencies: []
    });

    const selectUserStory = (elementId) => {
        const userStory = userStories.find(element => elementId === element.id)
        setSelectedUserStory(userStory);
    }

    useEffect(() => {
        if (props.modalUserStories._isShown === true) {
            const ListUserStories = props.jsonCreate().userStories;
            setUserStories(ListUserStories);
            if (ListUserStories.length > 0) {
                setSelectedUserStory(ListUserStories[0]);
            }
        }
    }, [props.modalUserStories]);

    return (
        <div className="modal fade" id="userStories" aria-labelledby="tittleUserStories" aria-hidden="true" ref={props.refModalUserStories}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                <div className="modal-content bg-two border-0">
                    <div className="modal-header bg-one">
                        <h5 className="modal-title text-white" id="tittlePropertiesPanel">Product Backlog</h5>
                        <button type="button" className="btn-one px-1" data-bs-dismiss="modal" aria-label="Close">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="modal-body d-flex p-0">
                        <div className='w-50 p-3 table-responsive overflow-auto'>
                            <table id='table-list-user-stories' className="table table-cursor table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th className='col-2' scope="col">Id</th>
                                        <th>User Story</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userStories.map((element, i) =>
                                            <tr key={i} onClick={() => selectUserStory(element.id)}>
                                                <th className={selectedUserStory.id === element.id ? 'bg-one text-white' : ''} scope="row">{element.id}</th>
                                                <td className={selectedUserStory.id === element.id ? 'bg-one text-white' : ''}>{element.name}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='w-50 p-3 border-start overflow-auto'>
                            <div className='rounded-2 bg-info bg-opacity-10 mb-2'>
                                <div className='bg-one bg-opacity-25 rounded-top py-1'>
                                    <p className='text-center text-white fw-bold mb-0'>User Story</p>
                                </div>
                                <div className='px-3 py-2'>
                                    <table className='table mb-0'>
                                        <tbody>
                                            <tr>
                                                <th className='w-15 text-center border-0'>{selectedUserStory.id}</th>
                                                <td className='ps-3 border-0'>{selectedUserStory.name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='rounded-2 bg-info bg-opacity-10 mb-2'>
                                <div className='bg-one bg-opacity-25 rounded-top py-1'>
                                    <p className='text-center text-white fw-bold mb-0'>Details</p>
                                </div>
                                <div className='p-3'>
                                    <table className='table mb-0'>
                                        <tbody>
                                            <tr>
                                                <th className="align-middle text-center w-20">Description</th>
                                                <td className='ps-3'>As a {selectedUserStory.actor.toLowerCase()}, I want to {selectedUserStory.name.toLowerCase()} {selectedUserStory.purpose !== '' ? `, so that ${selectedUserStory.purpose.toLowerCase()}` : ''}</td>
                                            </tr>
                                            <tr>
                                                <th className="align-middle text-center">Actor</th>
                                                <td className='ps-3'>{selectedUserStory.actor}</td>
                                            </tr>
                                            <tr>
                                                <th className="align-middle text-center">Project</th>
                                                <td className='ps-3'>{selectedUserStory.project}</td>
                                            </tr>
                                            <tr>
                                                <th className="align-middle text-center">Points</th>
                                                <td className='ps-3'>{selectedUserStory.points}</td>
                                            </tr>
                                            <tr>
                                                <th className="align-middle text-center">Priority</th>
                                                <td className='ps-3'>{selectedUserStory.priority}</td>
                                            </tr>
                                            {
                                                selectedUserStory.developer !== '' ?
                                                    <tr>
                                                        <th className="align-middle text-center">Developer</th>
                                                        <td className='ps-3'>{selectedUserStory.developer}</td>
                                                    </tr>
                                                    : ''
                                            }
                                            {
                                                selectedUserStory.restrictions !== '' ?
                                                    <tr>
                                                        <th className="align-middle text-center">Restrictions</th>
                                                        <td className='ps-3'>{selectedUserStory.restrictions}</td>
                                                    </tr>
                                                    : ''
                                            }
                                            {
                                                selectedUserStory.acceptanceCriteria !== '' ?
                                                    <tr>
                                                        <th className="align-middle text-center">Acceptance Criteria</th>
                                                        <td className='ps-3'>{selectedUserStory.acceptanceCriteria}</td>
                                                    </tr>
                                                    : ''
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {
                                selectedUserStory.dependencies.length > 0 ?
                                    <div className='rounded-2 bg-info bg-opacity-10'>
                                        <div className='bg-one bg-opacity-25 rounded-top py-1'>
                                            <p className='text-center text-white fw-bold mb-0'>Dependencies</p>
                                        </div>
                                        <div className='p-3'>
                                            <table className='table table-cursor table-striped table-hover bg-two rounded mb-0'>
                                                <tbody>
                                                    {
                                                        selectedUserStory.dependencies.map((element, i) =>
                                                            <tr key={i} onClick={() => selectUserStory(element.id)}>
                                                                <th className='col-2' scope="row">{element.id}</th>
                                                                <td>{element.name}</td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Close</button>
                        {/* Button Create PDF US */}
                        <button className="btn-one shadow-lg py-1" onClick={() => props.openModalPdf()} disabled={!props.loadCreateUserStories}>
                            {
                                props.loadCreateUserStories ?
                                    <i className="bi bi-file-earmark-plus me-1"></i>
                                    :
                                    <div className="spinner-border spinner-border-sm text-white me-1" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                            }
                            Create User Stories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalUserStories;