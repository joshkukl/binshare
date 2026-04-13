"use client";
import React from "react";
import { cn } from "clsx-for-tailwind";
import SlideUp from "@/layout/motion/slideup";

/* * FormMessage component displays messages based on the state of a form submission.
 * It shows different messages for pending, error, and success states.
 * The message will automatically hide after 6 seconds.
 * It uses the `useEffect` hook to manage the visibility of the message.
 * The component accepts a `message` prop which contains the state of the form submission.
 */

// Define the expected shape of the message prop
interface FormMessageProps {
  message: {
    isPending?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
    error?: unknown;
    data?: {
      isError?: boolean;
      message?: string;
    };
  };
}

const FormMessage: React.FC<FormMessageProps> = ({ message }) => {
  const [showMessage, setShowMessage] = React.useState(false);
  React.useEffect(() => {
    setShowMessage(true);
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 6000);
    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [message]);

  return (
    <SlideUp isAnimating={showMessage}>
      <div
        className={cn(
          "text-center transition-all duration-500 ease-in-out",
          showMessage ? "opacity-100" : "opacity-0"
        )}
      >
        {message.isPending && (
          <p className="text-sm text-orange-500">Creating Task...</p>
        )}
        {message.isError && (
          <p className="text-sm text-red-600">
            {(message.error as Error).message}
          </p>
        )}
        {message.isSuccess && (
          <div
            className={cn(
              message.data?.isError ? "bg-red-800" : "bg-green-800",
              "rounded-md my-3 p-2 text-white text-sm w-full"
            )}
          >
            <p className="text-sm">
              {message.data?.message
                ? message.data.message
                : "Task Created Successfully!"}{" "}
            </p>
          </div>
        )}
      </div>
    </SlideUp>
  );
};

export default FormMessage;
