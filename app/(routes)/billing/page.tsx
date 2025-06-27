import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1 className='font-bold text-center text-2xl'>Choose Your Plan</h1>
      <p className='text-lg text-center'>Subscribe to the plan that best fits your needs.</p>
      <div className='mt-5'>
      <PricingTable/>
      </div>
    </div>
  )
}

export default page
