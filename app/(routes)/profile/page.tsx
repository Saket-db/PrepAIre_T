import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='max-w-xl -mt-4 lg:max-w-3xl mx-auto p-4 flex flex-col items-center'>
      <UserProfile/>
    </div>
  )
}

export default page
