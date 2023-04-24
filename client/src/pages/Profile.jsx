import React, { useState, useEffect } from 'react'
import { apiBaseUrl } from '../axiosConfig'
import { Container, Row, Col, Card } from 'react-bootstrap'

const Profile = () => {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    const controller = new AbortController()
    const fetchUserData = async () => {
      try {
        const userReq = await apiBaseUrl.get('/me', { signal: controller.signal })
        setUserInfo(userReq.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchUserData()

    return () => {
      controller.abort()
    }
  }, [])

  const creationDate = new Date(userInfo?.creation_date)
  return (
    <Container fluid>
      <Row>
        <Col>
          <Card className="my-5 mx-auto" style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <Card.Body>
              <Card.Img
                src={userInfo?.photo_url}
                alt='avatar'
                className='rounded-circle mb-3 d-block mx-auto'
                style={{ aspectRatio: "1/1", maxWidth: "40%", objectFit: "cover" }}
              />
              <Row>
                <Col sm={5}>
                  <Card.Text>Display Name</Card.Text>
                </Col>
                <Col sm={7}>
                  <Card.Text className='text-muted'>{userInfo?.display_name}</Card.Text>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm={5}>
                  <Card.Text>Email</Card.Text>
                </Col>
                <Col sm={7}>
                  <Card.Text className='text-muted'>{userInfo?.email}</Card.Text>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm={5}>
                  <Card.Text>Creation Date</Card.Text>
                </Col>
                <Col sm={7}>
                  <Card.Text className='text-muted'>{creationDate.toLocaleDateString()}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile