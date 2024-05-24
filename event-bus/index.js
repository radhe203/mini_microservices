const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const { type, hostname } = require('os')

const app = express()
app.use(bodyParser.json())
async function eventCall(port, event,hostname='localhost') {
    const postData = JSON.stringify(event)

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
    try {
        const request = http.request(options)
        request.on('error', (error) => {
            console.log(error)
        })
        request.write(postData)
        request.end()
    } catch (error) {
        console.log(error)
    }
}

const allEvent = []
app.post('/events', async (req, res) => {
    const event = req.body
    allEvent.push(event)
    await eventCall(9000, event,'query')
    if (event.type === "commentCreated") {
        await eventCall(6000, event,'moderation')
    }

    if (event.type === 'commentModerated') {
        await eventCall(7000, event,'comments')
    }

    if (event.type === 'commentUpdated') {
        await eventCall(9000, event,'query')
    }
    console.log(event)
    res.send({ status: 'ok' })
})


app.get('/events', (re, res) => {
    res.send(allEvent)
})
app.listen(8000, () => {
    console.log("event bus runing on 8000!!!")
})










