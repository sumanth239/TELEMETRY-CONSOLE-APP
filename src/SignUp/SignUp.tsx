import React, { useState, ChangeEvent, FocusEvent, FormEvent } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SignUp.css';
import logo from '../assets/logo.png';
import indexline from "../assets/index_line.jpeg";
import astrologo from "../assets/astrogate_labs_logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
}

type FieldName = keyof FormData | null;

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FieldName>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate("/signin");
  };

  const handleFocus = (field: FieldName) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const shouldShowLegend = (fieldName: keyof FormData) =>
    formData[fieldName] !== '' || focusedField === fieldName;

  return (
    <div className='signup-main-container'>
       <div className="signup-side-container">
          {/* <img src={bg}></img> */}
        </div>
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h1>Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            {shouldShowLegend('name') && (
              <label htmlFor="name" className="floating-label">Name</label>
            )}
            <input
              className="input-field"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              placeholder={shouldShowLegend('name') ? '' : 'Name'}
              required
            />
          </div>

          <div className="form-group">
            {shouldShowLegend('email') && (
              <label htmlFor="email" className="floating-label">Email</label>
            )}
            <input
              className="input-field"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              placeholder={shouldShowLegend('email') ? '' : 'Email'}
              required
            />
          </div>

          <div className="form-group">
            {shouldShowLegend('password') && (
              <label htmlFor="password" className="floating-label">Password</label>
            )}
            <div className="password-wrapper">
              <input
                className="input-field input-with-icon"
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                placeholder={shouldShowLegend('password') ? '' : 'Password'}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="image-preview">
            <img src={indexline} alt="Sign Up Visual" />
          </div>

          <div className="form-submit">
            <button className="submit-btn" type="submit">
              Sign Up
            </button>
          </div>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?<Link to="/signin">Login</Link> 
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
