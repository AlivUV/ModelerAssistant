import React, { useState } from 'react';
import * as AssistantService from "../../service/AssistantService"
import { Modal } from 'bootstrap';

// BPMN
import { options } from '@bpmn-io/properties-panel/preact';

// Components
import ModalPreview from './ModalPreview';

function ModalAssistant(props) {

  const [activities, setActivities] = useState([]);
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState({ ...props.diagram, xml: "" });
  const [refModalPreview] = useState(React.createRef());

  const addActivity = () => {
    setActivities([...activities, ["", ""]]);
  }

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

  const openModalPreview = () => {
    const modal = new Modal(refModalPreview.current, options);
    modal.show();
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const response = await AssistantService.autocomplete(description, activities);

    setPreview({ ...preview, xml: response.data.xml.split('```')[1].slice(4) });

    openModalPreview();
  };

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
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div>
                <label className="form-label">Description:</label>
                <textarea className="form-control" required rows="5" onChange={handleChangeDescription} name='description' ></textarea>
              </div>
              <hr className="hr hr-blurry" />  {/*Divider*/}
              <label className="form-label">More Details: </label>
              <div className="modal-footer border-0">
                <button type="button" id='add' className="btn-one shadow-lg py-1"
                  onClick={() => addActivity()}
                > <i className="bi bi-plus-circle"></i> Add</button>
              </div>
              <div>
                {
                  activities.map((activity, index) => (
                    <div key={index + 1}>
                      <div className='row' >
                        <div className='col-10' >
                          <div className="mb-2 mt-2">
                            <label className="form-label">Activity: {index + 1}</label>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn-two shadow-lg py-1" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn-one shadow-lg py-1" >Create</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ModalPreview refModalPreview={refModalPreview} diagram={preview}></ModalPreview>
    </div>
  )
}

export default ModalAssistant;