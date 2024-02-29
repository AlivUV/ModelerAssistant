import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { calculateDiagramMicroservices, getDiagram as getInfoDiagram, updateDiagram } from '../../service/DiagramService';
import { addRules } from '../../service/AprioriService';
import { Toast, Modal } from 'bootstrap';
import * as ProjectService from "../../service/ProjectService";

// BPMN
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import uhExtension from '../../resources/userHistory';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import { options } from '@bpmn-io/properties-panel/preact';

// Components
import NavBar from '../NavBar';
import ModalDiagram from './ModalDiagram';
import Alert from '../Alert';
import ModalPropertiesPanel from './ModalPropertiesPanel';
import ModalUserStories from './ModalUserStories';
import ModalAssistant from './ModalAssistant';
import ModalPdf from '../pdfbacklog/ModalPdf';
import { MICROSERVICE_VIEWER_URL } from "../../utils";


function ModelerComponent() {
  const HIGH_PRIORITY = 1500;
  const { diagramId, projectId } = useParams();
  const [instanceModeler, setInstanceModeler] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [refAlertElement] = useState(React.createRef());
  const [refModalPropertiesElement] = useState(React.createRef());
  const [modalPropertiesPanel, setModalPropertiesPanel] = useState('');
  const [refModalUserStories] = useState(React.createRef());
  const [refModalAssistant] = useState(React.createRef());
  const [, setModalAssistant] = useState('');
  const [modalPdf, setModalPdf] = useState('');
  const [refModalPdf] = useState(React.createRef());
  const [modalUserStories, setModalUserStories] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [typeElement] = useState('uh:props');
  const [newTask, setNewTask] = useState('');
  const [project, setProject] = useState({});
  const [overlaysError, setOverlaysError] = useState([]);
  const [overlaysSmart, setOverlaysSmart] = useState([]);
  const [loadCreateUserStories, setLoadCreateUserStories] = useState(true);
  const [loadSave, setLoadSave] = useState(true);
  const [blockingViewMicroservices, setBlockingViewMicroservices] = useState(false);

  const [diagram, setDiagram] = useState({
    name: '',
    description: '',
    xml: '',
  });

  async function run(bpmnModeler, xml) {
    try {
      await bpmnModeler.importXML(xml).then(() => {
        bpmnModeler.on('element.contextmenu', HIGH_PRIORITY, (e) => {
          e.originalEvent.preventDefault();
          e.originalEvent.stopPropagation();
          const element = e.element;

          if (is(element, 'uh:props')) {
            setSelectedElement(element);
            const modal = new Modal(refModalPropertiesElement.current, options);
            modal.show();
            setModalPropertiesPanel(modal);
          }
        });

        createTagUH(bpmnModeler, 'Initialize Tasks')
        createTagSmart(bpmnModeler)
        applyEvents(bpmnModeler)
        setInstanceModeler(bpmnModeler)
      })
    } catch (err) {
      // console.log(err);
    }
  }

  const createTagUH = (bpmnModeler, type) => {
    const modeling = bpmnModeler.get('modeling');
    const overlays = bpmnModeler.get('overlays');
    const elementRegistry = bpmnModeler.get('elementRegistry');
    const tasks = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));

    // Reset id task
    if (type !== 'Create Task') {
      tasks.forEach((element, i) => {
        modeling.updateProperties(element, {
          'id': (i + 1)
        })
      })
    }

    // Assign id task
    tasks.forEach((element, i) => {
      modeling.updateProperties(element, {
        'id': 'US-' + (i + 1),
      })
      overlays.add(element, {
        position: {
          top: -12,
          right: 55
        },
        html: `<div class="task-note">
                  <span class="task-note-text text-white">${element.businessObject.id}</span>
              </div>`
      });
    })
  }

  const createTagSmart = (bpmnModeler) => {
    const overlays = bpmnModeler.get('overlays');
    const elementRegistry = bpmnModeler.get('elementRegistry');
    const tasks = elementRegistry.filter(element => (is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity')) && element.businessObject.get('uh:smart'));
    const smartTags = []
    var overlayId

    // Assign id task
    tasks.forEach((element, i) => {
      overlayId = overlays.add(element, {
        position: {
          bottom: 17,
          right: 17
        },
        html: `<div class="smart-note">
                <img class="w-80" src="/img/icono_smart.webp"></img>
              </div>`
      });
      smartTags.push({
        overlayId: overlayId,
        taskId: element.businessObject.id
      })
    })

    setOverlaysSmart(smartTags)
  }

  const save = async (modeler) => {
    setLoadSave(false)
    const elementRegistry = modeler.get('elementRegistry');
    const overlays = modeler.get('overlays');
    const tasks = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));
    const participants = elementRegistry.filter(element => is(element, 'bpmn:Participant'));
    const lanes = elementRegistry.filter(element => is(element, 'bpmn:Lane'))
    const invalidParticipants = [];
    const invalidTasks = [];
    var isValid = true;

    // Validate
    // Content task
    tasks.forEach(element => {
      if (element.businessObject.name === undefined || element.businessObject.name === null) {
        isValid = false;
        invalidTasks.push(element)
      }
    })
    // Role pool
    participants.forEach(element => {
      if (element.businessObject.name === undefined || element.businessObject.name === null) {
        isValid = false;
        invalidParticipants.push(element)
      }
    })
    // Role lane
    lanes.forEach(element => {
      if (element.businessObject.name === undefined || element.businessObject.name === null) {
        isValid = false;
        invalidParticipants.push(element)
      }
    })

    // Remove Notes
    overlaysError.forEach(element => {
      overlays.remove(element);
    })

    if (isValid) {
      try {
        // Update Diagram
        const data = await modeler.saveXML({ format: true });
        const resultSvg = await modeler.saveSVG({ format: true });
        const formData = {
          name: diagram.name,
          description: diagram.description,
          xml: data.xml,
          svg: resultSvg.svg,
          json_user_histories: jsonCreate(modeler),
        }
        addAssociationRules();
        await updateDiagram(formData, diagramId).then(res => {
          setLoadSave(true);
        });

        // Alert
        setAlertMessage('Successfully saved');
        setAlertType('Success');
        const toast = new Toast(refAlertElement.current);
        toast.show();
      } catch (error) {
        // Alert
        setAlertMessage('Something wrong happened');
        setAlertType('Error');
        const toast = new Toast(refAlertElement.current);
        toast.show();
      }
      return true
    } else {
      // Alert
      setAlertMessage('Something wrong happened');
      setAlertType('Error');
      const toast = new Toast(refAlertElement.current);
      toast.show();
      // Create Note
      var overlayId, overlayIds = [];
      invalidParticipants.forEach(element => {
        overlayId = overlays.add(element, {
          position: {
            top: -19,
            right: 195
          },
          html: `<div class="pool-note-error">
                  <span class="me-2 text-white"><i class="bi bi-exclamation-octagon-fill"></i></span>
                  <span class="pool-note-error-text text-white">The role field is required</span>
                </div>`
        });
        overlayIds.push(overlayId)
      })
      invalidTasks.forEach(element => {
        overlayId = overlays.add(element, {
          position: {
            top: -12,
            left: -5
          },
          html: `<div class="task-note-error">
                  <span class="text-white"><i class="bi bi-exclamation-octagon-fill"></i></span>
                </div>`
        });
        overlayIds.push(overlayId)
      })
      setOverlaysError(overlayIds)
      setLoadSave(true);

      return false
    }
  }

  const addAssociationRules = async () => {
    const elementRegistry = instanceModeler.get('elementRegistry');
    // Add Rules - Association Rules
    const arrElements = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));
    var newRules = []
    arrElements.forEach(element => {
      newRules = createAssociationRule(element, element, newRules)
    })
    await addRules(newRules)
  }

  const createAssociationRule = (element, elementSource, rules) => {
    element.outgoing.forEach(elementArrow => {
      if (is(elementArrow.target, 'bpmn:Task') || is(elementArrow.target, 'bpmn:CallActivity')) {
        rules.push([elementSource.businessObject.name.toLowerCase(), elementArrow.target.businessObject.name.toLowerCase()])
      } else if (is(elementArrow.target, 'bpmn:SubProcess')) {
      } else {
        createAssociationRule(elementArrow.target, elementSource, rules)
      }
    });

    return rules
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setDiagram((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const sortUserStories = (arrUserStories, sortedUserStories) => {
    var priorities = ['Very low', 'Low', 'Medium', 'High', 'Very high']
    priorities = priorities.reverse();
    var part

    if (arrUserStories.length === 0) {
      return sortedUserStories;
    } else if (sortedUserStories.length === 0) {
      // Filter by dependencies
      part = arrUserStories.filter(element => element.dependencies.length === 0)
    } else {
      // Filter by dependencies
      part = arrUserStories.filter(element => {
        var foundNoDependencies = false
        element.dependencies.forEach(dependence => {
          if (!sortedUserStories.find(task => task.id === dependence.id)) {
            foundNoDependencies = true
          }
        })

        if (foundNoDependencies) {
          return false
        } else {
          return true
        }
      });
    }

    // If there is a cycle
    if (part.length === 0) {
      var elements = arrUserStories.sort((a, b) => {
        return priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
      })
      part = [elements[0]]
    }

    // Sort by priorities
    part.sort((a, b) => {
      return priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
    })

    part = [part[0]]
    arrUserStories = arrUserStories.filter(elemento => part.indexOf(elemento) === -1);
    sortedUserStories = sortedUserStories.concat(part)
    return sortUserStories(arrUserStories, sortedUserStories)
  }

  const jsonCreate = () => {
    var arrUserStories = []
    const elementRegistry = instanceModeler.get('elementRegistry');
    var arrElements = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));

    const getActor = (element) => {
      if (is(element.parent, "bpmn:SubProcess")) return getActor(element.parent)
      else if (element.businessObject?.lanes && element.businessObject.lanes.length > 0) return element.businessObject.lanes[0].name
      else if (element.parent.businessObject.name) return element.parent.businessObject.name
      else return ""
    }

    arrElements.forEach(element => {
      let uh = {
        'id': element.businessObject.id ? element.businessObject.id : "",
        'project': project.name ? project.name : "",
        'name': element.businessObject.name ? element.businessObject.name : "",
        'actor': getActor(element),
        'priority': element.businessObject.get('uh:priority') ? element.businessObject.get('uh:priority') : "",
        'points': element.businessObject.get('uh:points') ? element.businessObject.get('uh:points') : "",
        'developer': element.businessObject.get('uh:developer') ? element.businessObject.get('uh:developer') : "",
        'purpose': element.businessObject.get('uh:purpose') ? element.businessObject.get('uh:purpose') : "",
        'restrictions': element.businessObject.get('uh:restrictions') ? element.businessObject.get('uh:restrictions') : "",
        'acceptanceCriteria': element.businessObject.get('uh:acceptanceCriteria') ? element.businessObject.get('uh:acceptanceCriteria') : "",
        'dependencies': createDependencies(element),
      }
      arrUserStories.push(uh)
    });

    // Sort tasks by priority and dependencies
    arrUserStories = sortUserStories(arrUserStories, []);

    return {
      diagramId: diagramId,
      userStories: arrUserStories
    }
  }

  const getProject = async () => {
    try {
      await ProjectService.getProject(projectId).then(res => {
        setProject(res.data)
      });
    } catch (error) {
      // console.log(error)
    }
  }

  const openModalUserStories = () => {
    const modal = new Modal(refModalUserStories.current, options);
    modal.show();
    setModalUserStories(modal);
  }

  const openModalAssistant = () => {
    const modal = new Modal(refModalAssistant.current, options);
    modal.show();
    setModalAssistant(modal);
  }

  const onClickViewMicroservices = async (modeler) => {
    const elementRegistry = modeler.get('elementRegistry');
    const overlays = modeler.get('overlays');
    const participants = elementRegistry.filter(element => is(element, 'bpmn:Participant'));
    const tasks = elementRegistry.filter(element => is(element, 'bpmn:Task') || is(element, 'bpmn:CallActivity'));
    const invalidParticipants = [];
    const invalidTasks = [];
    var isValid = true;

    setBlockingViewMicroservices(true);
    setAlertMessage('Generating Microservices');
    setAlertType('Success');
    const toast = new Toast(refAlertElement.current, { autohide: false });
    toast.show();


    // Validate
    tasks.forEach(element => {
      if (element.businessObject.name === undefined || element.businessObject.name === null) {
        isValid = false;
        invalidTasks.push(element)
      }
    })
    participants.forEach(element => {
      if (element.businessObject.name === undefined || element.businessObject.name === null) {
        isValid = false;
        invalidParticipants.push(element)
      }
    })

    // Remove Notes
    overlaysError.forEach(element => {
      overlays.remove(element);
    })

    if (isValid) {
      try {
        // Update Diagram
        //const data = await modeler.saveXML({ format: true });
        //const resultSvg = await modeler.saveSVG({ format: true });
        const formData = {
          json_user_histories: jsonCreate(modeler),
        }
        const interoperabilityData = {
          "userStories": formData.json_user_histories.userStories
        }
        await calculateDiagramMicroservices(interoperabilityData).then(
          res => res.json()).then(
            data => {
              setBlockingViewMicroservices(false);
              toast.hide();
              window.open(`${MICROSERVICE_VIEWER_URL}?diagrama=${data["result"]}`, '_blank', 'noopener,noreferrer')
            });

      } catch (error) {
        // Alert
        setAlertMessage(`${error}`);
        setAlertType('Error');
        const toast = new Toast(refAlertElement.current);
        toast.show();
        setBlockingViewMicroservices(false);
      }
      return true
    }
    return false
  }

  const openModalPdf = async () => {
    setLoadCreateUserStories(false)
    var open = await save(instanceModeler)
    modalUserStories.hide();
    setLoadCreateUserStories(true)
    if (open) {
      const modal = new Modal(refModalPdf.current, options);
      modal.show();
      setModalPdf(modal);
    }
  }

  const createDependencies = (selectedElement) => {
    const modeling = instanceModeler.get('modeling');
    var arrDependencies = []
    arrDependencies = iterElement(selectedElement, arrDependencies);
    modeling.updateProperties(selectedElement, {
      'uh:dependencies': arrDependencies
    });
    return arrDependencies;
  }

  const iterElement = (actualElement, arrDependencies) => {
    actualElement.incoming.forEach(element => {
      if (is(element.source, 'bpmn:Task') || is(element.source, 'bpmn:CallActivity')) {
        if (!arrDependencies.find(dependence => dependence.id === element.source.businessObject.id)) {
          arrDependencies.push({
            id: element.source.businessObject.id,
            name: element.source.businessObject.name
          })
        }
      } else {
        iterElement(element.source, arrDependencies)
      }
    });
    return arrDependencies;
  }

  const applyEvents = (modeler) => {
    const eventBus = modeler.get('eventBus');
    const modeling = modeler.get('modeling');
    var idChangeType;
    eventBus.on('commandStack.shape.create.postExecute', async (e) => {
      if (is(e.context.shape, 'bpmn:Task') || is(e.context.shape, 'bpmn:CallActivity')) {
        setNewTask(e.context.shape);
      }
      if (is(e.context.shape, 'bpmn:SubProcess')) {
        idChangeType = e.context.shape.id
        modeling.updateProperties(e.context.shape, {
          'id': 'newElement'
        });
      }
    })
    eventBus.on('commandStack.shape.delete.preExecuted', (e) => {
      if (is(e.context.shape, 'bpmn:Task') || is(e.context.shape, 'bpmn:CallActivity')) {
        modeling.updateProperties(e.context.shape, {
          'id': idChangeType || 'deleteElement'
        });
        idChangeType = 'deleteElement'
      }
    })
    eventBus.on('commandStack.shape.delete.postExecute', (e) => {
      if (is(e.context.shape, 'bpmn:Task') || is(e.context.shape, 'bpmn:CallActivity')) {
        createTagUH(modeler, 'Remove Task')
      }
    })
  }

  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
      ],
      moddleExtensions: {
        uh: uhExtension
      },
      textRenderer: {
        defaultStyle: {
          fontFamily: '"Montserrat"'
        }
      },
      // keyboard: {
      //   bindTo: document
      // }
    });
    getProject();

    const getData = async () => {
      try {
        const response = await getInfoDiagram(diagramId);
        setDiagram(response.data);
        run(modeler, response.data.xml);
      } catch (error) {
        // console.log(error);
      }
    }

    getData();
  }, [])

  return (
    <div className='bg-two'>
      <NavBar />

      <div id="model_diagram">
        {/* Options diagram */}
        <div className='d-flex justify-content-between align-items-center info py-2 px-3'>
          {/* Name and edit */}
          <div className='d-flex'>
            <h4 className='mb-0'>{project.name} / {diagram.name}</h4>
            <button className='btn-transparent ms-2' data-bs-toggle="modal" data-bs-target="#modalDiagram">
              <i className="bi bi-pencil"></i>
            </button>
          </div>
          <div>
            {/* Button View US */}
            <button className="btn-four py-2 me-3" onClick={() => openModalUserStories()}>
              <i className="bi bi-file-earmark-text"></i> View Product Backlog
            </button>
            {/* Button View MS */}
            <button className="btn-four py-2 me-3" onClick={() => onClickViewMicroservices(instanceModeler)} disabled={blockingViewMicroservices}>
              <i className="bi bi-file-earmark-text"></i> View MS
            </button>
            {/* Button Assistant */}
            <button className="btn-four py-2 me-3" onClick={() => openModalAssistant()} >
              <i className="bi bi-file-earmark-text"></i> Assistant
            </button>
            {/* Button Save */}
            <button id="save_diagram" className="btn-one py-2"
              onClick={async () => {
                console.log(await instanceModeler.saveXML({ format: true }));
                return; //save(instanceModeler)
              }}
              disabled={!loadSave}>
              {
                loadSave ?
                  <i className="bi bi-save me-1"></i>
                  :
                  <div className="spinner-border spinner-border-sm text-white me-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
              }
              Save
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div id='instructions-modeler' className='bg-one rounded shadow-lg z-index-1000 position-absolute bottom-0 start-0 m-3 p-2'>
          <p className='mb-0 text-white text-center fs-12'><strong className='text-white'>Right click (On the task)</strong> Open task properties</p>
        </div>

        {/* EBPM */}
        <div id="canvas"></div>
      </div>

      <ModalDiagram mode='Edit' handle={handleChange} name={diagram.name} description={diagram.description} />
      <ModalPropertiesPanel overlaysSmart={overlaysSmart} setOverlaysSmart={setOverlaysSmart} createTagUH={createTagUH} newTask={newTask} setNewTask={setNewTask} selectedElement={selectedElement} createDependencies={createDependencies} modeler={instanceModeler} typeElement={typeElement} modalPropertiesPanel={modalPropertiesPanel} refModalPropertiesElement={refModalPropertiesElement} />
      <ModalPdf jsonCreate={jsonCreate} modeler={instanceModeler} modalPdf={modalPdf} refModalPdf={refModalPdf}></ModalPdf>
      <ModalUserStories jsonCreate={jsonCreate} modeler={instanceModeler} modalUserStories={modalUserStories} refModalUserStories={refModalUserStories} openModalPdf={openModalPdf} loadCreateUserStories={loadCreateUserStories}></ModalUserStories>
      <Alert type={alertType} message={alertMessage} refAlertElement={refAlertElement} />
      <ModalAssistant refModalAssistant={refModalAssistant} ></ModalAssistant>
    </div>
  )
}
export default ModelerComponent;