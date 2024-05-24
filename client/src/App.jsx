import React, { useEffect, useState } from 'react'
import Card from './components/Card'
import { useAppContext } from '../context/Context'

const App = () => {
  
  
  const {post,setPost} = useAppContext()
  const [tittle,setTittle] = useState("")

  console.log(post)

  const renderedPosts = Object.values(post).map((e)=>{
    return <Card id={e.id} tittle={e.tittle} key={e.id}/>
  })

  async function submitHandel(e){
    e.preventDefault()
    const res = await fetch(`${import.meta.env.VITE_POST_LINK}/posts`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({tittle})
    })
    const data = await res.json()
    if(res.ok){
      setTittle("")
      setPost(data)
    }
  }

  return (
    <>
    <div className='container'>

      <div className='create'>
        <form className='box' onSubmit={submitHandel}>
          <h1>Create Blogs</h1>
          <input type="text" placeholder='tittle' value={tittle} onChange={(e)=>{
            setTittle(e.target.value)
          }}/>
          <button type='submit'>Submit</button>
        </form>
        
      </div>
      <div className='blogs'>
        {renderedPosts}
      </div>
    </div>
    </>
  )
}

export default App