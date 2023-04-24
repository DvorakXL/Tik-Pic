import React, { useEffect, useState, useContext } from 'react'
import { Card, Col, Row, Container, Button, Badge } from 'react-bootstrap'
import { formatSinceDate } from '../utils/date-formatter'
import { apiBaseUrl } from '../axiosConfig'
import { UserContext } from '../context/UserContext'

function Posts() {
  const { currentUser } = useContext(UserContext)

  const [postsData, setPostsData] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    const fetchAllUsers = async (postsList) => {
      const cachedUIds = []
      return await Promise.all(postsList.filter((post) => {
        if (!cachedUIds.includes(post.posted_by)) {
          cachedUIds.push(post.posted_by)
          return true
        }

        return false
      }).map(async post => {
        try {
          const userReq = await apiBaseUrl.get(`/users/${post.posted_by}`)
          return userReq.data
        } catch (err) {
          throw err
        }
      }))
    }

    const fetchAllLikes = async (postsList) => {
      return await Promise.all(postsList.map(async post => {
        try {
          const likeReq = await apiBaseUrl.get(`/posts/${post.id}/likes`)
          const liked = likeReq.data.filter(postLike => postLike.uid === currentUser?.uid).length !== 0
          return { post_id: post.id, likes: likeReq.data.length, liked: liked }
        } catch (err) {
          throw err
        }
      }))
    }

    const fetchPostData = async () => {
      try {
        const postsReq = await apiBaseUrl.get('/posts', { signal: controller.signal })
        const users = await fetchAllUsers(postsReq.data)
        const likes = await fetchAllLikes(postsReq.data)

        setPostsData(postsReq.data.map((post) => {
          const postLike = likes.filter((like) => like.post_id === post.id)[0]
          const postAuthor = users.filter((user) => user.uid === post.posted_by)[0]

          return {
            id: post.id,
            description: post.description,
            image_url: post.image_url,
            timestamp: post.timestamp,
            likes: postLike.likes,
            liked: postLike.liked,
            author: {
              uid: postAuthor.uid,
              display_name: postAuthor.display_name,
              photo_url: postAuthor.photo_url,
              creation_date: postAuthor.creation_date
            }
          }
        }))
      } catch (err) {
        console.log(err)
      }
    }

    fetchPostData()

    return () => {
      controller.abort()
    }
  }, [currentUser])

  const handleDelete = async (id) => {
    try {
      await apiBaseUrl.delete(`/posts/${id}`)
      setPostsData(prev => prev.filter(post => post.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const handleLike = async (id) => {
    try {
      await apiBaseUrl.post(`/posts/${id}/likes`)
      setPostsData(prev => prev.map(post => {
        if (post.id === id) {
          if (post.liked) {
            //remove like
            return { ...post, liked: false, likes: post.likes - 1 }
          } else {
            //like
            return { ...post, liked: true, likes: post.likes + 1 }
          }
        } else {
          return post
        }
      }))
    } catch (err) {
      console.log(err)
    }
  }

  const currentDateM = Date.now()
  return (
    <Container fluid>
      <Row>
        <Col style={{ maxWidth: "600px" }} className='mx-auto'>
          {postsData.slice().reverse().map(post => {
            const postDateM = new Date(post.timestamp).getTime() //milliseconds
            const dateDurationS = (currentDateM - postDateM) / 1000 //seconds

            return (
              <Container key={post.id}>
                <Card border="light" className='shadow mt-4'>
                  <Card.Header>
                    {
                      post.author?.photo_url &&
                      <>
                        <img src={post.author?.photo_url} alt="Avatar" width="48" height="48" style={{ "borderRadius": "20%", objectFit: "cover" }} />
                        {' '}
                      </>
                    }
                    {post.author?.display_name}
                  </Card.Header>
                  <Card.Img src={post.image_url} style={{ aspectRatio: "1/1", objectFit: "cover" }} />
                  <Card.Body>
                    <Card.Text>{post.description}</Card.Text>
                    {
                      (currentUser?.uid === post.author.uid) &&
                      <>
                        <Button variant="outline-danger" onClick={() => handleDelete(post.id)} > Delete </Button>
                        {' '}
                      </>
                    }
                    {
                      post.liked ?
                        <Button variant="success" onClick={() => handleLike(post.id)}>
                          Like <Badge bg="success">{post.likes}</Badge>
                        </Button> :
                        <Button variant="outline-success" onClick={() => handleLike(post.id)}>
                          Like <Badge bg="success">{post.likes}</Badge>
                        </Button>
                    }
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">{formatSinceDate(dateDurationS)}</small>
                  </Card.Footer>
                </Card>
                <br />
              </Container>
            )
          })}
        </Col>
      </Row>
    </Container>
  )
}

export default Posts