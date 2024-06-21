import ResponsesDistribution from "@/components/cards/ResponsesDistribution";
import { Card } from "@/components/ui/card";
import DarkModeToggle from "@/components/custom/darkmodetoggle";
import UploadImageButton from "@/components/custom/uploadimagebtn";
import { ToastProvider, Toast } from "@/components/ui/toast";

export default function Home() {
  return (
    <ToastProvider>
      <div>
        <header className="p-4 flex justify-end space-x-4">
          <UploadImageButton />
          <DarkModeToggle />
        </header>
        <div className="grid grid-cols-2 gap-[32px]">
          <ResponsesDistribution />
          <div className="grid gap-[32px]">
            <Card />
            <Card />
          </div>
        </div>
      </div>
      <Toast />
    </ToastProvider>
  );
}
