import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from '../axiosConfig'
import { Container, Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap'

const Login = () => {
  const navigate = useNavigate()

  const [error, setError] = useState(false)

  const usernameRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const credentials = {
      username: usernameRef.current.value,
      password: passwordRef.current.value
    }
    apiBaseUrl.post('/login', credentials)
      .then((data) => {
        localStorage.setItem('tokens', JSON.stringify(data.data))
        navigate('/')
        window.location.reload()
      })
      .catch((err) => {
        setError(true)
        console.log(err)
      })
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Card className="my-5 mx-auto" style={{ borderRadius: '1rem', maxWidth: '400px' }}>
              <Card.Body className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                <p className="text-black-50 mb-5">Please enter your username and password</p>
                <InputGroup className="mb-2">
                  <Form.Control
                    placeholder="Username"
                    ref={usernameRef}
                  />
                </InputGroup>
                <InputGroup className="mb-4">
                  <Form.Control
                    placeholder="Password"
                    type='password'
                    ref={passwordRef}
                  />
                </InputGroup>
                {error && <p className='text-danger'> Username or password are incorrent!</p>}
                <Button className='mb-4 px-5' variant='outline-success' size='lg' type='submit'>
                  Login
                </Button>
                <p className="mb-0">Don't have an account? <a href="/register" className="text-success fw-bold text-decoration-none">Sign Up</a></p>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container >
  )
}

export default Login