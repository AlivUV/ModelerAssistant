import React, { useCallback, useState, useEffect } from 'react';

// Components
import PanelPreview from './PanelPreview';
import Metrics from './Metrics';


function ModalPreview(props) {
  // Estado para controlar la apertura del panel lateral
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  //Estado para el valor del área de texto
  const [textAreaValue, setTextAreaValue] = useState('');
  // Initializing speech recognition object using window.webkitSpeechRecognition
  const [recognition] = useState(new window.webkitSpeechRecognition());
  const [isRecording, setIsRecording] = useState(false);
  // Initializing state variable to store active tab
  const [activeTab, setActiveTab] = useState('gpt'); // Estado para gestionar la pestaña activa
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!props.diagrams[activeTab].metrics) {
      setTableData([])
      return
    }


    let data = [];

    for (const [key, value] of Object.entries(props.diagrams[activeTab].metrics)) {
      data.push({ attribute: key, value: value })
    };
    setTableData(data);
  }, [activeTab, props.diagrams[activeTab].metrics]);


  /**
   * Function to handle tab change.
   * @param {String} tab The name of tab to be changed.
   * @returns {undefined} No return value.
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  /**
   * Initializing handleClose function to close the modal.
   * @returns {undefined} No return value.
   */
  const handleClose = useCallback(() => {
    props.setOpened(false)
  }, [props])


  /**
   * Initializing handleCreate function to create a new diagram.
   * @returns {undefined} No return value.
   */
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


  /**
   * Initializing startRecording function to start and stop voice recording.
   * @returns {undefined} No return value.
   */
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


  /**
   * Function to send a modification request  to the selected model
   * @returns {undefined}
   */
  const handleModify = () => {
    setIsPanelOpen(false);
    props.handleModify(activeTab, textAreaValue);
  }


  // Returning JSX content to be rendered
  return (
    <div
      style={{ height: "100", width: "100%" }}
      className="modal fade"
      id="ModalPreview"
      aria-labelledby="ModaltittlePreview"
      aria-hidden="true"
      ref={props.refModalPreview}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" style={{ flex: 1, overflowX: 'auto' }}>
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
                {props.loader.gpt &&
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
                <span style={{ marginRight: '5px' }}>GPT-3.5 Fine-Tuning</span>
                {props.loader.gptTunned &&
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
                {props.loader.gemini &&
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                }
              </button>
            </li>
            {/* Add more tabs as needed */}
          </ul>

          {/* Tab Content */}
          <div className="tab-content" style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', backgroundColor: 'white' }}>
            <div
              className={`tab-pane fade ${activeTab === 'gpt' ? 'show active' : ''}`} style={{ flex: 3, overflowX: 'hidden' }}
            >
              {/* Content for Tab 1 */}
              <PanelPreview id={'gpt'} opened={props.opened} setOpened={props.setOpened} diagrams={props.diagrams} diagramsDispatch={props.diagramsDispatch} />

            </div>
            <div
              className={`tab-pane fade ${activeTab === 'gptTunned' ? 'show active' : ''}`} style={{ flex: 3, overflowX: 'hidden' }}
            >
              {/* Content for Tab 2 */}
              {/* Add content for Tab 2 */}
              <PanelPreview id={'gptTunned'} opened={props.opened} setOpened={props.setOpened} diagrams={props.diagrams} diagramsDispatch={props.diagramsDispatch} />
            </div>
            <div
              className={`tab-pane fade ${activeTab === 'gemini' ? 'show active' : ''}`} style={{ flex: 3, overflowX: 'hidden' }}
            >
              {/* Content for Tab 3 */}
              {/* Add content for Tab 3 */}
              <PanelPreview id={'gemini'} opened={props.opened} setOpened={props.setOpened} diagrams={props.diagrams} diagramsDispatch={props.diagramsDispatch} />
            </div>
            {/* Add more tab content as needed */}
            <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Metrics data={tableData} />
            </div>
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
            <div className="modal-content bg-two border-0">
              <div className="modal-header bg-one">
                <h5 className="modal-title text-white" id="tittleModalDiagram"> Modification of {activeTab}</h5>
              </div>
            </div>
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
            <button type="button" onClick={handleModify} className="btn-one shadow-lg py-1">Send</button>
          </div>
        </div>
      )}
    </div >
  );
}

export default ModalPreview;