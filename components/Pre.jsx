import React, { useEffect, useCallback } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export const Pre = ({ children }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = useCallback(() => {
        const codeToCopy = typeof children.props.children === 'string' ? children.props.children.trim() : '';
        if (codeToCopy) {
            navigator.clipboard.writeText(codeToCopy).then(() => {
                setCopied(true);
                toast.success("Code copied to clipboard!");
                setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
            });
        }
    }, [children]);

    useEffect(() => {
        const button = document.querySelector('.copy-button');
        if (button) {
            button.addEventListener('touchstart', handleCopy);
        }
        return () => {
            if (button) {
                button.removeEventListener('touchstart', handleCopy);
            }
        };
    }, [handleCopy]);

    return (
        <div className='relative'>
            <pre className='bg-gray-800 text-white p-4 rounded-lg'>{children}</pre>
            <Button
                onClick={handleCopy}
                className='absolute top-2 right-2 text-gray-400 hover:text-gray-800 copy-button'>
                {copied ? (
                    <ClipboardCheck className='h-4 w-4' />
                ) : (
                    <Clipboard className='h-4 w-4' />
                )}
            </Button>
        </div>
    );
};