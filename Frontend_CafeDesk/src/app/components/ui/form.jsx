"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { cn } from "./utils";
import { Label } from "./label";

// Form wrapper
const Form = FormProvider;

// Context for FormField
const FormFieldContext = React.createContext(undefined);

// FormField wrapper for use with react-hook-form Controller
function FormField({ name, children }) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  );
}

// Context for FormItem
const FormItemContext = React.createContext(undefined);

// Hook to access field + item context
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext?.name });

  if (!fieldContext) {
    throw new Error("useFormField must be used within a FormField");
  }
  if (!itemContext) {
    throw new Error("useFormField must be used within a FormItem");
  }

  const { id } = itemContext;
  const fieldState = fieldContext.name
    ? getFieldState(fieldContext.name, formState)
    : {};

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-item`,
    formDescriptionId: `${id}-description`,
    formMessageId: `${id}-message`,
    ...fieldState,
  };
}

// FormItem wrapper
function FormItem({ className, children }) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </FormItemContext.Provider>
  );
}

// FormLabel component
function FormLabel({ className, ...props }) {
  const { formItemId } = useFormField();
  return (
    <Label
      htmlFor={formItemId}
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

// FormControl wrapper (usually for inputs)
function FormControl({ className, children }) {
  const { formItemId } = useFormField();
  return (
    <div id={formItemId} className={cn("flex flex-col", className)}>
      {children}
    </div>
  );
}

// FormDescription component
function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField();
  return (
    <p
      id={formDescriptionId}
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

// FormMessage component (displays validation error)
function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField();
  if (!error?.message) return null;

  return (
    <p
      id={formMessageId}
      className={cn("text-sm text-red-600", className)}
      {...props}
    >
      {String(error.message)}
    </p>
  );
}

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
};
