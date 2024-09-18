// app/page.js
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, UserIcon } from "lucide-react";
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
import Link from "next/link";
import { toast } from "react-hot-toast";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useMDXComponents } from "@mdx-js/react";
import { Pre } from "@/components/Pre"; // Import custom Pre component
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const messagesEndRef = useRef(null);
  const MdxComp = useMDXComponents();
  const components = { pre: Pre, ...MdxComp };

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

    if (!input) {
      toast.error("Please enter a message.");
      return;
    }

    const newMessage = { role: "user", content: input };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    const loadingToastId = toast.loading("Sending...");

    try {
      const formData = new FormData();
      formData.append("prompt", input);
      formData.append(
        "messageHistory",
        JSON.stringify(
          messages.map((msg) => ({
            ...msg,
            content: typeof msg.content === "string" ? msg.content : "",
          })),
        ),
      );

      const response = await fetch("/api/gpt4", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const content = typeof data.message === "string" ? data.message : "";
      const mdxSource = await serialize(content, {
        scope: data,
        mdxOptions: {
          rehypePlugins: [rehypePrism, rehypeSlug, rehypeAutolinkHeadings],
        },
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: mdxSource },
      ]);

      toast.success("Message sent successfully!", { id: loadingToastId });
    } catch (error) {
      setError(error.message);
      toast.error("Failed API Error", { id: loadingToastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen overflow-auto bg-white dark:bg-black text-black dark:text-white'>
      <ModeToggle />
      <ScrollArea className='flex-1 p-4 py-16'>
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
              Ask a question to get started.
            </h2>
            <Feedback />
            <Link
              href='https://github.com/adilsarfraz02/mintcode-ai/'
              className='underline opacity-60 hover:opacity-100'
              aria-label='Follow us on Github'
              target='_blank'>
              Follow Us
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
                      {message.role === "assistant" ? (
                        <MDXRemote className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white"
                          {...message.content}
                          components={components}
                        />
                      ) : (
                        <p className='px-0'>{message.content}</p>
                      )}
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
                    <Skeleton className='w-10 h-10 rounded-full' />
                    <div className='flex-1 space-y-2'>
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

      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='flex p-4 items-center justify-between fixed bottom-0 left-0 right-0 bg-white dark:bg-black'>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type your message here...'
          className='flex-1 mr-2'
        />
        <Button
          type='submit'
          className='flex items-center justify-center p-2 gap-2'
          disabled={isLoading}>
          <Send className='w-4 h-4' />
          Send
        </Button>
      </motion.form>
    </div>
  );
}
