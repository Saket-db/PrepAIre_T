'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
// import Markdown from 'react-markdown'
import EmptyState from '../_components/EmptyState'
// import { on } from 'events'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
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

    const router = useRouter();
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

    useEffect(() => {
        chatid&&GetMessagesList();
    },[chatid])

const GetMessagesList = async () => {
    setLoading(true); // Set loading state while fetching
    try {
        const result = await axios.get('/api/history?eventID=' + chatid);
        
        // Check if the response has data AND that content is an array
        if (result.data && Array.isArray(result.data.content)) {
            setMessageList(result.data.content);
        } else {
            // If there's no content, it's a new chat, so use an empty array
            setMessageList([]);
        }
    } catch (error) {
        console.error("Failed to fetch messages, likely a new chat.", error);
        // On any error (like a 404), also default to an empty array
        setMessageList([]);
    } finally {
        setLoading(false); // Stop loading
    }
};
    const onSend = async() => {
        // Add input validation
        if (!userInput.trim()) {
            console.log("[UI] Empty input, not sending");
            return;
        }

        console.log("[UI] onSend called. userInput:", userInput);
        setLoading(true);
        
        // This part is fine
        const userMessage = { 
            content: userInput, 
            role: 'user', 
            type: 'text' 
        };
        setMessageList((prev) => [...prev, userMessage]);
        
        try {
            const result = await axios.post("/api/ai-career-chat-agent", {
                userInput: userInput
            });

            console.log("[UI] API result.data:", result.data);

            // --- START OF FIX ---
            // Add validation for the API response
            if (!result.data) {
                throw new Error("No data received from API");
            }

            // Create a new message object from the AI response to ensure it's valid.
            const aiResponse = result.data;
            const formattedMessage: Message = {
                role: aiResponse.role || 'assistant',
                type: aiResponse.type || 'text',
                // Ensure content is a string. If it's an array, join it.
                content: Array.isArray(aiResponse.content) 
                    ? aiResponse.content.join('') 
                    : (aiResponse.content || "No response content"),
            };
            // --- END OF FIX ---

            setMessageList((prev) => [...prev, formattedMessage]);
            
        } catch (err) {
            console.error("[UI] Error in onSend:", err);
            
            // Add user-friendly error message to chat
            const errorMessage: Message = {
                role: 'assistant',
                type: 'text',
                content: 'Sorry, there was an error processing your message. Please try again.',
            };
            setMessageList((prev) => [...prev, errorMessage]);
            
        } finally {
            // Clear the input and stop loading
            setUserInput('');
            setLoading(false);
        }
    }

    // console.log('[UI] messageList (render):', messageList);


    // --- START OF FIXES ---
    useEffect(() => {
        // FIX: Trigger only after the AI response is received (when loading stops)
        // and ensure there are messages to save. This is more efficient.
        if (messageList.length > 0 && messageList.length % 2 === 0 && !loading) {
            updateMessagesList();
        }
    }, [messageList, loading]); // Add 'loading' to the dependency array

    const updateMessagesList = async() => {
        try {
            const result = await axios.put("/api/history", {
                // FIX: Send the entire 'messageList' array to match the 'json' db column,
                // instead of the 'userInput' state which is now empty.
                content: messageList,
                eventID: chatid
            });
            console.log(result);
        } catch (error) {
            console.error("[UI] Error updating messages list:", error);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !loading) {
            onSend();
        }
    }

      const onNewChat = async () => {
    const id = uuidv4();
    const result = await axios.post('/api/history', {
      eventID: id,
      content:[]
    })
    console.log("[UI] History record created:", result.data);
    router.replace("/ai-tools/ai-chat/" + id);
  }

  return (
    <div className='px-4 md:px-24 lg:px-32 xl:px-48 '>
        <div className='flex items-center justify-between gap-6'>
        <div>
            <h1 className='font-bold -mt-4 text-lg'>AI Career ChatBot</h1>
            <p className=' text-center text-sm'>Chat with our AI assistant for help and guidance.</p>
        </div>
        <div className='mb-3 gap-4'>
        <Button onClick ={onNewChat}>+ New Chat</Button>
        </div>
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
                <div key={index}> {/* <-- Add key here */}
                    <div className={`flex mb-2 ${message.role == 'user' ? 'justify-end' : 'justify-start'}`}>
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

            }}
            onKeyPress={handleKeyPress}/>

            <Button onClick = {onSend} disabled = {loading}><Send /></Button>

        </div>

       

        </div>

    </div>

  )

}



// export default page

export default page