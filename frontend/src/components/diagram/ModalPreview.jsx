import React, { useCallback, useState } from 'react'
import PanelPreview from './PanelPreview';

// BPMN

function ModalPreview(props) {
  const [activeTab, setActiveTab] = useState('gpt'); // Estado para gestionar la pestaña activa
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Estado para controlar la apertura del panel lateral
  const [textAreaValue, setTextAreaValue] = useState(''); //Estado para el valor del área de texto
  const [recognition] = useState(new window.webkitSpeechRecognition());
  const [isRecording, setIsRecording] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleClose = useCallback(() => {
    props.setOpened(false)
  }, [props])

  const handleCreate = () => {
    props.repaint(props.diagrams[activeTab].xml)
    props.closeModals();
  };

  const handleModifyClick = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleSend = () => {
    // Lógica para enviar el texto del área de texto
    console.log('Texto enviado:', textAreaValue);
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

      setTextAreaValue(tempTranscript);
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

  return (
    <div
      style={{ height: "100", width: "100%" }}
      className="modal fade"
      id="ModalPreview"
      aria-labelledby="ModaltittlePreview"
      aria-hidden="true"
      ref={props.refModalPreview}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div className="modal-content bg-two border-0">
          <div className="modal-header bg-one">
            <h5 className="modal-title text-white" id="tittlePropertiesPanel">Diagram Preview</h5>
            <button type="button" className="btn-one px-1" data-bs-dismiss="modal" aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Tab Navigation */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'gpt' ? 'active' : ''}`}
                onClick={() => handleTabChange('gpt')}
              >
                <span style={{ marginRight: '5px' }}>GPT-3.5</span>
                {props.loading.gpt &&
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                }
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'gptTunned' ? 'active' : ''}`}
                onClick={() => handleTabChange('gptTunned')}
              >
                <span style={{ marginRight: '5px' }}>GPT-3.5-Tunned</span>
                {props.loading.gptTunned &&
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                }
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'gemini' ? 'active' : ''}`}
                onClick={() => handleTabChange('gemini')}
              >
                <span style={{ marginRight: '5px' }}>Gemini</span>
                {props.loading.gemini &&
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                }
              </button>
            </li>
            {/* Add more tabs as needed */}
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            <div
              className={`tab-pane fade ${activeTab === 'gpt' ? 'show active' : ''}`}
            >
              {/* Content for Tab 1 */}
              <PanelPreview id={'gpt'} opened={props.opened} setOpened={props.setOpened} diagrams={props.diagrams} setDiagrams={props.setDiagrams} />
            </div>
            <div
              className={`tab-pane fade ${activeTab === 'gptTunned' ? 'show active' : ''}`}
            >
              {/* Content for Tab 3 */}
              {/* Add content for Tab 3 */}
              <PanelPreview id={'gptTunned'} opened={props.opened} setOpened={props.setOpened} diagrams={props.diagrams} setDiagrams={props.setDiagrams} />
            </div>
            <div
              className={`tab-pane fade ${activeTab === 'gemini' ? 'show active' : ''}`}
            >
              {/* Content for Tab 2 */}
              {/* Add content for Tab 2 */}
              <PanelPreview id={'gemini'} opened={props.opened} setOpened={props.setOpened} diagrams={props.diagrams} setDiagrams={props.setDiagrams} />
            </div>
            {/* Add more tab content as needed */}
          </div>
          <div className="modal-footer border-0">
            <button type="button" onClick={handleClose} className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Close</button>
            {!isPanelOpen && <button type="button" onClick={handleModifyClick} className="btn-two shadow-lg py-1">Modify</button>}
            <button type="submit" onClick={handleCreate} className="btn-one shadow-lg py-1">Create</button>
          </div>
        </div>
      </div>

      {/* Panel lateral */}
      {isPanelOpen && (
        <div className="side-panel">
          <div>
            <div class="row">
              <div className='col-8' >
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
            <textarea className="form-control" required value={textAreaValue} rows="5" onChange={(e) => setTextAreaValue(e.target.value)} name='description' style={{ overflow: 'auto', resize: 'vertical' }}></textarea>
          </div>
          <hr className="hr hr-blurry" />  {/*Divider*/}
          <div style={{ textAlign: 'right' }}>
            <button type="button" onClick={handleClosePanel} className="btn-two shadow-lg py-1">Close</button>
            <button type="button" onClick={handleSend} className="btn-one shadow-lg py-1">Send</button>
          </div>
        </div>
      )}
    </div >
  );
}

export default ModalPreview;