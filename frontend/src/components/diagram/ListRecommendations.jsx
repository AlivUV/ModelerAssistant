import React, { useState, useEffect } from 'react';
import * as AprioriService from "../../service/AprioriService"
import { Toast } from 'bootstrap';

// Components
import Alert from '../Alert';

const ListRecommendations = (props) => {
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationsMain, setRecommendationsMain] = useState([]);
    const [checkedRecommendations, setCheckedRecommendations] = useState([]);
    const [indexDeleteTask, setIndexDeleteTask] = useState(-1);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [refAlertElement] = useState(React.createRef());
    const [loadRecommendationsMain, setLoadRecommendationsMain] = useState(false);
    const [loadRecommendations, setLoadRecommendations] = useState(false);

    //Save referennce for dragTask and dragOverTask
    const [indexDragTask, setIndexDragTask] = useState(null);
    const [indexDragOverTask, setIndexDragOverTask] = useState(null);

    const handleSortTasks = (e) => {
        //Duplicate tasks
        let _tasks = [...props.tasks]

        //Remove and save the dragged task content
        const draggedTaskContent = _tasks.splice(indexDragTask, 1)[0]

        //Switch the position
        _tasks.splice(indexDragOverTask, 0, draggedTaskContent)

        //Reset the position ref
        setIndexDragTask(null)
        setIndexDragOverTask(null)

        //Update the actual array
        props.setTasks(_tasks)

        const elementButton = e.target.parentElement.childNodes[indexDragOverTask].firstElementChild.firstElementChild;

        if (elementButton.getAttribute('aria-expanded') === 'true') {
            elementButton.click();
        }
    }

    const handleOnChangeCheck = (index) => {
        const updatedCheckedRecommendations = checkedRecommendations.map((item, i) =>
            i === index ? !item : item
        );

        setCheckedRecommendations(updatedCheckedRecommendations);
    };

    const listRecommendations = (keyword, main = false) => {
        if (main) {
            setLoadRecommendationsMain(false)
            setLoadRecommendations(false)
        } else {
            setLoadRecommendations(-1)
            setTimeout(() => {
                setLoadRecommendations(false)
            }, 300);
        }

        try {
            AprioriService.getRecommendations(keyword.toLowerCase()).then(res => {
                if (main) {
                    setRecommendationsMain(res.recommendations)
                    setRecommendations(res.recommendations)
                    setLoadRecommendationsMain(true)
                    setLoadRecommendations(true)
                } else {
                    setRecommendations(res.recommendations)
                    setLoadRecommendations(true)
                }
                setCheckedRecommendations(new Array(res.recommendations.length).fill(false))
            });
        } catch (error) {
            // console.log(error);
        }
    }

    const addTasks = () => {
        checkedRecommendations.forEach((item, i) => {
            if (item) {
                props.setTasks(prevState => [...prevState, recommendations[i].sentence])
            }
        });
    }

    const showToastDeleteTask = (i) => {
        setIndexDeleteTask(i)
        setAlertMessage('Are you sure you want to delete it?');
        setAlertType('Warning');
        const toast = new Toast(refAlertElement.current);
        toast.show();
    }

    const deleteTask = () => {
        props.setTasks(prevState => prevState.filter((item, i) => {
            return i !== indexDeleteTask
        }))

        setAlertMessage('Successfully removed');
        setAlertType('Success');
        const toast = new Toast(refAlertElement.current);
        toast.show();
    }

    useEffect(() => {
        listRecommendations(props.selectedElement.businessObject.name, true)
    }, []);

    return (
        <div className='p-3 w-50 border-start overflow-auto'>
            <h5>Recommendations</h5>
            {
                loadRecommendationsMain ?
                    recommendationsMain.length > 0 ?
                        (
                            <div className="accordion" id="panelRecommendations">
                                {props.tasks.map(
                                    (element, i) =>
                                        <div key={i}
                                            className={`accordion-item ${indexDragOverTask === i && indexDragTask < indexDragOverTask ?
                                                'border-bold-bot-one' : indexDragOverTask === i && indexDragTask > indexDragOverTask ?
                                                    'border-bold-top-one' : ''}`}
                                            draggable={i !== 0 ? true : false}
                                            onDragStart={i !== 0 ? (e) => setIndexDragTask(i) : null}
                                            onDragEnter={i !== 0 ? (e) => setIndexDragOverTask(i) : null}
                                            onDragEnd={i !== 0 ? handleSortTasks : null}
                                            onDragOver={i !== 0 ? (e) => e.preventDefault() : null}>
                                            <div className="accordion-header d-flex" id={'heading' + i}>
                                                <button onClick={() => listRecommendations(element)} className={`accordion-button py-2-2 ${i !== 0 ? 'collapsed' : 'w-100'}`} type="button" data-bs-toggle="collapse" data-bs-target={'#collapse' + i} aria-expanded={i === 0 ? true : false} aria-controls={'collapse' + i}>
                                                    {
                                                        i !== 0 ?
                                                            <i className="bi bi-list me-2"></i>
                                                            : ''
                                                    }
                                                    <label className='truncated_text h-100'>{element}</label>
                                                    {
                                                        i === 0 ?
                                                            <div className='bg-one text-white rounded px-2 ms-2 fs-12'>Main</div>
                                                            : ''
                                                    }
                                                </button>
                                                {
                                                    i !== 0 ?
                                                        <button onClick={() => showToastDeleteTask(i)} className={`btn-one py-2-2 px-3 rounded-0 ${i === props.tasks.length - 1 ? 'rounded-bot-right' : ''}`}><i className="bi bi-trash-fill text-white"></i></button>
                                                        : ''
                                                }
                                            </div>
                                            <div id={'collapse' + i} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} aria-labelledby={'heading' + i} data-bs-parent="#panelRecommendations">
                                                <div className="accordion-body">
                                                    {
                                                        loadRecommendations === -1 ?
                                                            <div></div>
                                                            : loadRecommendations ?
                                                                <div>
                                                                    {
                                                                        recommendations.length > 0 ?
                                                                            <div>
                                                                                {
                                                                                    recommendations.map((element, i) =>
                                                                                        <div key={i} className="form-check">
                                                                                            <input className="form-check-input" type="checkbox" value={element.sentence} id={i + element.sentence} checked={checkedRecommendations[i]} onChange={() => handleOnChangeCheck(i)} />
                                                                                            <div className='w-100 d-flex'>
                                                                                                <label className="form-check-label truncated_text" htmlFor={i + element.sentence}>
                                                                                                    {element.sentence}
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                                <button onClick={() => addTasks()} className='btn-one px-2 py-1 mt-3'><i className="bi bi-plus-lg"></i> Add</button>
                                                                            </div>
                                                                            :
                                                                            <div className="bg-three border rounded py-2-2 px-4" role="alert">
                                                                                There are no recommendations
                                                                            </div>
                                                                    }
                                                                </div>
                                                                :
                                                                <div className="d-flex justify-content-center">
                                                                    <div className="spinner-border" role="status">
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                </div>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-three border rounded py-2-2 px-4" role="alert">
                                There are no recommendations
                            </div>
                        )
                    :
                    <div className="d-flex justify-content-center mt-3">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }

            <Alert action={deleteTask} type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
        </div>
    );
}

export default ListRecommendations;