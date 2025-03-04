import React, { useEffect } from 'react'
import './Register.scss'
import { FaArrowRight } from 'react-icons/fa'
import Button from '../../../components/button/Button'
import { useState } from 'react'
import { Utils } from '../../../services/utils/utils.service.jsx'
import { authService } from '../../../services/api/auth/auth.service.js'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../../components/input/input.jsX'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading , setLoading] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [alertType, setAlertType] = useState('')
  const [hasError, setHasError] = useState(false) ;
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault(); // Move this to the top
    setLoading(true);
    try {
      const avatarColor = Utils.avatarColor();
      const avatarImage = Utils.generateAvatar(username.charAt(0).toUpperCase(), avatarColor);
      
      const result = await authService.signUp({
        username,
        email,
        password,
        avatarColor,
        avatarImage
      });
  
      console.log("Registration success:", result);
  
      setUser(result.data.user);
      setAlertType('alert-success');
      setHasError(false);
    } catch (error) {
      console.error("Registration error:", error);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(()=> {
    if(loading && !user) return;
    if(user) {
      navigate('/app/social/streams')
    }
  },[loading, user, navigate]);
  

  return (
    <div className='auth-inner'>
        
            {hasError && errorMessage && (
            <div className={`alerts ${alertType} `} role='alert'>
              {errorMessage}
              </div>
            )}
       
        <form className='auth-form' onSubmit={registerUser}>
            <div className='form-input-container'>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  labelText="Username"
                  placeholder="Enter Username"
                  style={{border: `${hasError ? '1px solid #fa9b8a': ''}`}}
                  handleChange={(event)=> setUsername(event.target.value)}
                />
                <Input
                  id="email"
                  name="email"
                  type="text"
                  value={email}
                  labelText="Email"
                  placeholder="Enter Email"
                  style={{border: `${hasError ? '1px solid #fa9b8a': ''}`}}
                  handleChange={(event)=> setEmail(event.target.value)}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  labelText="Password"
                  placeholder="Enter Password"
                  style={{border: `${hasError ? '1px solid #fa9b8a': ''}`}}
                  handleChange={(event)=> setPassword(event.target.value)}
                />
            </div>
            <Button
            label={`${loading ? 'SIGNUP IN PROGRESS...': 'SIGNUP'}`}
            className="auth-button button"
            disabled={!username || !email || !password}
            />
            <Link to="/forgot-password">
            <span className='forgot-password'>
                    Forgot Password?
                    <FaArrowRight className='arrow-right'/>
            </span>
            </Link>
        </form>
    </div>
  )
}

export default Register
