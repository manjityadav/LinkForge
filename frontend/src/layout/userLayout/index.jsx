import Navbar from '@/src/components/Navbar'
import React from 'react'

const UserLayout = ({children}) => {
  return (
    <div>
      <Navbar/>
      {children}
    </div>
  )
}

export default UserLayout
