'use client'
import React from 'react'

const questionList = [
    'What skills are needed to be a full-stack developer?',
    'How can I improve my coding skills?',
    'How to start my career in AI?',
]
function EmptyState({ selectedQuestion } : any) {
  return (
    <div>
      <h2 className='font-bold text-lg'>Ask anything to our AI Chatbot</h2>
      <div>
        {questionList.map((question, index) => (
            <h3 className='text-center p-4 border rounded-md mt-3 hover:border-primary hover:cursor-pointer' 
            onClick={() => selectedQuestion(question)}
            key={index}>{question}</h3>
        ))}
      </div>
    </div>
  )
}

export default EmptyState
