import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

import { COUNTRIES } from "../../../queries";

function CountrySelect({ current, onSelect }) {
  let query = useQuery(COUNTRIES);
  let [country, setCountry] = useState([]);

  useEffect(() => {
    if (current && typeof current.country != "undefined") {
      let emptyArray = [];
      emptyArray.push(current.country);
      setCountry(emptyArray);
    }
  }, [current]);

  if (query.data) {
    let countries = Object.values(query.data.countries);
    let sorted_countries = alphaSort(countries, "name");
    return (
      <Typeahead
        id="country"
        options={sorted_countries}
        labelKey="name"
        placeholder="Choose a country"
        selected={country}
        selectHintOnEnter={true}
        onChange={(selection) => {
          console.log(selection);
          onSelect(selection);
          setCountry(selection);
        }}
      />
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default CountrySelect;

const alphaSort = (array, key) => {
  //Slice below is just to make a new array
  const newArray = array.slice().sort((a, b) => {
    let nA = a[key].toLowerCase();
    let nB = b[key].toLowerCase();
    if (nA < nB) {
      return -1;
    }
    if (nA > nB) {
      return 1;
    }
    return 0;
  });
  return newArray;
};
