import React, {useState} from 'react'
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

/**
 * Typeahead based Select
 * @param {data, type, label}
 *   data is the countries or the provinces array
 *   selection is a callback (for now)
 *   label is a label component of choice
 */
function Select({data, selection, label}) {
    const [selected, setSelected] = useState(0)
    return (
        <div className="select-container">
            {label ? label : null}
            <Typeahead
                onChange={(selected) => {
                    setSelected(selected)
                    selection(selected)
                }}
                selected={selected}
                options={data}
            />
        </div>
    )
}

export default Select