import React from 'react'
import { useNavigate } from 'react-router-dom'

import './Error.scss'
import Button from '../../components/button/Button';

const Error = () => {
    const navigate = useNavigate();

  return (
    <div className='error-container'>
        <div className='oops'>Oops</div>
        <p className='not-found'>Error 404: Page Not Found</p>
        <Button label="Back Home" className="back-button button" handleClick={()=> navigate(-1)}/>
    </div>
  )
}

export default Error
