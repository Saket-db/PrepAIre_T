'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import React, { useState } from 'react'
// import Markdown from 'react-markdown'
import EmptyState from '../_components/EmptyState'
// import { on } from 'events'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'next/navigation'
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

    const { chatid } = useParams();
    console.log("[UI] chatId:", chatid);
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
            const updated = [...prev, { 
                content: userInput, 
                role:'user', 
                type:'text' 
            }];
            setUserInput(''); // Clear input after sending
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
            setLoading(false);
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

        {messageList?.length <=0 && <div className='mt-3'>
            {/* empty state */}
            <EmptyState selectedQuestion = {(question : string) => {
                console.log("[UI] EmptyState selectedQuestion:", question);
                setUserInput(question);
            }}/>
        </div>}

        <div className='flex-1'>
            {/* message list */}
        {messageList?.map((message, index) => (
            <div>
            <div key={index} className={`flex mb-2 ${message.role == 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg gap-2 ${message.role == 'user' ? 'bg-gray-300 text-black' : 'bg-gray-100 text-black'}`}>
                    <ReactMarkdown>
                    {message.content}

                    </ReactMarkdown>
                    </div>
                </div>
                {loading && messageList?.length-1 == index && <div className='flex justify-start p-3 rounded-lg gap-2 bg-gray-100 text-black mb-3'>
                    <LoaderCircle className = "animate-spin" /> Generating response...
                </div>}
            </div>
        ))}
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
