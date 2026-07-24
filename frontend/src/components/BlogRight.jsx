import React, { useEffect, useState } from 'react'
import InfoProfile from './InfoProfile'
import Notification from './Notification'

function BlogRight() {
  const [role, setRole] = useState('')

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      const user = JSON.parse(userString)
      setRole(user.role || '')
    }
  }, [])

  const isAdmin = role === 'admin'

  return (
    <div className='max-w-xs bg-white overflow-hidden p-6'>
      <InfoProfile />
      {!isAdmin && (
        <>
          <hr className='my-8' />
          <Notification />
        </>
      )}
    </div>
  )
}

export default BlogRight
