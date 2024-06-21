"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DropZone from "./dropzone";
import { useToast } from "@/components/ui/use-toast";
import { ToastProvider, Toast } from "@/components/ui/toast";
import { Spinner } from "../ui/spinner";

const UploadImageButton = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      toast({
        title: "Uploading...",
        description: "Uploading images. Please wait.",
      });

      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Files uploaded successfully. Analyzing...",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      <Dialog onOpenChange={(open) => !open && setFiles(null)}>
        <DialogTrigger asChild>
          <Button variant="default">Upload Image</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Make sure the scanned form is in PNG or JPG and has a good
              quality.
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="large">Uploading...</Spinner>
            </div>
          ) : (
            <DropZone
              files={files}
              setFiles={setFiles}
              handleUpload={handleUpload}
            />
          )}
        </DialogContent>
      </Dialog>
      <Toast />
    </ToastProvider>
  );
};

export default UploadImageButton;
