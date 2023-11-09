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

          <div id="preview" style={{
            height: '600px',
            width: '100%'
          }} />

          <div className="modal-footer border-0">
            <button type="button" onClick={handleClose} className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default ModalPreview;