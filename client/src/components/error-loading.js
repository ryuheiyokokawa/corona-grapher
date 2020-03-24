import React from 'react'

function ErrorLoading({loading,error,show}) {
    if(error) {
        return (
            <div>
                {error}
            </div>
        )
    } else if(loading) {
        return (
            <div>
                Loading...
            </div>
        )
    } else {
        return show()
    }
}

export default ErrorLoading