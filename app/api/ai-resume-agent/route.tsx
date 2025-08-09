
import fs from "fs/promises";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

import {NextRequest} from "next/server";

export async function POST(req: any){
    const FormData = await req.formData();
    const resume:any = FormData.get("resume");
    const recordId = FormData.get("recordId");

    const loader = new WebPDFLoader(resume);
    const docs = await loader.load();
    console.log(docs[0]); // Raw PDF text
    const arrayBuffer = await resume.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

}