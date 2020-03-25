import React, { useState, useCallback } from 'react'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import moment from 'moment'
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

import CountrySelect from './inputs/country-select'
import ProvinceSelect from './inputs/province-select'


const singleDefault = {
}

const multipleDefault = [{}]

function GraphInputs({collectGraph}) {

    // Shared inputs
    const [title, setTitle] = useState('')
    const [type, setType] = useState('line')
    const [startDate, setStartDate] = useState( moment().add( -7,'days' ).toDate() )
    const [endDate, setEndDate] = useState( new Date() )
    
    //Single (Pie, StackedArea)
    const [single, setSingle] = useState(singleDefault)

    //Multiple (Line, StackedBar)
    const [multiple, setMultiple] = useState(multipleDefault)

    const currentGraph = {title, type, startDate, endDate, single, multiple}

    collectGraph(()=> {
        return currentGraph
    })

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
                            (type == 'pie' || type == 'stacked-area') ? 
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