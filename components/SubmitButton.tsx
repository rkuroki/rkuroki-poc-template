'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string;
}

export function SubmitButton({ children, pendingText, className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending || props.disabled}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
