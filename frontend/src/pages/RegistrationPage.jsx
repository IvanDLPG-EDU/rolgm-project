import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  useEffect(() => {
    const username = formData.username;

    const formattedUsername = username
      .toLowerCase()
      .replace(/ /g, "_")
      .replace(/[^a-z0-9_.-]/g, "");

    setFormData({
      ...formData,
      username: formattedUsername,
    });
  }, [formData.username]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleErrors = (errors) => {
    let newErrors = {
      username: null,
      email: null,
      password: null,
      password2: null,
    };

    if (errors) {
      for (const [key, value] of Object.entries(errors)) {
        newErrors[key] = value[0];
      }
    }

    setFormErrors(newErrors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://172.18.0.2:8000/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.username && typeof data.username === "string") {
          handleErrors(null);
          navigate("/");
        } else {
          handleErrors(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mt-5" style={{ paddingTop: "20px" }}>
      <h1>Registration Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <span style={{ color: "gray", fontSize: "0.8em", marginLeft: "5px" }}>
            ( a-z 0-9 _ . - )
          </span>
          <input
            type="text"
            className={`form-control ${formErrors.username && "is-invalid"}`}
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {formErrors.username && (
            <div className="invalid-feedback">{formErrors.username}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className={`form-control ${formErrors.email && "is-invalid"}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <div className="invalid-feedback">{formErrors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className={`form-control ${formErrors.password && "is-invalid"}`}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {formErrors.password && (
            <div className="invalid-feedback">{formErrors.password}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password:</label>
          <input
            type="password"
            className={`form-control ${formErrors.password2 && "is-invalid"}`}
            name="password2"
            value={formData.password2}
            onChange={handleChange}
          />
          {formErrors.password2 && (
            <div className="invalid-feedback">{formErrors.password2}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
}

export default RegistrationPage;
