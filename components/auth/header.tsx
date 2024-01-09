import React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const fonts = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const Header = ({ label }: { label: string }) => {
  return (
    <div className="w-full flex flex-col items-center gap-y-4 justify-center">
      <h1 className={cn(" text-3xl font-semibold", fonts.className)}>Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;
