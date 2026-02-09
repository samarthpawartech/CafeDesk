"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "./utils";

// Wrapper for the OTP input
function InputOTP({ className, containerClassName, ...props }) {
  return (
    <OTPInput
      className={cn("flex gap-2", containerClassName)}
      inputClassName={cn(
        "w-12 h-12 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        className,
      )}
      {...props}
    />
  );
}

// Group wrapper (if needed for grouping OTP inputs)
function InputOTPGroup({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

// Slot component (individual OTP input)
function InputOTPSlot({ index, className, ...props }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      className={cn(
        "w-12 h-12 flex items-center justify-center border rounded-md text-lg",
        isActive && "border-blue-500",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <span className="animate-blink h-6 w-px bg-black inline-block ml-0.5" />
      )}
    </div>
  );
}

// Separator component (optional visual separator between slots)
function InputOTPSeparator({ className, ...props }) {
  return (
    <MinusIcon className={cn("w-4 h-4 text-gray-400", className)} {...props} />
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
