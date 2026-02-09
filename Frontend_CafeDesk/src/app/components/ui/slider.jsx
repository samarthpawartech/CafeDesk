"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

function Slider({
  className,
  defaultValue = [0],
  value,
  min = 0,
  max = 100,
  step = 1,
  ...props
}) {
  // Determine controlled or uncontrolled values
  const _values = React.useMemo(() => {
    if (value != null) return Array.isArray(value) ? value : [value];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  }, [value, defaultValue]);

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex items-center select-none touch-none w-full h-5",
        className,
      )}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      {...props}
    >
      <SliderPrimitive.Track className="relative flex-1 h-1 bg-gray-200 rounded-full">
        <SliderPrimitive.Range className="absolute h-1 bg-blue-500 rounded-full" />
      </SliderPrimitive.Track>

      {_values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block w-5 h-5 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
