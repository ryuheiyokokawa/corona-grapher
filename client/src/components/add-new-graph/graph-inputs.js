import React, { useState } from 'react'
import moment from 'moment'
import CountrySelect from './country-select'

const singleDefault = {
    country: 'US',
    province: 'Washington'
}


const multipleDefault = [{
    country: 'US',
    province: 'Washington'
}]

function GraphInputs() {

    // Shared inputs
    const [title, setTitle] = useState('title')
    const [type, setType] = useState('line')
    const [start, setStart] = useState( moment().add( -7,'days' ) )
    const [end, setEnd] = useState( moment().add( -7,'days' ) )
    
    //Single (Pie, StackedArea)
    const [single, setSingle] = useState(singleDefault)

    //Multiple (Line, StackedBar)
    const [multple, setMultiple] = useState(multipleDefault)


    return (
        <section>
            <CountrySelect></CountrySelect>
        </section>
    )
}

export default GraphInputs