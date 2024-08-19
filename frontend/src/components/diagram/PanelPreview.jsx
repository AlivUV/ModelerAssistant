import React, { useCallback, useEffect, useState } from 'react'

// BPMN
import BpmnModeler from 'bpmn-js/lib/Modeler';

export default function PanelPreview(props) {
    const HIGH_PRIORITY = 1500;
    // Initialize state variables for the modeler and diagram
    const [modeler, setModeler] = useState();
    const [diagram, setDiagram] = useState({
        name: '',
        description: '',
        xml: '',
    });


    // Define a run function that import the xml into the bpmnModeler
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

    // useEffect hook to save the diagram when the props.opened changes
    useEffect(() => {
        if (props.opened) {
            return;
        }

        props.setOpened(true);

        modeler.saveXML({ format: true }).then(data => {
            props.diagramsDispatch({
                type: `UPDATE_MODEL_XML`,
                model: props.id,
                payload: {
                    xml: data.xml
                }
            });
        });
    }, [props.opened])

    // useEffect hook to initialize the modeler when the component mounts
    useEffect(() => {
        if (modeler)
            return;

        setModeler(new BpmnModeler({
            container: `#preview${props.id}`,
            textRenderer: {
                defaultStyle: {
                    fontFamily: '"Montserrat"'
                }
            }
        }));
    }, [modeler, props])

    // useEffect hook to run the diagram when the diagram or props change
    useEffect(() => {
        if (diagram.xml === "") {
            console.log(props.diagrams)
            setDiagram(props.diagrams[props.id]);
            return
        }

        run(modeler, props.diagrams[props.id].xml);
    }, [diagram, props, run, modeler])

    // Return the preview div with the specified height and width
    return (<div id={"preview" + props.id} style={{ height: window.innerHeight * 0.66, width: window.innerWidth }} />);

}