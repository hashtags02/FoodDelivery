import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { firebaseOTPService } from '../services/firebaseOTP';
import './PhoneNumberInput.css';

const PhoneNumberInput = ({ onSuccess, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'userDetails'
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    address: ''
  });
  const recaptchaContainerRef = useRef(null);

  const { 
    resetOTPState 
  } = useAuth();

  // Cleanup Firebase OTP service on unmount
  useEffect(() => {
    return () => {
      firebaseOTPService.clearRecaptcha();
    };
  }, []);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format phone number for Firebase (add +91 for India)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      console.log('Sending OTP to:', formattedPhone);
      
      // Send OTP via Firebase
      const otpResult = await firebaseOTPService.sendOTP(formattedPhone, 'recaptcha-container');
      if (otpResult.success) {
        // Store confirmation result globally for OTP verification
        window.confirmationResult = firebaseOTPService.confirmationResult;
        // For testing, always go to user details first
        setStep('userDetails');
      } else {
        setError(otpResult.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Phone submit error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify OTP via Firebase
      const firebaseResult = await firebaseOTPService.verifyOTP(otp);
      if (firebaseResult.success) {
        // Create a mock user object for testing
        const mockUser = {
          id: 'user_' + Date.now(),
          phone: phoneNumber,
          name: userDetails.name || 'User',
          email: userDetails.email || '',
          role: 'user', // Default role
          isPhoneVerified: true
        };

        // Store user in localStorage for testing
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('jwt_token', 'mock_token_' + Date.now());

        resetOTPState();
        firebaseOTPService.clearRecaptcha();
        onSuccess(mockUser);
      } else {
        setError(firebaseResult.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailsSubmit = (e) => {
    e.preventDefault();
    if (!userDetails.name || !userDetails.email) {
      setError('Please fill in all required fields');
      return;
    }
    setStep('otp');
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
    } else if (step === 'userDetails') {
      setStep('phone');
    }
    setError('');
    resetOTPState();
    firebaseOTPService.clearRecaptcha();
  };

  const resendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await firebaseOTPService.sendOTP(formattedPhone, 'recaptcha-container');
      
      if (!result.success) {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <div className="phone-input-container">
        <h2>Welcome to CraveCart</h2>
        <p>Enter your phone number to continue</p>
        
        <form onSubmit={handlePhoneSubmit} className="phone-form">
          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="phone-input"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      </div>
    );
  }

  if (step === 'userDetails') {
    return (
      <div className="user-details-container">
        <h2>Complete Your Profile</h2>
        <p>Please provide your details to continue</p>
        
        <form onSubmit={handleUserDetailsSubmit} className="user-details-form">
          <div className="input-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              value={userDetails.name}
              onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
              placeholder="Enter your full name"
              className="input-field"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={userDetails.email}
              onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
              placeholder="Enter your email address"
              className="input-field"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="address">Address (Optional)</label>
            <textarea
              id="address"
              value={userDetails.address}
              onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
              placeholder="Enter your address"
              className="input-field"
              rows="3"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button 
              type="button" 
              className="back-btn"
              onClick={handleBack}
            >
              ← Back
            </button>
            <button 
              type="submit" 
              className="submit-btn"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="otp-container">
        <h2>Enter OTP</h2>
        <p>We've sent a 6-digit code to {phoneNumber}</p>
        
        <form onSubmit={handleOTPSubmit} className="otp-form">
          <div className="input-group">
            <label htmlFor="otp">OTP Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="otp-input"
              maxLength="6"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="button-group">
            <button 
              type="button" 
              className="back-btn"
              onClick={handleBack}
            >
              ← Back
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
        
        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button 
            type="button" 
            className="resend-btn"
            onClick={resendOTP}
            disabled={loading}
          >
            Resend OTP
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PhoneNumberInput;
