import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        const formData = await req.formData();
        const prompt = formData.get('prompt');
        const messageHistory = JSON.parse(formData.get('messageHistory') || '[]');

        let response;

        // Filter out image references from previous messages
        const filteredMessageHistory = messageHistory.map(message => {
            if (message.role === 'user' && Array.isArray(message.content)) {
                return {
                    ...message,
                    content: message.content.filter(content => content.type === 'text')
                };
            }
            return message;
        });

     
            response = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful assistant named MintCode AI." },
                    ...filteredMessageHistory,
                    { role: "user", content: prompt }
                ],
                model: "llama3-8b-8192", // Text model
                temperature: 1.0,
                max_tokens: 4096,
                top_p: 1.0
            });
        

        // Check response and return message content
        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error('No response from Groq model');
        }

        return NextResponse.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error("The API encountered an error:", error);
        return NextResponse.json({ error: 'Failed to process the request', details: error.message }, { status: 500 });
    }
}

