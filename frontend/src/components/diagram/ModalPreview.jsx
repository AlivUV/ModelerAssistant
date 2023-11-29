import React, { useCallback, useEffect, useState } from 'react'

// BPMN
import BpmnModeler from 'bpmn-js/lib/Modeler';

function ModalPreview(props) {
  const HIGH_PRIORITY = 1500;
  const [modeler, setModeler] = useState();
  const [diagram, setDiagram] = useState({
    name: '',
    description: '',
    xml: '',
  });

  const [activeTab, setActiveTab] = useState('tab1'); // Estado para gestionar la pestaña activa
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  const run = useCallback(async (bpmnModeler, xml) => {
    try {
      await bpmnModeler.importXML(xml).then(() => {
        bpmnModeler.on('element.contextmenu', HIGH_PRIORITY, (e) => {
          e.originalEvent.preventDefault();
          e.originalEvent.stopPropagation();
        });
      })
    } catch (err) {
      // console.log(err);
    }
  }, [])

  const handleClose = useCallback(async () => {
    const data = await modeler.saveXML({ format: true });

    props.setDiagram({ ...props.diagram, xml: data.xml });
  }, [modeler, props])

  useEffect(() => {
    if (modeler)
      return;

    setModeler(new BpmnModeler({
      container: '#preview',
      textRenderer: {
        defaultStyle: {
          fontFamily: '"Montserrat"'
        }
      }
    }));
  }, [modeler])

  useEffect(() => {
    if (diagram.xml === "") {
      setDiagram(props.diagram);
      return
    }

    run(modeler, props.diagram.xml);
  }, [diagram, props.diagram, run, modeler])

  return (
    <div
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
                className={`nav-link ${activeTab === 'tab1' ? 'active' : ''}`}
                onClick={() => handleTabChange('tab1')}
              >
                GPT-3.5
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`}
                onClick={() => handleTabChange('tab2')}
              >
                Llama2
              </button>
            </li>
            {/* Add more tabs as needed */}
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            <div
              className={`tab-pane fade ${activeTab === 'tab1' ? 'show active' : ''}`}
            >
              {/* Content for Tab 1 */}
              <div id="preview" style={{ height: '500px', width: '100%' }} />
            </div>
            <div
              className={`tab-pane fade ${activeTab === 'tab2' ? 'show active' : ''}`}
            >
              {/* Content for Tab 2 */}
              {/* Add content for Tab 2 */}
            </div>
            {/* Add more tab content as needed */}
          </div>

          <div className="modal-footer border-0">
            <button type="button" onClick={handleClose} className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default ModalPreview;