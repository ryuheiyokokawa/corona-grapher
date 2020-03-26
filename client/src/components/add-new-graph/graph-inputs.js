import React, { useState, useEffect } from 'react'
import { useMutation } from "@apollo/react-hooks";
import { v4 as uuidv4 } from 'uuid';


//BS components
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

//Datepicker
import moment from 'moment'
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

//Sub-components
import CountrySelect from './inputs/country-select'
import ProvinceSelect from './inputs/province-select'
import { STORE_NEW_GRAPH } from '../../queries/client';


//State Defaults
const titleDefault = 'Graph Title'
const typeDefault = 'line'
const startDefault = moment().add( -7,'days' ).toDate()
const endDefault = new Date()
const singleDefault = {}
const multipleDefault = [{}]

function GraphInputs({onSuccess, submit}) {

    // Shared inputs
    const [title, setTitle] = useState(titleDefault)
    const [type, setType] = useState(typeDefault)
    const [startDate, setStartDate] = useState( startDefault )
    const [endDate, setEndDate] = useState( endDefault )
    
    //Single (Pie, StackedArea)
    const [single, setSingle] = useState(singleDefault)

    //Multiple (Line, StackedBar)
    const [multiple, setMultiple] = useState(multipleDefault)

    //CurrentGraph Object
    const currentGraph = {title, type, startDate, endDate, single, multiple}
        
    const [addGraph,{data}] = useMutation(STORE_NEW_GRAPH)
    useEffect(() => {
        if(submit) {//Submit is a parent state passed to this component to indicate send
            const graphType = {
                __typename: currentGraph.type
            }
            if(currentGraph.type === 'pie' || currentGraph.type === 'stacked-area') {
                graphType['country'] = currentGraph.single.country
                graphType['province'] = currentGraph.single.province
            } else {
                graphType['sources'] = currentGraph.multiple
            }
            console.log(graphType)
            const newGraph = {
                id: uuidv4(),
                title: currentGraph.title,
                startDate: currentGraph.startDate,
                endDate: currentGraph.endDate,
                graphType: graphType
            }
            try {
                addGraph({variables: {graph: newGraph}})
                
                //Clear states
                setTitle(titleDefault)
                setType(typeDefault)
                setStartDate(startDefault)
                setEndDate(endDefault)
                setSingle({})
                setMultiple([{}])
                //Send signal back to the modal component
                onSuccess()
            } catch(e) {
                //Maybe some sort of error for the form?
                console.log(e)
            }
        } else {
            //Need to reset the entire thing when we click on the add button
            setTitle(titleDefault)
            setType(typeDefault)
            setStartDate(startDefault)
            setEndDate(endDefault)
            setSingle({})
            setMultiple([{}])
        }
    }, [submit])



    return (
        <section>
            <Form>
                <Form.Group>
                    <Form.Row>
                        <Form.Label>Title</Form.Label>
                        <Col>
                            <Form.Control type="text" placeholder="title" value={title} onChange={(e) => {
                                setTitle(e.target.value)
                            }}/>
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Form.Group>
                    <Form.Row>
                        <Form.Label>Type</Form.Label>
                        <Col>
                            <Form.Control type="select" as="select" onChange={(e) => {
                                setType(e.target.value)
                            }}>
                                <option value="line">Line</option>
                                <option value="pie">Pie</option>
                                <option value="stacked-bar">Stacked Bar</option>
                                <option value="stacked-area">Stacked Area</option>
                            </Form.Control>
                        </Col>
                    </Form.Row>
                </Form.Group>

                <Form.Group>
                    <Form.Row>
                        <Form.Label>Start Date</Form.Label>
                        <Col>
                            <DatePicker 
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                minDate={new Date(2020, 0, 22)} 
                                maxDate={endDate}
                            />
                        </Col>
                    </Form.Row>
                </Form.Group>
                <Form.Group>
                    <Form.Row>
                        <Form.Label>End Date</Form.Label>
                        <Col>
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                minDate={startDate} 
                                maxDate={new Date()}
                            />
                        </Col>
                    </Form.Row>
                </Form.Group>
                
                <Form.Group>
                    <Form.Row>
                        {/* Choose based on chart type */}
                        {
                            (type === 'pie' || type === 'stacked-area') ? 
                            <SingleInputs 
                                single={single} 
                                setSingle={(data) => { 
                                    setSingle(data)
                                }} 
                            /> : 
                            <MultipleInputs 
                                multiple={multiple} 
                                setMultiple={(data)=> { 
                                    setMultiple(data)
                                }} 
                            />
                        }
                    </Form.Row>
                </Form.Group>
                
            </Form>
        </section>
    )
}

export default GraphInputs


function SingleInputs({single, setSingle}) {
    return (
        <Form.Group>
            <CountrySelect onSelect={(data)=> {
                let country = data[0]
                //I'm specifically overwriting below if the user changes the data we need to disable province selection.
                setSingle({
                    country: country
                })
            }}/>
            {single.country ? 
                <ProvinceSelect 
                    country_id={single.country.id}
                    onSelect={(selected) => {
                        let province = selected[0]
                        let newData = {
                            ...single,
                            province: province
                        }
                        setSingle(newData)
                    }}
                />
            : null}
        </Form.Group>
    )
    
}


function MultipleInputs({multiple, setMultiple}) {
    const [count, setCount] = useState(0)//because react is stupid and won't re-render this component for some odd reason for 

    useEffect(() => {
        setCount(0)
    },[multiple])

    const onChange = (data,i) => {
        let newMultiple = multiple
        newMultiple[i] = data
        setMultiple(newMultiple)
    }
    const addRow = () => {
        let newMultiple = multiple
        newMultiple.push({})
        setMultiple(newMultiple)
        setCount(count+1)
    }
    const deleteMe = (i) => {
        let newMultiple = multiple
        newMultiple.splice(i,1)
        setMultiple(newMultiple)
        setCount(count-1)
    }

    return (
        <Form.Group>
            <Button onClick={addRow}>Add Source</Button>
            {multiple.map((current, i) => {
                return (
                    <MultipleInput key={i} current={current} onChange={(data)=> onChange(data,i)} deleteMe={() => deleteMe(i)}/>
                )
            })}
        </Form.Group>
    )
}

function MultipleInput({ current, onChange, deleteMe}) {
    const [data,setData] = useState({})
    return (
        <Form.Group>
            <Form.Row>
                <CountrySelect current={current} onSelect={(selected)=> {
                    let country = selected[0]
                    //I'm specifically overwriting below if the user changes the data we need to disable province selection.
                    let newData = {
                        country: country
                    }
                    setData(newData)
                    onChange(newData)
                }}/>
                { data.country ? 
                <ProvinceSelect 
                    current={current}
                    country_id={data.country.id}
                    onSelect={(selected) => {
                        let province = selected[0]
                        let newData = {
                            ...data,
                            province: province
                        }
                        setData(newData)
                        onChange(newData)
                    }}
                />: null}
                <Button onClick={deleteMe}>X</Button>
            </Form.Row>
        </Form.Group>
    )
}