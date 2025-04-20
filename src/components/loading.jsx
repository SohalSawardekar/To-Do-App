"use client";

import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
      <Loader2 className="h-15 w-14 animate-spin text-slate-600" />
      <p className="text-slate-500 text-md">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
