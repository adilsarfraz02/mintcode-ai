'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Camera, Paperclip, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input && !imageFile) return

    const newMessage = { role: 'user', content: input }
    if (imageFile) {
      newMessage.image = URL.createObjectURL(imageFile)
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('prompt', input)
      if (imageFile) {
        formData.append('image', imageFile)
      }
      formData.append('messageHistory', JSON.stringify(messages))

      const response = await fetch('/api/gpt4', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data.message },
      ])
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
      setImageFile(null)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
    } else {
      setError('Please select a valid image file.')
    }
  }

  return (
    (<div className="flex flex-col h-screen bg-background">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-primary">Welcome to MintCode AI</h1>
          </div>
        )}
        {messages.map((message, index) => (
          <Card
            key={index}
            className={`max-w-[80%] ${
              message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto'
            }`}>
            <div className="p-4">
              {message.image && (
                <img src={message.image} alt="User upload" className="mb-2 rounded w-full" />
              )}
              <p>{message.content}</p>
            </div>
          </Card>
        ))}
        {isLoading && (
          <Card className="max-w-[80%] mr-auto">
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </Card>
        )}
      </div>
      {error && (
        <div className="p-4 bg-destructive text-destructive-foreground">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or upload an image..."
            className="flex-1 min-h-[60px]" />
          <div className="flex flex-col space-y-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current.click()}>
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" />
            {imageFile && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setImageFile(null)}>
                <Camera className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            )}
            <Button type="submit" size="icon" disabled={isLoading || (!input && !imageFile)}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
        {imageFile && (
          <div className="mt-2 text-sm text-muted-foreground">
            Image selected: {imageFile.name}
          </div>
        )}
      </form>
    </div>)
  );
}