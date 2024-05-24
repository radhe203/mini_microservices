import React, { useState } from 'react'
import "./Card.css"
import Comments from './Comments'
const Card = ({tittle,id}) => {

    const [comment,setComment] = useState("")

    const createComment= async(e)=>{
      e.preventDefault()
      if(!comment){
        return
      }
      const res = await fetch(`${import.meta.env.VITE_COMMENT_LINK}/posts/${id}/comments`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({content:comment})
      })
      if(res.ok){
        setComment("")
      }
    }

  return (
    <div className='card'>
        <p>
            {tittle}
        </p>

        <h3>Comments</h3>
        <Comments id={id}/>
        <form className="comment" onSubmit={createComment}>
            <input type="text" placeholder='add a comment' value={comment} onChange={(e)=>{
              setComment(e.target.value)
            }} />
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default Card