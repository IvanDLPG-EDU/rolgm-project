import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { toast } from 'react-toastify';

const backend_url = import.meta.env.VITE_API_URL;

const ConfirmEmail = () => {
  const [message, setMessage] = useState({ message: '', type: '' });
  const { token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const verifyEmail = async () => {
      const url = `${backend_url}/auth/email-verify/?token=${token}`;
      console.log(url);
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });
        const data = await response.json();


        if (response.ok) {
          setMessage({message: data.message, type: 'success'})
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
  
        setMessage({message: error.message, type: 'error'})
      } 

    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (message.type !== '') {
      if (message.type == 'success') {
        toast.success(message.message);
      } else {
        toast.error(message.message);
      }
      navigate('/');
    }
  }, [message, navigate]);

  return (
    <Container className="d-flex align-items-center justify-content-center mt-5">
      <Row>
        <Col>
          <Card className="p-4">
            <Card.Body>
              {message ? (
                <p>{message.message}</p>
              ) : (
                <>
                  <p>Verifying email...</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ConfirmEmail;
