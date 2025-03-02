import React from 'react'
import './Login.scss'
import { FaArrowRight } from 'react-icons/fa'
import Input from '../../../components/input/input.jsX'
import Button from '../../../components/button/Button'
import { Link } from 'react-router-dom'

const Login = () => {
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
                  id="password"
                  name="password"
                  type="password"
                  value="my password"
                  labelText="Password"
                  placeholder="Enter Password"
                  handleClick={()=> {}}
                />
                <label className="checkmark-container" htmlFor="checkbox">
                    <Input
                  id="checkout"
                  name="checkout"
                  type="checkout"
                  value={false}
                  handleChange={() => {}}
                />
                    Keep me signed in
                </label>
            </div>
            <Button
            label={'SIGNIN'}
            className="auth-button button"
            disabled={true}
            />

            <Link to={"/forgot-password"}>
            <span className='forgot-password'>
                    Forgot Password?
                    <FaArrowRight className='arrow-right'/>
            </span>
            </Link>
            
        </form>
    </div>
  )
}

export default Login
