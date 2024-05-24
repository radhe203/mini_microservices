const express = require("express")
const { randomBytes } = require("crypto")
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const app = express()
app.use(bodyParser.json())
app.use(cors())


const posts = {}
app.get('/posts', (req, res) => {
    res.status(200).send(posts)
})

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex')

    const { tittle } = req.body

    if (tittle === undefined || tittle === "" || tittle === null) {
        return res.status(400).json("tittle is important")
    }

    posts[id] = {
        id, tittle
    }

    // await fetch('http://localhost:8000/events',{
    //     method:"POST",
    //     body:
    // })
    //requesting 
    const postData = JSON.stringify({
        type: "postCreated",
        data: {
            id, tittle
        }
    })

    const options = {
        hostname: 'event-bus',
        port: 8000,
        path: '/events',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }

    const request = http.request(options/*,(resp)=>{
        let data = ''
        resp.on('data',chunk=>{
            data+=chunk
        })
        resp.on('end',()=>{
            console.log(data)
            console.log(resp.statusCode)
        })
    }*/)

    request.on('error', error => {
        console.log("error", error)
    })

    request.write(postData)



    request.end()
    // console.log(request.statusCode)
    //end request
    res.status(201).send(posts)
})
app.post('/events', (req, res) => {
    console.log("event recived", req.body)
    res.send({})
})
app.listen(4000, () => {
    console.log("running on 4000 !!")
})