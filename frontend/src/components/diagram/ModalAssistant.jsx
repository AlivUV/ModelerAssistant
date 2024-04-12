import React, { useState } from 'react';
import * as AssistantService from "../../service/AssistantService"
import { Modal } from 'bootstrap';

// BPMN
import { options } from '@bpmn-io/properties-panel/preact';

// Components
import ModalPreview from './ModalPreview';

function ModalAssistant(props) {

  const [modalOpened, setModalOpened] = useState(true);
  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition] = useState(new window.webkitSpeechRecognition());
  const [record, setRecord] = useState([{ role: 'system', content: 'You are a helpful assistant.' }]);
  const [modalPreview, setModalPreview] = useState();
  const [isLoading, setIsLoading] = useState({ gpt: false, gptTunned: false, gemini: false });
  const [previewDiagrams, setPreviewDiagrams] = useState({
    gpt: { ...props.diagram, record: [{ role: 'system', content: 'You are a helpful assistant.' }], xml: '' },
    gptTunned: { ...props.diagram, record: [{ role: 'system', content: 'You are a bpm expert who gives diagrams in json format' }], xml: '' },
    gemini: { ...props.diagram, record: [{}], xml: '' }
  });
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


  const manageResponse = (response, model, history, diagrams, loading, start) => {
    history = [
      ...history,
      { role: 'user', content: response.message },
      { role: 'assistant', content: response.json }
    ];

    setRecord(history);

    diagrams[model].record = [
      diagrams[model].record[0],
      { role: 'user', content: response.message },
      { role: 'assistant', content: response.json }
    ];
    diagrams[model].xml = response.xml;
    setPreviewDiagrams(diagrams);
    loading[model] = false;
    setIsLoading(loading);

    console.log(`El asistente ${model} se tomó: ${Date.now() - start}`);
  }


  const modelCall = (model, description, diagrams, history, loading) => {
    const start = Date.now();

    AssistantService[model](description)
      .then(response => manageResponse(response, model, history, diagrams, loading, start));
  };


  const handleSubmit = async (evt) => {
    let history = record;
    let diagrams = previewDiagrams;
    let loading = { gpt: true, gptTunned: false, gemini: false };

    setIsLoading(loading);

    modelCall("gpt", description, diagrams, history, loading);
    //modelCall("gptTunned", description, diagrams, history, loading);
    modelCall("gemini", description, diagrams, history, loading);

    openModalPreview();
  };


  const modelCallModify = (model, description, diagrams, history, loading) => {
    const start = Date.now();

    AssistantService[model + "Modify"](description, history)
      .then(response => manageResponse(response, model, history, diagrams, loading, start));
  };


  const handleModify = () => {
    let history = record;
    let diagrams = previewDiagrams;
    let loading = { gpt: true, gptTunned: false, gemini: false };

    setIsLoading(loading);

    modelCallModify("gpt", description, diagrams, history, loading);
    //modelCallModify("gptTunned", description, diagrams, history, loading);
    //modelCall("gemini", description, diagrams, history, loading);
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
                                <hr className="hr hr-blurry" />  {/*Divider*/}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
              }
              <div className="modal-footer border-0">
                <button type="button" className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Close</button>
                {
                  (previewDiagrams.gpt.xml === "" && previewDiagrams.gptTunned.xml === "" && previewDiagrams.gemini.xml === "")
                    ? <></>
                    : <button type="button" className="btn-two shadow-lg py-1" onClick={openModalPreview}>Preview</button>
                }

                {
                  (record.length > 1)
                    ? <button onClick={handleModify} className="btn-one shadow-lg py-1"
                      disabled={(isLoading.gpt || isLoading.gptTunned || isLoading.gemini)}> Modify</button>
                    : <button onClick={handleSubmit} className="btn-one shadow-lg py-1"
                      disabled={(isLoading.gpt || isLoading.gptTunned || isLoading.gemini)}>Generate</button>
                }
              </div>
              {(isLoading.gpt || isLoading.gptTunned || isLoading.gemini) ?
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
      <ModalPreview refModalPreview={refModalPreview} opened={modalOpened} setOpened={setModalOpened} diagrams={previewDiagrams} setDiagrams={setPreviewDiagrams} loading={isLoading} repaint={props.repaint} modalPreview={modalPreview} closeModals={closeModals}></ModalPreview>
    </div>
  )
}

export default ModalAssistant;