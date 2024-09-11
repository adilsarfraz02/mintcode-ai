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

const feedback = [
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
  const submitFeedback = async (feedback) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        toast.success("Feedback submitted successfully");
        throw new Error("Network response was not ok");
      }

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
          toast.success("Feedback submitted successfully");
        })
        .catch(() => {
          setRequestState(false);
          toast.error("Error submitting feedback");
        })
        .finally(() => setLoadingState(false));
    }
  }, [feedback]);

  return {
    submitFeedback: (happiness, feedback) =>
      setFeedback({ happiness, feedback }),
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

  // Reset textarea when happiness changes
  useEffect(() => {
    if (!happiness && textRef.current) {
      textRef.current.value = "";
    }
    if (textRef.current.value = "") {
      
    }
  }, [happiness]);

  // Handle successful submission state
  useEffect(() => {
    let timeout = null;
    let submissionStateTimeout = null;

    if (isSent) {
      setSubmissionState(true);

      // Clean up textarea and happiness state
      timeout = setTimeout(() => {
        setHappiness(null);
        if (textRef.current) textRef.current.value = "";
      }, 2000);

      // Clean up submission text and close modal after 3 seconds
      submissionStateTimeout = setTimeout(() => {
        setSubmissionState(false);
        setIsModalOpen(false); // Close modal after feedback is sent
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
        <Mail className="siz-4" />
        Give Feedback
      </Button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                layout
                initial={{ borderRadius: "2rem" }}
                animate={
                  happiness
                    ? { borderRadius: "0.5rem" }
                    : { borderRadius: "2rem" }
                }
                className={`${twMerge(
                  "w-fit overflow-hidden border py-2  bg-neutral-200/60 shadow-lg border-neutral-800/30 dark:bg-neutral-950"
                )} `}
              >
                <span className="flex items-center justify-center gap-3 pl-4 pr-2">
                  <div className="text-sm text-black dark:text-neutral-400">
                    Like our service?
                  </div>
                  <div className="flex items-center text-neutral-400">
                    {feedback.map((e) => (
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
                </span>

                {/* Feedback form textarea and submit button */}
                <motion.div
                  aria-hidden={!happiness}
                  initial={{ height: 0, translateY: 15 }}
                  className="px-2"
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                  animate={happiness ? { height: "195px", width: "330px" } : {}}
                >
                  <AnimatePresence>
                    {!isSubmitted ? (
                      <motion.span
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 1 }}
                      >
                        <textarea
                          ref={textRef}
                          placeholder="Your app is awesoooome"
                          className="min-h-32 w-full resize-none rounded-md border bg-transparent p-2 text-sm placeholder-neutral-400 focus:border-neutral-400 focus:outline-0 border-neutral-800/30 focus:dark:border-white"
                        />
                        <div className="flex h-fit w-full justify-end">
                          <Button
                            onClick={() => {
                              if (!textRef.current.value.trim()) {
                                toast.error("Enter a message - Empty/?");
                                return;
                              }
                              submitFeedback(
                                happiness,
                                textRef.current.value
                              );
                            }}
                            className={cn(
                              "mt-1 flex h-9 items-center justify-center rounded-md border bg-neutral-950 px-2 text-sm text-white dark:bg-white dark:text-neutral-950",
                              {
                                "bg-neutral-500 dark:bg-white dark:text-neutral-500":
                                  isLoading,
                              }
                            )}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading
                              </>
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </div>
                      </motion.span>
                    ) : (
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="flex h-full w-full flex-col items-center justify-start gap-2 pt-9 text-sm font-normal"
                      >
                        <motion.div
                          variants={item}
                          className="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-full bg-blue-500 dark:bg-sky-500"
                        >
                          <Check
                            strokeWidth={2.5}
                            size={16}
                            className="stroke-white"
                          />
                        </motion.div>
                        <motion.div variants={item}>
                          Your feedback has been received!
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
            <Button onClick={() => setIsModalOpen(false)} variant="link">
              close
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const container = {
  show: { transition: { staggerChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0 },
};
