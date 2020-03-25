import React, {Fragment, useState} from 'react'
import { useQuery } from "@apollo/react-hooks";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import styled from 'styled-components'

import GraphInputs from './graph-inputs'
import { GET_ALL_GRAPHS,STORE_NEW_GRAPH } from '../../queries/client'

const AddButton = styled.button`
    //Placement
    position: fixed;
    bottom: 3vh;
    right: 3vw;

    // Shape
    display:block;
    width: 100px;
    height: 100px;
    border-radius: 50px;

    // Color
    background: blue;
    color: white;
    
    // Text
    text-align: center;
`

function AddNewGraph() {
    const [show, setShow] = useState(false);
    useQuery(STORE_NEW_GRAPH)
    let graph = {}
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handelSubmit = () => {
        //send graph to 
        setShow(false)
    }

    return (
        <Fragment>
            <AddButton onClick={handleShow}>
                +
            </AddButton>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GraphInputs collectGraph={(currentGraph)=> {
                        //This is stupid.  Don't worry, its a work in progress situation.
                        graph = currentGraph
                    }}/>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handelSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default AddNewGraph