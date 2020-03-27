import React, { useState, useEffect } from 'react'
import { useMutation } from "@apollo/react-hooks";
import { v4 as uuidv4 } from 'uuid';
import {withRouter} from 'react-router-dom'

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

function GraphInputs({onSuccess, submit, history}) {
    
    // Shared inputs
    const [title, setTitle] = useState(titleDefault)
    const [type, setType] = useState(typeDefault)
    const [startDate, setStartDate] = useState( startDefault )
    const [endDate, setEndDate] = useState( endDefault )
    
    //Single (Pie, StackedArea)
    const [single, setSingle] = useState({})

    //Multiple (Line, StackedBar)
    const [multiple, setMultiple] = useState([{}])

    //CurrentGraph Object
    const currentGraph = {title, type, startDate, endDate, single, multiple}
        
    const [addGraph,{data}] = useMutation(STORE_NEW_GRAPH,{
        onCompleted: (data) => {
            let redirectID = data.storeNewGraph.id
            history.push(`/graphs/${redirectID}`)
        }
    })

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
                        
            const newGraph = {
                id: uuidv4(),
                title: currentGraph.title,
                startDate: currentGraph.startDate,
                endDate: currentGraph.endDate,
                graphType: graphType
            }
            try {
                addGraph({variables: {graph: newGraph}})
                //Send signal back to the modal component
                onSuccess()
            } catch(e) {
                //Maybe some sort of error for the form?
                console.log(e)

                //TODO: implement onFail along with validation
                //onFail()
            }
        } else {
            //Need to clear the states when we click on the add button
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
                            <p>Line currently only plots confirmed.  Will add option later.</p>
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
                    
                
            </Form>
        </section>
    )
}

export default withRouter(GraphInputs)


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
            <Form.Row className="pb-2">
                <Button onClick={addRow}>Add Source</Button>
            </Form.Row>
            {multiple.map((current, i) => {
                return (
                    <MultipleInput 
                        key={i} 
                        current={current} 
                        onChange={(data)=> onChange(data,i)} 
                        deleteMe={() => deleteMe(i)}
                    />
                )
            })}
        </Form.Group>
    )
}

function MultipleInput({ current, onChange, deleteMe}) {
    const [data,setData] = useState({})
    return (
        <Form.Row  className="pb-2">
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
    )
}