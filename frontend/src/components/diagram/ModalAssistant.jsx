import React, { useReducer, useState } from 'react';
import * as AssistantService from "../../service/AssistantService"
import { Modal } from 'bootstrap';

// BPMN
import { options } from '@bpmn-io/properties-panel/preact';

// Components
import ModalPreview from './ModalPreview';


const MODELS = {
  GPT: 'gpt',
  GPT_TUNNED: 'gptTunned',
  GEMINI: 'gemini'
}


const INITIAL_MODEL_RECORD = {
  [MODELS.GPT]: [{ role: 'system', content: 'You are a helpful assistant.' }],
  [MODELS.GPT_TUNNED]: [{ role: 'system', content: 'You are a bpm expert who gives diagrams in json format' }],
  [MODELS.GEMINI]: []
}


const LOADER_ACTIONS = {
  ALL_TRUE: 'ALL_TRUE',
  UPDATE_TRUE: 'UPDATE_TRUE',
  UPDATE_FALSE: 'UPDATE_FALSE',
}


const INITIAL_LOADER_STATE = {
  [MODELS.GPT]: false,
  [MODELS.GPT_TUNNED]: false,
  [MODELS.GEMINI]: false
}


const loaderReducer = (state, action) => {
  switch (action.type) {
    case LOADER_ACTIONS.ALL_TRUE:
      return {
        [MODELS.GPT]: true,
        [MODELS.GPT_TUNNED]: true,
        [MODELS.GEMINI]: true
      }
    case LOADER_ACTIONS.UPDATE_TRUE:
      return {
        ...state,
        [action.payload.name]: true
      }
    case LOADER_ACTIONS.UPDATE_FALSE:
      return {
        ...state,
        [action.payload.name]: false
      }
    default:
      return state;
  }
}


const DIAGRAMS_ACTIONS = {
  RESET_ALL_DIAGRAMS: 'RESET_ALL_DIAGRAMS',
  [`UPDATE_${MODELS.GPT}`]: `UPDATE_${MODELS.GPT}`,
  [`UPDATE_${MODELS.GPT_TUNNED}`]: `UPDATE_${MODELS.GPT_TUNNED}`,
  [`UPDATE_${MODELS.GEMINI}`]: `UPDATE_${MODELS.GEMINI}`,
  [`UPDATE_XML_${MODELS.GPT}`]: `UPDATE_XML_${MODELS.GPT}`,
  [`UPDATE_XML_${MODELS.GPT_TUNNED}`]: `UPDATE_XML_${MODELS.GPT_TUNNED}`,
  [`UPDATE_XML_${MODELS.GEMINI}`]: `UPDATE_XML_${MODELS.GEMINI}`
}


const diagramsReducer = (state, action) => {
  switch (action.type) {
    case DIAGRAMS_ACTIONS.RESET_ALL_DIAGRAMS:
      return {
        ...state,
        [MODELS.GPT]: {
          xml: "",
          record: INITIAL_MODEL_RECORD[MODELS.GPT]
        },
        [MODELS.GPT_TUNNED]: {
          xml: "",
          record: INITIAL_MODEL_RECORD[MODELS.GPT_TUNNED]
        },
        [MODELS.GEMINI]: {
          xml: "",
          record: INITIAL_MODEL_RECORD[MODELS.GEMINI]
        }
      }
    case DIAGRAMS_ACTIONS[`UPDATE_${MODELS.GPT}`]:
      return {
        ...state,
        [MODELS.GPT]: {
          ...state[MODELS.GPT],
          ...action.payload.responseData,
          record: [
            ...state[MODELS.GPT]?.record || [],
            { role: 'user', content: action.payload.prompt },
            { role: 'assistant', content: action.payload.response }
          ]
        }
      }
    case DIAGRAMS_ACTIONS[`UPDATE_${MODELS.GPT_TUNNED}`]:
      return {
        ...state,
        [MODELS.GPT_TUNNED]: {
          ...state[MODELS.GPT_TUNNED],
          ...action.payload.responseData,
          record: [
            ...state[MODELS.GPT_TUNNED]?.record || [],
            { role: 'user', content: action.payload.prompt },
            { role: 'assistant', content: action.payload.response }
          ]
        }
      }
    case DIAGRAMS_ACTIONS[`UPDATE_${MODELS.GEMINI}`]:
      return {
        ...state,
        [MODELS.GEMINI]: {
          ...state[MODELS.GEMINI],
          ...action.payload.responseData,
          record: [
            ...state[MODELS.GEMINI]?.record || [],
            { role: 'user', parts: action.payload.prompt },
            { role: 'model', parts: action.payload.response }
          ]
        }
      }
    case DIAGRAMS_ACTIONS[`UPDATE_MODEL_XML`]:
      return {
        ...state,
        [action.model]: {
          ...state[action.model],
          xml: action.payload.xml
        }
      }
    default:
      return state;
  }
}


