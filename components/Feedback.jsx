"use client";

import {
  Angry,
  Check,
  Frown,
  Laugh,
  Loader2,
  Smile,
  Mail,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const feedbackData = [
  { happiness: 4, emoji: <Laugh size={16} className="stroke-inherit" /> },
  { happiness: 3, emoji: <Smile size={16} className="stroke-inherit" /> },
  { happiness: 2, emoji: <Frown size={16} className="stroke-inherit" /> },
  { happiness: 1, emoji: <Angry size={16} className="stroke-inherit" /> },
];

// Hook for feedback submission
const useSubmitFeedback = () => {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setLoadingState] = useState(false);
  const [isSent, setRequestState] = useState(false);

  const submitFeedback = async (feedbackData) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast.success("Feedback submitted successfully");
      return await response.json();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback");
      throw error;
    }
  };

  useEffect(() => {
    if (feedback) {
      setLoadingState(true);
      setRequestState(false);

      submitFeedback(feedback)
        .then(() => {
          setRequestState(true);
        })
        .catch(() => {
          setRequestState(false);
        })
        .finally(() => setLoadingState(false));
    }
  }, [feedback]);

  return {
    submitFeedback: (happiness, feedbackText) =>
      setFeedback({ happiness, feedback: feedbackText }),
    isLoading,
    isSent,
  };
};

// Feedback component
export const Feedback = () => {
  const textRef = useRef(null);
  const [happiness, setHappiness] = useState(null);
  const [isSubmitted, setSubmissionState] = useState(false);
  const { submitFeedback, isLoading, isSent } = useSubmitFeedback();
  const [isModalOpen, setIsModalOpen] = useState(false);

useEffect(() => {
  if (!happiness && textRef.current) {
    textRef.current.value = "";
  }
}, [happiness]);

  useEffect(() => {
    let timeout = null;
    let submissionStateTimeout = null;

    if (isSent) {
      setSubmissionState(true);

      timeout = setTimeout(() => {
        setHappiness(null);
        if (textRef.current) textRef.current.value = "";
      }, 2000);

      submissionStateTimeout = setTimeout(() => {
        setSubmissionState(false);
        setIsModalOpen(false);
      }, 3000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (submissionStateTimeout) clearTimeout(submissionStateTimeout);
    };
  }, [isSent]);

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="gap-2 !rounded-t-none !rounded-l-none"
        variant="outline"
      >
        <Mail className="size-4" />
        Give Feedback
      </Button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-50 dark:bg-black bg-opacity-50 backdrop-blur-lg"
          >
            <h1 className="text-3xl font-bold mb-4">Help Us ?</h1>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative  p-4 rounded-lg backdrop-blur-3xl"
            >
              <motion.div
                aria-hidden={!happiness}
                initial={{ height: 0, translateY: 15 }}
                className="px-2"
                transition={{ ease: "easeInOut", duration: 0.3 }}
                animate={
                  happiness ? { height: "195px", width: "330px" } : { height: 0 }
                }
              >
                <textarea
                  ref={textRef}
                  className="block h-20 w-full p-2 mt-2 text-sm border border-gray-300 rounded"
                  placeholder="Tell us about your experience"
                />
              </motion.div>

              <div className="flex items-center text-neutral-400">
                {feedbackData.map((e) => (
                  <button
                    onClick={() =>
                      setHappiness((prev) =>
                        e.happiness === prev ? null : e.happiness
                      )
                    }
                    className={twMerge(
                      happiness === e.happiness
                        ? "bg-blue-100 stroke-blue-500 dark:bg-sky-900 dark:stroke-sky-500"
                        : "stroke-neutral-500 dark:stroke-neutral-400",
                      "flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-blue-100 hover:stroke-blue-500 hover:dark:bg-sky-900 hover:dark:stroke-sky-500"
                    )}
                    key={e.happiness}
                  >
                    {e.emoji}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => {
                  const message = textRef.current?.value.trim();
                  if (!message) {
                    toast.error("Enter a message - Empty/?");
                    return;
                  }
                  submitFeedback(happiness, message);
                }}
                className="mt-4"
                variant="outline"
                disabled={isLoading || isSubmitted}
              >
                {isLoading ? <Loader2 size={16} /> : <Check size={16} />}
                Submit Feedback
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
