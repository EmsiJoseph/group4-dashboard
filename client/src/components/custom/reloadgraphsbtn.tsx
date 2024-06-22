import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ReloadGraphButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="ghost" onClick={onClick}>
      <RefreshCw className="h-5 w-5" />
    </Button>
  );
};

export default ReloadGraphButton;
