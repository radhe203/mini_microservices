const express = require("express")
const { randomBytes } = require("crypto")
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const { hostname } = require("os")
const app = express()
app.use(bodyParser.json())
app.use(cors())

function eventCall(port, data, hostname = 'localhost') {
    const postData = JSON.stringify(data)

    const options = {
        hostname,
        port,
        path: '/events',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }

    const request = http.request(options)

    request.on('error', error => {
        console.log("error", error)
    })

    request.write(postData)



    request.end()
}

const commentById = {}
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentById[req.params.id] || [])
})

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body
    const comments = commentById[req.params.id] || []

    if (!content) {
        return res.status(401).send("content is required")
    }

    comments.push({ commentId, content, status: 'pending' })

    commentById[req.params.id] = comments

    //event broker
    eventCall(8000, {
        type: "commentCreated",
        data: {
            commentId, content, postId: req.params.id, status: 'pending'
        },

    }, 'event-bus')
    //end of event broker
    res.status(201).send(comments)

})

app.post('/events', (req, res) => {
    console.log("event recived", req.body)

    const { type, data } = req.body

    if (type === 'commentModerated') {
        const { postId, commentId, status, content } = data
        const comments = commentById[postId]
        const comment = comments.find((com) => {
            return com.commentId === commentId
        })
        comment.status = status
        eventCall(8000, {
            type: 'commentUpdated',
            data: {
                commentId, content, postId, status
            },
        
        },'event-bus')
    }


    res.send({})
})


app.listen(7000, () => {
    console.log("running on 7000 !!")
})