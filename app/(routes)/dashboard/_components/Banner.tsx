import { desc } from 'drizzle-orm'
import path from 'path'

import {Button} from '@/components/ui/button'
import React from 'react'


const Banner = () => {
  return (
    <div className='p-5 bg-gradient-to-tr from-[#19253b] to-[#447ef2] text-white rounded-lg shadow-md flex-col lg:flex-col items-center justify-between  -mb-2'>
      <h2 className='font-bold text-2xl'>AI Career Coach Agent</h2>
      <p className='text-sm text-white'>Explore our suite of AI-powered tools designed to assist you in your career journey.</p>
      <Button variant ={'outline'} className='mt-5 bg-[#19253b] text-[#447ef2] hover:bg-[#447ef2] hover:text-[#19253b]'>Get Started</Button>
    </div>
  )
}

export default Banner