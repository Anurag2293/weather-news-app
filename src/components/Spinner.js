import React from 'react';

const loadingSrc = process.env.PUBLIC_URL

const Spinner = () => {
    return (
        <div>
            <img className='my-3' src={loadingSrc} alt="Loading" />
        </div>
    )
}

export default Spinner