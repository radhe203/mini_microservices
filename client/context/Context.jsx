import React, { createContext, useContext, useEffect, useState } from 'react'



const CreateContext = createContext(undefined)

const Context = ({children}) => {

  const [post,setPost] = useState({})

  async function getPosts(){
    const res = await fetch(`${import.meta.env.VITE_QUERY_LINK}/posts`)
    const data = await res.json()

    if(res.ok){
      setPost(data)
    }
  }

  useEffect(()=>{
    getPosts()
  },[])

  return (
    <CreateContext.Provider value={{
        post,setPost
    }} >
        {children}
    </CreateContext.Provider>
  )
}

export function useAppContext(){
    const context = useContext(CreateContext)
    return context
}

export default Context

