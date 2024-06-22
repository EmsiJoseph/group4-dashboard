"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/imageupload";
import { Paperclip } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        PNG or JPG only
      </p>
    </>
  );
};

const DropZone = ({
  files,
  setFiles,
  handleUpload,
}: {
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  handleUpload: () => void;
}) => {
  const { theme } = useTheme();

  const { toast } = useToast();

  const dropZoneConfig = {
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropZoneConfig}
      className={`relative rounded-lg p-2 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="grid gap-[16px]">
        <FileInput
          className={`outline-dashed outline-1 ${
            theme === "dark" ? "outline-gray-600" : "outline-gray-200"
          }`}
        >
          <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
            <FileSvgDraw />
          </div>
        </FileInput>
        <FileUploaderContent>
          <div className="grid gap-[16px]">
            {files &&
              files.length > 0 &&
              files.map((file, i) => (
                <FileUploaderItem key={i} index={i}>
                  <div key={i} className="mb-2"></div>
                  <Paperclip className="h-4 w-4 stroke-current" />
                  <span>{file.name}</span>
                </FileUploaderItem>
              ))}

            <Button
              variant="default"
              onClick={() => {
                handleUpload();
              }}
              disabled={!files || files.length === 0}
            >
              {files && files.length > 1 ? "Upload Images" : "Upload Image"}
            </Button>
          </div>
        </FileUploaderContent>
      </div>
    </FileUploader>
  );
};

export default DropZone;
