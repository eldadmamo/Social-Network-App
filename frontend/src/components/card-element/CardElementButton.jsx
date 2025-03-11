import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Button from '../button/Button'

const CardElementButton = ({isChecked, btnTextOne, btnTextTwo, onClickBtnOne, onClickBtnTwo, onNavigateToProfile}) => {
  return (
    <div className='card-element-buttons' data-testid="card-element-buttons">
        <Fragment>
            {!isChecked && (
                <Button 
                   label={btnTextOne}
                   className="card-element-buttons-btn button"
                   handleClick={onClickBtnOne}

                />
            )}
            {isChecked && (
                <Button 
                   label={btnTextTwo}
                   className="card-element-buttons-btn button isUserFollowed"
                   handleClick={onClickBtnTwo}
                   
                />
            )}
        </Fragment>
        <Button label="Profile" className="card-element-buttons-btn button" handleClick={onNavigateToProfile} />
    </div>
  )
}

CardElementButton.propTypes = {
    isChecked: PropTypes.bool,
    btnTextOne: PropTypes.string,
    btnTextTwo: PropTypes.string,
    onClickBtnOne: PropTypes.func,
    onClickBtnTwo: PropTypes.func,
    onNavigateToProfile: PropTypes.func,
}

export default CardElementButton