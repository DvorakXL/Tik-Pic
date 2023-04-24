import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '../firebaseConfig'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { apiBaseUrl } from '../axiosConfig'
import { Container, Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap'

function CreatePost() {
  const descRef = useRef()
  const fileRef = useRef()

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const file = fileRef.current.files[0]
    if (!file) return
    const storageRef = ref(storage, `images/${file.name}`)

    //Upload image to Firebase Storage
    uploadBytes(storageRef, file).then(() => {
      getDownloadURL(storageRef).then((imgUrl) => {
        let post = {
          description: descRef.current.value,
          image_url: imgUrl
        }

        apiBaseUrl.post('/posts', post).then(() => {
          navigate('/')
        }).catch((err) => {
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
            <Card className="my-5 mx-auto" style={{ borderRadius: '1rem', maxWidth: '600px' }}>
              <Card.Body className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2 text-uppercase">Upload</h2>
                <InputGroup className="mb-2">
                  <Form.Control
                    type="file"
                    required
                    accept='image/*'
                    ref={fileRef}
                  />
                </InputGroup>
                <Form.Group className="mb-3 w-100">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={5} ref={descRef} />
                </Form.Group>
                <Button className='px-5' variant='outline-success' size='lg' type='submit'>
                  Post
                </Button>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container >
  )
}

export default CreatePost