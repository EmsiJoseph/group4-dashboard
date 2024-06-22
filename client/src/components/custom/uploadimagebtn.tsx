"use client";

import React, { useState, useRef } from "react";
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
import { Spinner } from "../ui/spinner";
import { useToast } from "@/components/ui/use-toast";

const UploadImageButton = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const previousStage = useRef("");

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Upload Success!",
          description: "Image/s uploaded successfully. Analyzing...",
        });
        setFiles(null);
        setDialogOpen(false);
        startPolling();
      } else {
        toast({
          title: "Error",
          description: "Failed to upload files",
          variant: "destructive",
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

  const startPolling = () => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:5000/status");
        const status = await response.json();

        if (status.stage !== previousStage.current && status.stage !== "Idle") {
          toast({
            title: status.stage,
            description: status.message,
          });
          previousStage.current = status.stage;
        }

        if (status.stage === "Success!") {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    }, 3000);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Upload Image</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Make sure the scanned form is in PNG or JPG and has a good quality.
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
  );
};

export default UploadImageButton;
