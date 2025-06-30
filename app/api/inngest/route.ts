import { serve } from "inngest/next";
import { inngest } from "../../../Inngest/client";
import { helloWorld } from "@/Inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld, // <-- This is where you'll always add all your functions
  ],
});
