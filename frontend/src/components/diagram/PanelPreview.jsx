import React, { useCallback, useEffect, useState } from 'react'

// BPMN
import BpmnModeler from 'bpmn-js/lib/Modeler';

export default function PanelPreview(props) {
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

    useEffect(() => {
        console.log(props.opened);
        if (props.opened)
            return;

        console.log("Guardar");

        props.setOpened(true);

        modeler.saveXML({ format: true }).then(data => {
            props.setDiagrams({
                ...props.diagrams,
                [props.id]: {
                    ...props.diagrams[props.id],
                    xml: data.xml
                }
            });
        });
    }, [props.opened])

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

    useEffect(() => {
        if (diagram.xml === "") {
            setDiagram(props.diagrams[props.id]);
            return
        }

        run(modeler, props.diagrams[props.id].xml);
    }, [diagram, props, run, modeler])

    return (<div id={"preview" + props.id} style={{ height: window.innerHeight * 0.7, width: window.innerWidth }} />);

}