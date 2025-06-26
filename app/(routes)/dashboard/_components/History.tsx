'use client'
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'

const History = () => {
    const [userHistory, setUserHistory] = useState([]);
  return (
    <div className='mt-5 p-4 bg-white border rounded-md  hover:shadow-sm'>
        <h2 className='font-bold text-2xl'>Check Your History</h2>
        <p className='text-sm text-gray-500'>View your past interactions and AI-generated content.</p>


    {userHistory?.length === 0 && (
      <div className='flex flex-col items-center justify-center'>
        <div className='text-2xl font-semibold flex justify-center mt-5'>No history found!</div>
        <Button className='mt-5' >Explore AI Tools</Button>
      </div>
    )}
    </div>
  )
}

export default History