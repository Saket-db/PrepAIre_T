import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { JSX } from 'react'

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
  return (
    <div className='border border-gray-200 rounded-md p-2 shadow-sm hover:shadow-md ease-in duration-100' >
      <div className='w-8 h-8 mt-2'>{tool.icon}</div>
      <h2 className='font-semibold text-lg lg:mb-2'>{tool.name}</h2>
      <p className='text-sm mb-2 text-gray-500'>{tool.desc}</p>
      <Link href={tool.path}>
        <Button className='w-full'>{tool.button}</Button>
      </Link>
    </div>
  )
}

export default AiToolCard