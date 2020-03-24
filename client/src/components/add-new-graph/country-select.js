import React, { useState } from 'react'

import { useApolloClient } from '@apollo/react-hooks'
import Form from 'react-bootstrap/Form'
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css'

import { GET_COUNTRIES } from '../../queries/client'


function CountrySelect({onSelect}) {
    const client = useApolloClient()
    const { countries } = client.readQuery({query: GET_COUNTRIES})
    return (
        <Form>
            <Typeahead
                id="country"
                options={countries}
                labelKey="name"
                placeholder="Choose a country"
                onChange={onSelect}
            />
        </Form>
    )
}

export default CountrySelect