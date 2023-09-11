import React, { useState, useEffect } from 'react';

function Alert(props) {
    const [backgroundColor, setBackgroundColor] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        if (props.type === 'Success') {
            setBackgroundColor('bg-success text-white')
            setIcon('bi bi-check-circle')
        } else if (props.type === 'Error') {
            setBackgroundColor('bg-danger text-white')
            setIcon('bi bi-x-circle')
        } else if (props.type === 'Warning') {
            setBackgroundColor('bg-warning text-one')
            setIcon('bi bi-exclamation-triangle-fill')
        }
    }, [props.type]);

    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div className='toast align-items-center bg-white border-0' role="alert" aria-live="assertive" aria-atomic="true" ref={props.refAlertElement}>
                <div className={`toast-header ${backgroundColor}`}>
                    <i className={`me-1 ${icon}`}></i>
                    <strong className="me-auto">{props.type}</strong>
                    <button type="button" className="btn-transparent px-1" data-bs-dismiss="toast" aria-label="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="toast-body">
                    {props.message}
                    {
                        props.type === 'Warning' ?
                            <div className="mt-2 pt-2">
                                <button type="button" className="btn-one btn-sm" onClick={props.action}>Yes</button>
                                <button type="button" className="btn-two btn-sm ms-2" data-bs-dismiss="toast">No</button>
                            </div>
                            : ''
                    }
                </div>
            </div>
        </div>
    )
}
export default Alert;