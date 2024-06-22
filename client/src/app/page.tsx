"use client";

import { useState } from "react";
import GeneralCard from "@/components/cards/GeneralCard";
import DarkModeToggle from "@/components/custom/darkmodetoggle";
import UploadImageButton from "@/components/custom/uploadimagebtn";
import ReloadGraphButton from "@/components/custom/reloadgraphsbtn";
import { ToastProvider, Toast } from "@/components/ui/toast";
import MapCard from "@/components/cards/MapCard";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Home() {
  const [reloadGraph, setReloadGraph] = useState(false);

  const handleReloadClick = () => {
    setReloadGraph(!reloadGraph);
  };

  return (
    <TooltipProvider>
      <ToastProvider>
        <div>
          <header className="p-4 flex justify-end space-x-4">
            <ReloadGraphButton onClick={handleReloadClick} />
            <UploadImageButton />
            <DarkModeToggle />
          </header>
          {reloadGraph ? <GeneralCard key={1} /> : <GeneralCard key={2} />}
          <MapCard />
        </div>
        <Toast />
      </ToastProvider>
    </TooltipProvider>
  );
}
