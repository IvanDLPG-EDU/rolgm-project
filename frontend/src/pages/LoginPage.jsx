import React, { useState, useContext} from 'react';
import { UserContext } from '../contexts';

function LoginPage() {
  const {setToken} = useContext(UserContext)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleErrors = (errors) => {
    let newErrors = {
      username: null,
      password: null,
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

    fetch('http://172.18.0.2:8000/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.token) {  
          setToken(data.token);
          handleErrors(null);
        } else {
          handleErrors(data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="container mt-5" style={{ paddingTop: '20px' }}>
      <h1>Registration Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" className={`form-control ${formErrors.username && 'is-invalid'}`} name="username" value={formData.username} onChange={handleChange} />
          {formErrors.username && <div className="invalid-feedback">{formErrors.username} </div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" className={`form-control ${formErrors.password && 'is-invalid'}`} name="password" value={formData.password} onChange={handleChange} />
          {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default LoginPage;