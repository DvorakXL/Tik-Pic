import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from '../axiosConfig'
import { Container, Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap'
import { storage } from '../firebaseConfig'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState(false)

  const usernameRef = useRef()
  const passwordRef = useRef()
  const emailRef = useRef()
  const fileRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const file = fileRef.current.files[0]
    if (!file) return
    const storageRef = ref(storage, `images/avatars/${file.name}`)
    //Upload image to Firebase Storage
    uploadBytes(storageRef, file).then(() => {
      getDownloadURL(storageRef).then((imgUrl) => {
        const userData = {
          photo_url: imgUrl,
          display_name: usernameRef.current.value,
          password: passwordRef.current.value,
          email: emailRef.current.value
        }

        apiBaseUrl.post('/users', userData)
          .then((data) => {
            if (data.data.code) {
              setError(true)
              console.log('Error creating user')
            } else {
              navigate('/login')
            }
          })
          .catch((err) => {
            setError(true)
            console.log(err)
          })
      })
    })
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Card className="my-5 mx-auto" style={{ borderRadius: '1rem', maxWidth: '400px' }}>
              <Card.Body className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                <p className="text-black-50 mb-5">Enter your credentials to create an account</p>
                <Form.Group className="mb-2">
                  <Form.Label>
                    Choose your avatar:
                  </Form.Label>

                  <Form.Control
                    type="file"
                    required
                    accept='image/*'
                    ref={fileRef}
                  />
                </Form.Group>
                <InputGroup className="mb-2">
                  <Form.Control
                    placeholder="Username"
                    ref={usernameRef}
                  />
                </InputGroup>
                <InputGroup className="mb-2">
                  <Form.Control
                    placeholder="Email"
                    ref={emailRef}
                  />
                </InputGroup>
                <InputGroup className="mb-4">
                  <Form.Control
                    placeholder="Password"
                    type='password'
                    ref={passwordRef}
                  />
                </InputGroup>
                {error && <p className='text-danger'> Username or email already in use!</p>}
                <Button className='mb-4 px-5' variant='outline-success' size='lg' type='submit'>
                  Sign Up
                </Button>
                <p className="mb-0">I have an account. <a href="/login" className="text-success fw-bold text-decoration-none">Sign In</a></p>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container >
  )
}

export default Register