import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

const PrimaryButton: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-slate-200 px-1 py-1 text-4xl font-medium text-primary shadow-sm hover:bg-orange-400"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
