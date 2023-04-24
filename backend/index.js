const cors = require('cors')
const express = require('express')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

const app = express()
const con = mysql.createConnection({
    host: 'localhost',
    user: '', //Fill with your SQL user
    password: '', //Fill with your SQL password
    database: 'tikpic'
})

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json('Hello user! This is the backend service.')
})

app.get('/posts', (req, res) => {
    const q = 'SELECT * FROM posts'

    con.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body

    //Authenticate User with MySQL and respond with a JWT
    const q = 'SELECT * FROM users WHERE display_name = ?'
    con.query(q, username, (err, results) => {
        if (err) res.json(err)
        else if (results.length === 0 || results[0].password !== password) {
            res.status(401).send('Invalid email or password')
        } else {
            const user = { uid: results[0].uid, username: results[0].display_name, photo_url: results[0].photo_url }

            const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET)
            const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET)

            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        }
    })
})

const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        req.user = user
        next()
    })
}

app.post('/posts', validateToken, (req, res) => {
    const post = {
        description: req.body.description,
        posted_by: req.user.uid,
        image_url: req.body.image_url
    }
    const q = 'INSERT INTO posts SET ?'
    con.query(q, post, (err) => {
        if (err) return res.json(err)
        res.json('The post was created successfully!')
    })
})

app.delete('/posts/:id', validateToken, (req, res) => {
    const postId = req.params.id
    const uid = req.user.uid
    const q = 'DELETE FROM posts WHERE id = ? AND posted_by = ?'

    con.query(q, [postId, uid], (err, data) => {
        if (err) return res.json(err)
        if (data.affectedRows == 0) return res.json(`Cannot delete post ${postId}`)
        res.json(`Post ${postId} deleted successfully!`)
    })
})

app.post('/users', (req, res) => {
    const user = {
        display_name: req.body.display_name,
        password: req.body.password,
        photo_url: req.body.photo_url,
        email: req.body.email
    }
    const q = 'INSERT INTO users SET ?'
    if (user.display_name !== '' && user.password !== '' && user.email !== '') {
        con.query(q, user, (err, data) => {
            if (err) return res.json(err)
            res.json('User created successfully!')
        })
    } else {
        res.sendStatus(403)
    }

})

app.get('/users/:id', validateToken, (req, res) => {
    const userId = req.params.id
    const q = 'SELECT * FROM users WHERE uid = ?'

    con.query(q, userId, (err, data) => {
        if (err) return res.json(err)
        if (data[0]) {
            data = data[0]
            const { email, password, ...publicUserData } = data
            return res.json(publicUserData)
        } else {
            return res.json(`Cannot find user ${userId}`)
        }
    })
})

app.get('/me', validateToken, (req, res) => {
    const q = 'SELECT * FROM users WHERE uid = ?'

    con.query(q, req.user.uid, (err, data) => {
        if (err) return res.json(err)
        data = data[0]
        const { password, ...currentUser } = data
        return res.json(currentUser)
    })
})

app.get('/me/posts', validateToken, (req, res) => {
    const q = 'SELECT * FROM posts WHERE posted_by = ?'

    con.query(q, req.user.uid, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.post('/posts/:id/likes', validateToken, (req, res) => {
    const qInsert = 'INSERT INTO likes SET ?'
    const qDelete = 'DELETE FROM likes WHERE likes.post_id = ? AND likes.uid = ?'
    const qCheckLiked = 'SELECT * FROM likes WHERE likes.post_id = ? AND likes.uid = ?'
    const qData = {
        post_id: req.params.id,
        uid: req.user.uid
    }

    con.query(qCheckLiked, [qData.post_id, qData.uid], (err, response) => {
        if (err) res.json(err)
        else if (response.length === 0) {
            //User didn't liked the post yet
            con.query(qInsert, qData, (err, response) => {
                if (err) return res.json(err)
                return res.json(response)
            })
        } else {
            //User already liked the post
            con.query(qDelete, [qData.post_id, qData.uid], (err, response) => {
                if (err) return res.json(err)
                return res.json(response)
            })
        }
    })
})

app.get('/posts/:id/likes', validateToken, (req, res) => {
    const q = 'SELECT * FROM likes WHERE post_id = ?'

    con.query(q, req.params.id, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.listen(8800, () => {
    console.log('Backend is Online!')
})