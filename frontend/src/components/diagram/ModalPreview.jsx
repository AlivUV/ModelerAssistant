import React, { useCallback, useState } from 'react'

import PanelPreview from './PanelPreview';

// BPMN

function ModalPreview(props) {
  const [activeTab, setActiveTab] = useState('gpt'); // Estado para gestionar la pestaña activa
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
                {props.loadingGpt &&
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
                {props.loadingGptTunned &&
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
                {props.loadingGemini &&
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
            <button type="submit" onClick={handleCreate} className="btn-one shadow-lg py-1">Create</button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default ModalPreview;