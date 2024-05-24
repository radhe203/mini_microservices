import { useEffect, useState } from "react"
import { useAppContext } from "../../context/Context"

const Comments = ({id}) => {

    const [commentList,setCommentList] = useState([])

    const {post} = useAppContext()

    useEffect(()=>{
       setCommentList(post[id].comments || [])
    },[])

    const renderedComments = commentList.map(e=>{
      let content = ''

      if(e.status==="approved"){
        content=e.content
      }
      if(e.status==='rejected'){
        content="Inappropriate comment"
      }
      if(e.status==='pending'){
        content="Waiting for Moderation"
      }

        return <li key={e.commentId}>{content}</li>
    })
  return (
    <ul className="comment">
        {renderedComments}
    </ul>
  )
}

export default Comments