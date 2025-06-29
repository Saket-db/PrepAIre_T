'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import React, { useState } from 'react'
import EmptyState from './_components/EmptyState'

const page = () => {
    const [userInput, setUserInput] = useState<string>('');
  return (
    <div className='px-4 md:px-24 lg:px-32 xl:px-48 '>
        <div className='flex items-center justify-between gap-6'>
        <div>
            <h1 className='font-bold -mt-4 text-lg'>AI Career ChatBot</h1>
            <p className=' text-center text-sm'>Chat with our AI assistant for help and guidance.</p>
        </div>
        <Button>+ New Chat</Button>
        </div>
        
        <div className='flex flex-col h-[75vh]'>

        <div>
            {/* empty state */}
            <EmptyState selectedQuestion = {(question : string) => setUserInput(question)}/>
        </div>
        <div className='flex-1'>
            {/* message list */}
        </div>
        <div className='flex items-center gap-4 justify-between'>
            {/* Input Field */}
            <Input placeholder='Type Here..' value={userInput}
            onChange={(e) => setUserInput(e.target.value)}/>
            <Button><Send /></Button>
        </div>
        
        </div>
    </div>
  )
}

export default page
