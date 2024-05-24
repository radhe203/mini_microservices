const express = require("express")
const http = require('http')
const { hostname } = require("os")
const app = express()
app.use(express.json())

function eventCall(port,data,hostname='localhost'){
    const postData = JSON.stringify(data)

    const options = {
        hostname,
        port,
        path:'/events',
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'Content-Length':Buffer.byteLength(postData)
        },
    }

    const request = http.request(options)

    request.on('error',(error)=>{
        console.log(error)
    })

    request.write(postData)

    request.end()
}

app.post('/events',(req,res)=>{
    const {type,data} = req.body
    console.log(req.body)
    if(type === 'commentCreated'){
        const status = data.content.includes('orange') ? "rejected":"approved"
        setTimeout(()=>{
            eventCall(8000,{
                type:"commentModerated",
                data:{
                commentId:data.commentId,
                postId:data.postId,
                content:data.content,
                status
            }},
        'event-bus'
        )
            
        },5000)
       
    }
    res.send({status:'ok'})
})




app.listen(6000,()=>{
    console.log("server running on port 6000!!!")
})