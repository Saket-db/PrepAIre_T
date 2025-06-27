import React from 'react'
import { Brain, FileTerminal, FileUser, Map } from 'lucide-react'
import AiToolCard from './AiToolCard'

const AiTool = () => [
  {
    name: 'Career ChatBot',
    desc: 'Q&A with an AI Career Coach',
    icon: <Brain className="h-4 w-4" />,
    button: 'Ask Now',
    path: '/ai-tools/ai-chat',
  },
  {
    name: 'AI Resume Analyzer',
    desc: 'Get feedback on your resume from an AI',
    icon: <FileUser className="h-4 w-4" />,
    button: 'Analyze Now',
    path: '/ai-resume-analyzer',
  },
  {
    name: 'Career Roadmap Generator',
    desc: 'Build a personalized career roadmap with AI',
    icon: <Map className="h-4 w-4" />,
    button: 'Generate Now',
    path: '/ai-career-roadmap-generator',
  },
    {
    name: 'Cover Letter Generator',
    desc: 'Get help creating a standout cover letter with AI',
    icon: <FileTerminal className="h-4 w-4" />,
    button: 'Create Now',
    path: '/ai-cover-letter-generator',
  },
]
function AiTools () {
  return (
    <div className='mt-7 p-3 bg-white border rounded-md hover:shadow-sm'>
        <h2 className='font-bold text-2xl'>Available AI Tools</h2>
      <p>Select the AI tool you want to use:</p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 gap-5'>
        {AiTool().map((tool:any, index) => (
            <AiToolCard tool={tool} key={index} />
        ))}

      </div>
    </div>
  )
}

export default AiTools