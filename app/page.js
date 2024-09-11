"use client";
import React, { useState, useRef, useEffect } from "react";
import { Camera, CameraOff, Send, UserIcon, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GrUserAdmin } from "react-icons/gr";
import { motion } from "framer-motion";
import { fetchWeatherData, WeatherCard } from "@/components/Weather";
import { Feedback } from "@/components/Feedback";
import { ModeToggle } from "@/components/Theme-Switcher";
import Head from 'next/head'
import Link from "next/link"
import { Github } from 'lucide-react';


export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchWeatherData("Pakistan")
      .then((data) => setWeatherData(data))
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input && !imageFile) return;

    const newMessage = { role: "user", content: input };
    if (imageFile) {
      newMessage.image = URL.createObjectURL(imageFile);
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("prompt", input);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("messageHistory", JSON.stringify(messages));

      const response = await fetch("/api/gpt4", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`flex transition-all duration-300 flex-col min-h-screen 
        bg-white dark:bg-black text-black dark:text-white
        `}>
        <Head>
<meta name="google-site-verification" content="Thhmlg0oWUjmtwYP02VM85pBlzxhKNvDsORoJlEJMe8" />
  </Head>
      {/* Theme Switcher */}
      <ModeToggle />
      <ScrollArea className='flex-1 p-4 py-16 '>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='flex items-center flex-col gap-2 justify-center text-center'>
            {weatherData && <WeatherCard weather={weatherData} />}
            <h1 className='text-4xl font-bold mt-4'>
              Welcome to MintCode AI ✨
            </h1>
            <h2 className='text-lg opacity-50'>
              Ask a question or upload an image to get started.
            </h2>
              <Link href="https://github.com/adilsarfraz02/mintcode-ai/" className="underline">
                  <Github />
              </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='space-y-4'>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}>
                <Card
                  className={cn(
                    "inline-block max-w-[80%] p-4",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}>
                  <div className='flex flex-col space-y-2'>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center",
                        message.role === "user"
                          ? "bg-blue-400 text-white"
                          : "bg-gray-500 text-white",
                      )}>
                      {message.role === "user" ? <UserIcon /> : <GrUserAdmin />}
                    </div>
                    <div className='space-y-2'>
                      {message.image && (
                        <img
                          src={message.image}
                          alt='Uploaded'
                          className='rounded-lg max-w-1/2 h-60 mb-2'
                        />
                      )}
                      <p className={`px-0`}>{message.content}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='flex justify-start w-full'>
                <Card className='p-4 bg-gray-200 dark:bg-zinc-900 rounded-xl w-[80%] max-w-[80%]'>
                  <div className='flex space-x-4'>
                    {/* User Icon Placeholder */}
                    <Skeleton className='w-10 h-10 rounded-full' />
                    <div className='flex-1 space-y-2'>
                      {/* Message Content */}
                      <Skeleton className='h-4 w-3/4 rounded-md' />
                      <Skeleton className='h-4 w-1/2 rounded-md' />
                      <Skeleton className='h-4 w-5/6 rounded-md' />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </ScrollArea>

      {/* Input Field Fixed at Bottom */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex p-4 items-center justify-between fixed bottom-0 left-0 right-0 bg-white dark:bg-black`}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type your message here...'
          className='flex-1 mr-2 '
        />
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          hidden
        />
        {imageFile ? (
          <Button
            type='button'
            variant='outline'
            onClick={handleRemoveImage}
            className='flex items-center justify-center p-2 gap-2 mr-2'>
            <CameraOff className='mr-2 md:mr-0 h-4 w-4' />
            <p className={`px-0 hidden md:block`}>Remove Image</p>
          </Button>
        ) : (
          <Button
            type='button'
            variant='outline'
            onClick={() => fileInputRef.current.click()}
            className='flex items-center justify-center p-2 gap-2 mr-2'>
            <Camera className='h-4 w-4' />
            <p className={`px-0 hidden md:block`}>
              {isLoading ? "Uploading..." : "Upload Image"}
            </p>
          </Button>
        )}
        <Button
          type='submit'
          className='flex items-center justify-center p-2 gap-2'>
          <Send className='h-4 w-4 ' />
          <p className={`px-0 hidden md:block`}>
            {isLoading ? "Sending..." : "Send"}
          </p>
        </Button>
      </motion.form>

      {/* Feedback Modal */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='fixed top-4 left-4 z-40'>
        <Feedback />
      </motion.div>
      
      {error && <p className='text-red-500 p-4 z-!50'>{error}</p>}
    </div>
  );
}
