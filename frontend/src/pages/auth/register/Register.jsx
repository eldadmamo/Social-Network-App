import React from 'react'
import './Register.scss'
import { FaArrowRight } from 'react-icons/fa'
import Input from '../../../components/input/input.jsX'
import Button from '../../../components/button/Button'

const Register = () => {
  return (
    <div className='auth-inner'>
        <div className='alerts alert-error' role='alert'>
            Error Message
        </div>
        <form className='auth-form'>
            <div className='form-input-container'>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value="my value"
                  labelText="Username"
                  placeholder="Enter Username"
                  handleClick={()=> {}}
                />
                <Input
                  id="email"
                  name="email"
                  type="text"
                  value="eldadf456@gmail.com"
                  labelText="Email"
                  placeholder="Enter Email"
                  handleClick={()=> {}}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value="my password"
                  labelText="Password"
                  placeholder="Enter Password"
                  handleClick={()=> {}}
                />
            </div>
            <Button
            label={'SIGNUP'}
            className="auth-button button"
            disabled={true}
            />
            <span className='forgot-password'>
                    Forgot Password?
                    <FaArrowRight className='arrow-right'/>
            </span>
        </form>
    </div>
  )
}

export default Register
