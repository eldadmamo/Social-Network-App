import React from 'react'
import './Login.scss'
import { FaArrowRight } from 'react-icons/fa'
import Button from '../../../components/button/Button'
import { Link } from 'react-router-dom'
import { Utils } from '../../../services/utils/utils.service.jsx'
import { authService } from '../../../services/api/auth/auth.service.js'
import Input from '../../../components/input/input.jsX'
import { useState, useEffect } from 'react'


const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [alertType, setAlertType] = useState('');
  const [user, setUser] = useState();

  const loginUser = async (event) =>{
    event.preventDefault();
    setLoading(false);

    try{
      const result = await authService.signIn({
        username,
        password 
      })
      setKeepLoggedIn(keepLoggedIn);
      setUser(result.data.user);
      setHasError(false)
      setAlertType('alert-success')
    }catch(error){
      setLoading(false);
      setHasError(true);
      setAlertType('alert-error')
      setErrorMessage(error?.response?.data.message)
    }
  }

  useEffect(()=> {
      if(loading && !user) return;
      if(user) {
        console.log('navigate to streams page  login page')
        setLoading(false);
      }
    },[loading, user]);

  return (
    <div className='auth-inner'>
        {hasError && errorMessage && (
            <div className={`alerts ${alertType} `} role='alert'>
              {errorMessage}
              </div>
        )}
        <form className='auth-form' onSubmit={loginUser}>
            <div className='form-input-container'>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  labelText="Username"
                  placeholder="Enter Username"
                  style={{border: `${hasError ? '1px solid #fa9b8a': ''}`}}
                  handleChange={(e)=> setUsername(e.target.value)}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  labelText="Password"
                  placeholder="Enter Password"
                  style={{border: `${hasError ? '1px solid #fa9b8a': ''}`}}
                  handleChange={(e)=> setPassword(e.target.value)}
                />
                <label className="checkmark-container" htmlFor="checkbox">
                    <Input
                  id="checkbox"
                  name="checkbox"
                  type="checkbox"
                  value={keepLoggedIn}
                  handleChange={() => setKeepLoggedIn(!keepLoggedIn)}
                />
                    Keep me signed in
                </label>
            </div>
            <Button
                label={`${loading ? 'SIGNUP IN PROGRESS...': 'SIGNIN'}`}
                className="auth-button button"
                disabled={!username || !password}
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
