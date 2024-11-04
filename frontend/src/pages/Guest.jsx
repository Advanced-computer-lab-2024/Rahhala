import React from 'react'
import NavigateButton from '../components/UpdateProfileButton'
const Guest = () => {
    
  return (
    <div>
        <NavigateButton path={"/viewAll"} text={"View All"}/>
        <NavigateButton path={"/login"} text={"Login"}/>
        <NavigateButton path={"/register"} text={"Register"}/>
    </div>
  )
}

export default Guest