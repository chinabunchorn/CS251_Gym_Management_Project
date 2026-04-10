"use client";

interface AddButtonProps {
    text: string;           
    onClick: () => void;    
    className?: string;     
}

export default function AddButton({ text, onClick, className = "" }: AddButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 bg-[#5F33E1] hover:bg-[#4d28b8] text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-sm active:scale-95 ${className}`}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" height="20" 
                viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2.5" 
                strokeLinecap="round" strokeLinejoin="round"
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {text}
        </button>
    );
}