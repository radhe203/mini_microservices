const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const app = express()
const http = require('http')
app.use(cors())
app.use(bodyParser.json())


const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
})

function eventHandel(type, data) {
    if (type === "postCreated") {
        const { id, tittle } = data
        posts[id] = {
            id, tittle, comments: []
        }
    }

    if (type === "commentCreated") {
        const { content, postId, commentId, status } = data
        const post = posts[postId]
        post.comments.push({ commentId, content, status })
    }

    if (type === "commentUpdated") {
        const { content, postId, commentId, status } = data
        const comments = posts[postId].comments
        console.log(comments)

        const comment = comments.find((com) => {
            return com.commentId === commentId
        })

        comment.status = status
        comment.content = content
    }
}

async function eventCall(port,hostname='localhost') {
    const options = {
        hostname,
        port,
        method: "GET",
        path: '/events'

    }

    return new Promise((resolve, reject) => {
        let rawdata = ''

        const request = http.request(options, (response) => {
            response.on('data', (chunk) => {
                rawdata += chunk
            })
            response.on('end', () => {
                const data = JSON.parse(rawdata)
                resolve(data)
            })
        })

        request.on('error', (error) => {
            reject(error)
        })
        request.end()

    })

}
app.post('/events', (req, res) => {
    const { data, type } = req.body
    eventHandel(type, data)
    res.send({})
})


app.listen(9000, async () => {
    console.log("Server is running on 9000!!")
    

    try {
        const data = await eventCall(8000,'event-bus')
        console.log(data)
    for (let event of data) {
        console.log("processing event", event.type)
        eventHandel(event.type, event.data)
    }
    } catch (error) {
        console.log(error)
    }
})