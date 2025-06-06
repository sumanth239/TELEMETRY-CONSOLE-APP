//Default imports
import { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//Style sheet imports
import './SignUp.css';
import 'bootstrap-icons/font/bootstrap-icons.css'


//Utilities imports
import logo from '../assets/logo.png';
import indexline from "../assets/index_line.jpeg";
import * as types from "../Utils/types";


type FieldName = keyof types.FormData | null;

export default function SignUp() {
  const navigate = useNavigate();           //to change the route after form submission
  const [formData, setFormData] = useState<types.FormData>({
    name: '',
    email: '',
    password: '',
  });

  //states
  const [showPassword, setShowPassword] = useState<boolean>(false);           //to toggle password visibility
  const [focusedField, setFocusedField] = useState<FieldName>(null);          //to track which field is focused


  //Handler functions
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {            // to handle input changes
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {                    // to toggle password visibility
    setShowPassword(prev => !prev);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {       // to handle form submission  
    e.preventDefault();
    navigate("/signin");
  };

  const handleFocus = (field: FieldName) => {     // to handle focus event 
    setFocusedField(field);
  };

  const handleBlur = () => {          // to handle blur event 
    setFocusedField(null);
  };

  const shouldShowLegend = (fieldName: keyof types.FormData) =>
    formData[fieldName] !== '' || focusedField === fieldName;

  return (
    <div className='signup-main-container'>
      <div className="signup-side-container"></div>
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
              Already have an account?&nbsp; <Link to="/signin">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
