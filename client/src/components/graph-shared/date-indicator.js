import React from 'react'
import moment from 'moment'

function DateIndicator({startDate, endDate}) {
    console.log('test')
    if(startDate && endDate) {
        return (
            <div>
                Data pulled between {moment(startDate).format('MM/DD/YYYY')} and {moment(endDate).format('MM/DD/YYYY')}.
            </div>
        )
    } else {
        return null
    }
}

export default DateIndicator