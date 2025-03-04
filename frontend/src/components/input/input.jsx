import React from 'react'
import PropTypes from 'prop-types'
import '../input/input.scss'

const Input = ({id, name, type, value, className, labelText, placeholder, handleChange, style}) => {
  return (
    <>
      <div className='form-row'>
        {labelText && (
            <label htmlFor={name} className='form-label'>{labelText}</label>
        )}

        <input 
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`form-input ${className}`}
          style={style}
          autoComplete='false'
        /> 
      </div>
    </>
  )
}

Input.propTypes = {
    name: PropTypes.string.isRequired,
    labelText: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.any,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    handleChange: PropTypes.func,
    style: PropTypes.object 
}

export default Input
