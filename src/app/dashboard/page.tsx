'use client'

import { getUserData } from '@/services/data'
import {useEffect} from 'react'

const DashboardPage = () => {

  useEffect(()=>{
    const fetchUserData = async () =>{
      try{
      const response = await getUserData()
      console.log(response)
    }catch(err){
      console.log(err)
    }
    }
    
    fetchUserData()
  },[])

  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage