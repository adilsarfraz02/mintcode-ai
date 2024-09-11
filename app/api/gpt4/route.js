import { NextResponse } from 'next/server';
import OpenAI from "openai";

const token = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const chatModel = "gpt-4o-mini";  // Or your preferred chat model
const visionModel = "gpt-4o-mini";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        const formData = await req.formData();
        const prompt = formData.get('prompt');
        const imageFile = formData.get('image');
        const messageHistory = JSON.parse(formData.get('messageHistory') || '[]');

        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

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

        let response;

        if (imageFile) {
            // Convert the image to a base64 Data URL
            const imageDataUrl = await getImageDataUrl(imageFile);

            // Use vision model for image-based queries
            response = await client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful assistant named MintCode AI. Greet the user with your name. You can describe images and answer questions about them, but only refer to the most recently uploaded image." },
                    ...filteredMessageHistory,
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt || "What's in this image?" },
                            { type: "image_url", image_url: { url: imageDataUrl, details: "low" } }
                        ]
                    }
                ],
                model: visionModel
            });
        } else {
            // Use chat model for text-only queries
            response = await client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful assistant named MintCode AI. Greet the user with your name. Do not refer to or describe any images unless one has just been uploaded." },
                    ...filteredMessageHistory,
                    { role: "user", content: prompt }
                ],
                model: chatModel
            });
        }

        return NextResponse.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error("The API encountered an error:", error);
        return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
    }
}

// Helper function to convert file to base64 data URL
async function getImageDataUrl(file) {
    if (!file) return null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    return `data:${file.type};base64,${base64}`;
}
