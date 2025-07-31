'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { File } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ResumeDialogue =({openResumeButton, setOpenResumeButton}:any)=> {
  const [file, setFile] = useState();

  const onFileChange = (event:any) => {
    const file = event.target.files?.[0];
    if(file) {
        console.log("File selected:", file.name);
        setFile(file);
        // You can handle the file upload here
    } else {
        console.log("No file selected");
    }
  }

  return (
   <Dialog open = {openResumeButton} onOpenChange={setOpenResumeButton}>
  {/* <DialogTrigger>Open</DialogTrigger> */}
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload Resume PDF</DialogTitle>
      <DialogDescription>
        <div>
            <label htmlFor = 'resumeUpload' className='flex items-center flex-col p-7 justify-center border border-dashed rounded-xl hover:bg-gray-100 cursor-pointer'>
                <File className='h-10 w-10'/>
                <h2 className='mt-3'>Upload your resume</h2>
            </label>
            <input  type = 'file' id = 'resumeUpload' accept='.pdf' className='hidden' onChange = {onFileChange}/>

        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant={'outline'}>Cancel</Button>
      <Button>Upload</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default ResumeDialogue
