import { FaArrowLeft } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import backgroundImage from '../../../assets/images/background.jpg';
import './ResetPassword.scss'
import Button from '../../../components/button/Button';
import Input from '../../../components/input/input.jsX';
import { authService } from '../../../services/api/auth/auth.service';
import { useState } from 'react';

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [responseMessage, setResponseMessage] = useState('')
  const [searchParams] = useSearchParams();
 
  const resetPassword = async (event) => {
    event.preventDefault(); // Prevents default form submission
    setLoading(true);
    
    try {
      console.log('Attempting password reset...');
 
      const body = { password, confirmPassword };
      const response = await authService.resetPassword(searchParams.get('token'), body);
      
      console.log('Response:', response);
      setPassword('');
      setConfirmPassword('');
      setShowAlert(true);
      setAlertType('alert-success');
      setResponseMessage(response?.data?.message);
    } catch (error) {
      console.error('Error:', error);
      setAlertType('alert-error');
      setShowAlert(true);
      setResponseMessage(error?.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
 };
 

  return (
    <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="environment">DEV</div>
      <div className="container-wrapper-auth">
        <div className="tabs reset-password-tabs" style={{height: `${responseMessage ? '400px': ''}`}}>
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login reset-password">Reset Password</div>
              </li>
            </ul>
            <div className="tab-item">
              <div className="auth-inner">
              {responseMessage && (
              <div className={`alerts ${alertType} `} role='alert'>
              {responseMessage}
              </div>
               )}
                <form className="reset-password-form" onSubmit={resetPassword}>
                  <div className="form-input-container">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      labelText="New Password"
                      placeholder="New Password"
                      style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                      handleChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                      id="cpassword"
                      name="cpassword"
                      type="password"
                      value={confirmPassword}
                      labelText="Confirm Password"
                      placeholder="Confirm Password"
                      style={{ border: `${showAlert ? '1px solid #fa9b8a' : ''}` }}
                      handleChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                      label={`${loading ? 'RESET PASSWORD IN PROGRESS...' : 'RESET PASSWORD'}`}
                      className="auth-button button"
                      disabled={!password || !confirmPassword}
                  />

                  <Link to={'/'}>
                    <span className="login">
                      <FaArrowLeft className="arrow-left" /> Back to Login
                    </span>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
