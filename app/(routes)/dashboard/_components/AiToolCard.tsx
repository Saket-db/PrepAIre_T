'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid';
import React, { JSX } from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
// import {v4 as uuidv4} from 'uuid';
interface TOOL{
    name: string,
    desc: string,
    icon: JSX.Element,
    button: string,
    path: string,
}

type AiToolProps = {
    tool: TOOL
}
const AiToolCard = ({ tool }: AiToolProps) => {
  const id = uuidv4();
  const { user } = useUser();
  const router = useRouter();

  const onClickButton = async () => {
    const result = await axios.post('/api/history', {
      eventID: id,
      content:[]
    })
    console.log("[UI] History record created:", result.data);
    router.push(tool.path + "/" + id);
  }

  return (
    <div className='border border-gray-200 rounded-md p-2 shadow-sm hover:shadow-md ease-in duration-100' >
      <div className='w-8 h-8 mt-2'>{tool.icon}</div>
      <h2 className='font-semibold text-lg lg:mb-2'>{tool.name}</h2>
      <p className='text-sm mb-2 text-gray-500'>{tool.desc}</p>
      <Link href={tool.path+"/"+id}>
        <Button className='w-full mt-3' onClick={onClickButton}>{tool.button}</Button>
      </Link>
    </div>
  )
}

export default AiToolCard

// function useUser(): { user: any; } {
//   throw new Error('Function not implemented.');
// }
