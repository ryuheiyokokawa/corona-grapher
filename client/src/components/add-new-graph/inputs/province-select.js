import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css'

import { PROVINCES_FOR_COUTNRY } from '../../../queries'


function ProvinceSelect({country_id,onSelect}) {
    let query = useQuery(PROVINCES_FOR_COUTNRY, {
        variables: {country_id: country_id}
    })
    if(query.data) {
        let provinces = Object.values(query.data.provinces)
        if(provinces.length) {
            let sorted_provinces = alphaSort(provinces,'name')
            return (
                <Typeahead
                    id="province"
                    options={sorted_provinces}
                    selectHintOnEnter={true}
                    labelKey="name"
                    placeholder="Choose a province"
                    onChange={onSelect}
                />
            )
        } else {
            return null
        }
    } else {
        return (<div>Loading...</div>)
    }
}

export default ProvinceSelect

const alphaSort = (array, key) => {
    //Slice below is just to make a new array
    const newArray = array.slice().sort((a,b) => {
        let nA = a[key].toLowerCase()
        let nB = b[key].toLowerCase()
        if(nA < nB) {
            return -1
        }
        if(nA > nB) {
            return 1
        }
        return 0
    })
    return newArray
  }
  