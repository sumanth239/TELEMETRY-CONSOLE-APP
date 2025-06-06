//Default imports
import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

//Style sheet imports
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SignIn.css";

//Library imports
import indexline from "../assets/index_line.jpeg";
import astrologo from "../assets/astrogate_labs_logo.png";

//Utilities imports
import * as helperFunctions from "../Utils/HelperFunctions";
import * as types from "../Utils/types";
import * as CONSTANTS from "../Utils/Constants";

type FieldName = keyof types.FormData | null;

export default function SignIn() {
  const navigate = useNavigate(); // Using useNavigate hook from react-router-dom for navigation
  //states
  const [formData, setFormData] = useState<types.FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const [focusedField, setFocusedField] = useState<FieldName>(null); // State to track which field is focused
  const [selectedProduct, setSelectedProduct] = useState<string>(""); // State to track selected product from dropdown

  //Handler functions
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {          // to handle input changes
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {      // to handle product selection from dropdown
    setSelectedProduct(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Function to handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const logsData = {
      userName: formData.name.replace(/\b\w/g, (char) => char.toUpperCase()),       // Capitalize the first letter of each word
      singedInTime: new Date(),
      userId: 2,
      product: selectedProduct,
      Logs: [],
      loginTime: new Date().toISOString(),
      alerts: [],
    };

    localStorage.setItem("sessionStorage", JSON.stringify(logsData));                   // Store session data in localStorage
    helperFunctions.updateSessionLogs(`sucessfully loged into ${selectedProduct}`);     // Update session logs
    navigate("/dashboard");
  };

  const handleFocus = (field: FieldName) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const shouldShowLegend = (fieldName: keyof types.FormData) =>
    formData[fieldName] !== "" || focusedField === fieldName;

  return (
    <>
      <div className="signin-main-container">
        <div className="signin-side-container">
          {/* <img src={bg}></img> */}
        </div>
        <div className="signin-container">
          <div className="signin-box">
            <div className="signin-logo">
              <img src={astrologo} alt="Logo" />
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="form-group">
                {shouldShowLegend("name") && (
                  <label htmlFor="name" className="floating-label">User Name </label>
                )}
                <input
                  className="input-field"
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  placeholder={shouldShowLegend("name") ? "" : "User Name"}
                  required
                />
              </div>
              
              {/* Password Input */}
              <div className="form-group">
                {shouldShowLegend("password") && (
                  <label htmlFor="password" className="floating-label">
                    Password
                  </label>
                )}
                <div className="password-wrapper">
                  <input
                    className="input-field input-with-icon"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    placeholder={shouldShowLegend("password") ? "" : "Password"}
                    required
                  />
                  <button type="button" className="password-toggle-btn" onClick={togglePasswordVisibility} aria-label="Toggle password visibility">
                    <i className={`bi ${  showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>

                <div className="forgot-password">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>

              </div>

              <div className="image-preview">
                <img src={indexline} alt="Sign Up Visual" />
              </div>

              {/* Product Dropdown */}
              <div className="form-group">
                <select id="product-select"  className="input-field" value={selectedProduct} onChange={handleProductChange} required >
                  <option value="" disabled> Select a product </option>
                  {CONSTANTS.PRODUCTS.map((product) => (
                    <option key={product} value={product}>
                      {product}   
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="form-submit">
                <button className="submit-btn" type="submit">
                  Log In
                </button>
              </div>
            </form>

            <div className="signin-footer">
              <p>
                Don’t have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