function ModalAssistant(props) {

  const [modalOpened, setModalOpened] = useState(true);
  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition] = useState(new window.webkitSpeechRecognition());
  const [record,] = useState([{ role: 'system', content: 'You are a helpful assistant.' }]);
  const [modalPreview, setModalPreview] = useState();
  const [loader, loaderDispatch] = useReducer(loaderReducer, INITIAL_LOADER_STATE)
  const [diagrams, diagramsDispatch] = useReducer(diagramsReducer, (() => {
    const newDiagrams = {};
    Object.entries(MODELS).forEach(([, model]) => (
      newDiagrams[model] = { ...props.diagram, record: INITIAL_MODEL_RECORD[model], xml: '' }
    ));
    return newDiagrams;
  })())
  const [refModalPreview] = useState(React.createRef());


  const addActivity = () => {
    setActivities([...activities, ["", ""]]);
  };


  const deleteActivity = (position) => {
    setActivities([...activities.filter((_, index) => index !== position)]);
  };


  const handleChangeActivities = (e, index) => {
    activities[index][0] = e.target.value;
    setActivities([...activities]);
  };


  const handleChangeResponsibles = (e, index) => {
    activities[index][1] = e.target.value;
    setActivities([...activities]);
  };


  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };


  const openModalPreview = async () => {
    const modal = new Modal(refModalPreview.current, options);
    modal.show();
    setModalPreview(modal);
    setModalOpened(true);
  }


  const closeModals = () => {
    modalPreview.hide();
    props.modalAssistant.hide();
  };


  const startRecording = () => {
    if (isRecording) {
      recognition.stop();
      return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es';

    recognition.onresult = (event) => {
      let tempTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          tempTranscript += event.results[i][0].transcript + ' ';
        } else {
          tempTranscript += event.results[i][0].transcript;
        }
      }

      setDescription(tempTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Error al reconocer voz:', event.error);
    };

    recognition.onend = () => {
      console.log('Fin de la grabación de voz');
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };


  const manageResponse = (response, model, start) => {
    if (response.error) {
      console.error('Error:', response.error);
    }
    else {
      diagramsDispatch({ type: DIAGRAMS_ACTIONS[`UPDATE_${model}`], payload: response })
    }

    loaderDispatch({ type: LOADER_ACTIONS.UPDATE_FALSE, payload: { name: model } });

    console.log(`El asistente ${model} se tomó: ${Date.now() - start}`);
  }


  const modelCall = (model, description) => {
    const start = Date.now();

    AssistantService[model](description)
      .then(response => manageResponse(response, model, start));
  };


  const handleSubmit = async () => {
    diagramsDispatch({ type: DIAGRAMS_ACTIONS.RESET_ALL_DIAGRAMS })

    loaderDispatch({ type: LOADER_ACTIONS.ALL_TRUE });
    // TEMPORAL: While gptTunned is not being used.
    loaderDispatch({ type: LOADER_ACTIONS.UPDATE_FALSE, payload: { name: MODELS.GPT_TUNNED } })

    modelCall(MODELS.GPT, description);
    //modelCall(MODELS.GPT_TUNNED, description);
    modelCall(MODELS.GEMINI, description);

    openModalPreview();
  };


  const handleModify = (model, modifyDescription) => {
    loaderDispatch({ type: LOADER_ACTIONS.UPDATE_TRUE, payload: { name: model } });

    const start = Date.now();

    AssistantService[model + "Modify"](modifyDescription, diagrams[model].record)
      .then(response => manageResponse(response, model, start));
  }

  return (
    <div className="modal fade" id="modalDiagram" aria-labelledby="tittleModalDiagram" aria-hidden="true" ref={props.refModalAssistant}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-two border-0">
          <div className="modal-header bg-one">
            <h5 className="modal-title text-white" id="tittleModalDiagram"> How can I help you?</h5>
            <button type="button" className="btn-one px-1" data-bs-dismiss="modal" aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <form onSubmit={evt => { evt.preventDefault() }}>
            <div className="modal-body">
              <div>
                <div class="row">
                  <div className='col-10' >
                    <div className="mb-2 mt-2">
                      <label className="form-label">Description:</label>
                    </div>
                  </div>
                  <div className="col" >
                    <button type="button" title="Start recording" className="btn btn-secondary shadow-lg py-1 mt-1"
                      onClick={startRecording}>
                      <i className="bi bi-mic"></i>
                    </button>
                  </div>
                </div>
                <textarea className="form-control" required value={description} rows="5" onChange={handleChangeDescription} name='description' style={{ overflow: 'auto', resize: 'vertical' }}></textarea>
              </div>
              <hr className="hr hr-blurry" />  {/*Divider*/}
              {/** 
              {
                (record.length > 1)
                  ? <></>
                  : <div>
                    <label className="form-label">More Details: </label>
                    <div className="modal-footer border-0">
                      <button type="button" id='add' className="btn-one shadow-lg py-1"
                        onClick={() => addActivity()}
                      > <i className="bi bi-plus-circle"></i> Add</button>
                    </div>
                    {
                      activities.map((activity, index) => (
                        <div key={index + 1}>
                          <div className='row' >
                            <div className='col-10' >
                              <div className="mb-2 mt-2">
                                <label className="form-label">Activity {index + 1}:</label>
                                <input className="form-control" onChange={(e) => handleChangeActivities(e, index)} name='activity' />
                              </div>
                            </div>
                            <div className="col" >
                              <button type="button" className="btn btn-secondary shadow-lg py-1 mt-2"
                                onClick={() => { deleteActivity(index) }}
                              > <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-10'>
                              <div className="mb-3">
                                <label className="form-label">Responsible: </label>
                                <input className="form-control" onChange={(e) => handleChangeResponsibles(e, index)} name='responsible' />
                                <hr className="hr hr-blurry" />  
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
              }*/}
              <div className="modal-footer border-0">
                <button type="button" className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Close</button>
                {
                  (diagrams[MODELS.GPT].xml === "" && diagrams[MODELS.GPT_TUNNED].xml === "" && diagrams[MODELS.GEMINI].xml === "")
                    ? <></>
                    : <button type="button" className="btn-two shadow-lg py-1" onClick={openModalPreview}>Preview</button>
                }

                {
                  (record.length > 1)
                    ? <button onClick={handleModify} className="btn-one shadow-lg py-1"
                      disabled={(loader[MODELS.GPT] || loader[MODELS.GPT_TUNNED] || loader[MODELS.GEMINI])}> Modify</button>
                    : <button onClick={handleSubmit} className="btn-one shadow-lg py-1"
                      disabled={(loader[MODELS.GPT] || loader[MODELS.GPT_TUNNED] || loader[MODELS.GEMINI])}>Generate</button>
                }
              </div>
              {(loader[MODELS.GPT] || loader[MODELS.GPT_TUNNED] || loader[MODELS.GEMINI]) ?
                <div className="clearfix m-4">
                  <div className="spinner-border spinner-border-md float-end" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                : <></>}
            </div>
          </form>
        </div>
      </div>
      <ModalPreview refModalPreview={refModalPreview} opened={modalOpened} setOpened={setModalOpened} diagrams={diagrams} diagramsDispatch={diagramsDispatch} handleModify={handleModify} loader={loader} repaint={props.repaint} modalPreview={modalPreview} closeModals={closeModals}></ModalPreview>
    </div>
  )
}

export default ModalAssistant;