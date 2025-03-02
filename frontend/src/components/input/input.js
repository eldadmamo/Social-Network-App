import React from 'react'
import PropTypes from 'prop-types'

const input = ({name, type, value, className, labelText, placeholder, handleChange}) => {
  return (
    <>
      <div className='form-row'>
        {labelText && (
            <label htmlFor={name} className='form-label'>{labelText}</label>
        )}

        <input 
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`form-input ${className}`}
          autoComplete='false'
        /> 
      </div>
    </>
  )
}

input.propTypes = {
    name: PropTypes.string.isRequired,
    labelText: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    handleChange: PropTypes.string
}

export default input
