import React, { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import DocumentPdf from './DocumentPdf';

function ModalPdf(props) {
    const [userStories, setUserStories] = useState([]);
    const [selectedUserStory, setSelectedUserStory] = useState({
        id: '',
        name: '',
        actor: '',
        priority: '',
        points: '',
        purpose: '',
        restrictions: '',
        acceptanceCriteria: '',
        dependencies: []
    });

    useEffect(() => {
        if (props.modalPdf._isShown === true) {
            const ListUserStories = props.jsonCreate().userStories;
            setUserStories(ListUserStories);

            ListUserStories.map((e) => {
                if (e.dependencies.length > 0) {
                    let arr = []
                    e.dependencies.forEach((element, i) => {
                        if (i === e.dependencies.length - 1) {
                            arr.push(`${element['id']} ${element['name']}.`)
                        } else {
                            arr.push(`${element['id']} ${element['name']}, `)
                        }
                    })
                    e.dependencies = arr
                } else {
                    e.dependencies = ""
                }
            })
        }
    }, [props.modalPdf]);

    return (
        <div className="modal fade" id="modalPdf" aria-labelledby="tittleUserStories" aria-hidden="true" ref={props.refModalPdf}>
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header bg-one">
                        <h5 className="modal-title text-white" id="titleModalPdf">Product Backlog</h5>
                        <button type="button" className="btn-one px-1" data-bs-dismiss="modal" aria-label="Close">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="modal-body d-flex p-0">
                        <PDFViewer style={{ width: "100%", height: "100%" }}>
                            <DocumentPdf userStories={userStories} />
                        </PDFViewer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalPdf;