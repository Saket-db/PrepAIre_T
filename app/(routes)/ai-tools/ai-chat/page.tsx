'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import React, { useState } from 'react'
import EmptyState from './_components/EmptyState'
// import { on } from 'events'
import axios from 'axios'
// import { Result } from 'postcss/lib/postcss'

type Message = {
    content: string;
    role: string;
    type: string;
}
const page = () => {
    const[loading, setLoading] = useState<boolean>(false);
    const [userInput, setUserInput] = useState<string>('');
    const [messageList, setMessageList] = useState<Message[]>([]);

    // Debug: log state changes
    React.useEffect(() => {
        console.log("[UI] messageList updated:", messageList);
    }, [messageList]);
    React.useEffect(() => {
        console.log("[UI] userInput updated:", userInput);
    }, [userInput]);
    React.useEffect(() => {
        console.log("[UI] loading state:", loading);
    }, [loading]);

    const onSend = async() => {
        console.log("[UI] onSend called. userInput:", userInput);
        setLoading(true);
        setMessageList((prev) => {
            const updated = [...prev, { content: userInput, role:'user', type:'text' }];
            console.log("[UI] Added user message to messageList:", updated);
            return updated;
        });
        try {
            const result = await axios.post("/api/ai-career-chat-agent", {
                userInput: userInput
            });
            console.log("[UI] API result.data:", result.data);
            setMessageList((prev) => {
                const updated = [...prev, result.data];
                console.log("[UI] Added API response to messageList:", updated);
                return updated;
            });
        } catch (err) {
            console.error("[UI] Error in onSend:", err);
        }
        setLoading(false);
    }

console.log('[UI] messageList (render):', messageList);


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
            <EmptyState selectedQuestion = {(question : string) => {
                console.log("[UI] EmptyState selectedQuestion:", question);
                setUserInput(question);
            }}/>
        </div>
        <div className='flex-1'>
            {/* message list */}
        </div>
        <div className='flex items-center gap-4 justify-between'>
            {/* Input Field */}
            <Input placeholder='Type Here..' value={userInput}
            onChange={(e) => {
                console.log("[UI] Input changed:", e.target.value);
                setUserInput(e.target.value);
            }}/>
            <Button onClick = {onSend} disabled = {loading}><Send /></Button>
        </div>
        
        </div>
    </div>
  )
}

export default page
