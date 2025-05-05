//default imports
import  { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

//style sheet imports
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SignIn.css";

//library imports
import indexline from "../assets/index_line.jpeg";
import astrologo from "../assets/astrogate_labs_logo.png";

//utilities imports
import * as helperFunctions from "../Utils/HelperFunctions";
import * as types from "../Utils/types";



type FieldName = keyof types.FormData | null;

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<types.FormData>({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FieldName>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const logsData = {
      userName :formData.name,
      singedInTime:new Date(),
      userId : 2,
      product:selectedProduct,
      Logs : []
    }

    localStorage.setItem("sessionStorage",JSON.stringify(logsData));
    helperFunctions.updateSessionLogs(`${formData.name} sucessfully loged into ${selectedProduct}`)
    navigate("/dashboard");
    console.log(
      "Form submitted:",
      formData,
      "Selected Product:",
      selectedProduct
    );
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
              <div className="form-group">
                {shouldShowLegend("name") && (
                  <label htmlFor="name" className="floating-label">
                    User Name
                  </label>
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
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                  >
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                    ></i>
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
                <select
                  id="product-select"
                  className="input-field"
                  value={selectedProduct}
                  onChange={handleProductChange}
                  required
                >
                  <option value="" disabled>
                    Select a product
                  </option>
                  <option value="AstroLink 10G ODT">AstroLink 10G ODT</option>
                  <option value="AstroLink Nano">AstroLink Nano</option>
                  <option value="AstroBeam">AstroBeam</option>
                  <option value="P2PLink-10G">P2PLink-10G</option>
                </select>
              </div>

              <div className="form-submit">
                <button className="submit-btn" type="submit">
                  {/* <Link to="/dashboard" >Log In</Link> */}
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
