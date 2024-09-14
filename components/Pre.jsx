import React from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export const Pre = ({ children }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const codeToCopy = children.props.children.trim();
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    });
  };

  return (
    <div className='relative'>
      <pre className='bg-gray-800 text-white p-4 rounded-lg'>{children}</pre>
      <button
        onClick={handleCopy}
        className='absolute top-2 right-2 text-gray-400 hover:text-gray-100'>
        {copied ? (
          <ClipboardCheck className='h-4 w-4' />
        ) : (
          <Clipboard className='h-4 w-4' />
        )}
      </button>
    </div>
  );
};
