import React from "react";
import PrimaryButton from "./PrimaryButton";

export const Container = () => {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <PrimaryButton>Connect Wallet</PrimaryButton>
    </div>
  );
};
