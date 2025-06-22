import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ pressed, onPressedChange, children, disabled = false, className }: ToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
        "hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        pressed 
          ? "bg-blue-100 text-blue-900 border border-blue-200" 
          : "bg-white text-gray-700 border border-gray-200",
        className
      )}
    >
      {children}
    </button>
  );
}
