import React from 'react'
import { Gamepad2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const ErrorPage = () => {
    const navigate=useNavigate();
  return (
    <div className="h-full w-full flex flex-col items-center justify-center  text-customLight">
    <Gamepad2 className="w-24 h-24  " />
    <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
    <p className="text-xl mb-8">The page you're looking for doesn't exist.</p>
    <div className="text-center">
      <p className="mb-4">Error 404: Page Not Found</p>
     <button onClick={()=>{navigate('/')}}> Home Page</button>
       
    </div>
  </div>
  )
}

export default ErrorPage
