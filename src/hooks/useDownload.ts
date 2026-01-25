import { useState } from "react";
import { toast } from "sonner";

interface DownloadItem {
  id: number;
  title: string;
  image: string;
  progress: number;
  status: "queued" | "downloading" | "completed" | "failed";
}

// Simulated download storage
const downloadQueue: Map<number, DownloadItem> = new Map();

export const useDownload = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const startDownload = (id: number, title: string, image: string) => {
    // Check if already downloading
    if (downloadQueue.has(id)) {
      toast.info(`"${title}" is already in your downloads`);
      return;
    }

    const item: DownloadItem = {
      id,
      title,
      image,
      progress: 0,
      status: "downloading",
    };

    downloadQueue.set(id, item);
    
    toast.success(`Starting download: "${title}"`, {
      description: "Your download will be available offline soon",
    });

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const completed = downloadQueue.get(id);
        if (completed) {
          completed.status = "completed";
          completed.progress = 100;
          downloadQueue.set(id, completed);
        }
        
        toast.success(`Download complete: "${title}"`, {
          description: "Available in your downloads",
        });
      } else {
        const updating = downloadQueue.get(id);
        if (updating) {
          updating.progress = Math.min(progress, 99);
          downloadQueue.set(id, updating);
        }
      }
      
      setDownloads(Array.from(downloadQueue.values()));
    }, 500);

    setDownloads(Array.from(downloadQueue.values()));
  };

  const getDownloads = () => Array.from(downloadQueue.values());

  const isDownloaded = (id: number) => {
    const item = downloadQueue.get(id);
    return item?.status === "completed";
  };

  const isDownloading = (id: number) => {
    const item = downloadQueue.get(id);
    return item?.status === "downloading";
  };

  const getProgress = (id: number) => {
    return downloadQueue.get(id)?.progress || 0;
  };

  const removeDownload = (id: number) => {
    const item = downloadQueue.get(id);
    if (item) {
      downloadQueue.delete(id);
      setDownloads(Array.from(downloadQueue.values()));
      toast.info(`Removed "${item.title}" from downloads`);
    }
  };

  return {
    downloads,
    startDownload,
    getDownloads,
    isDownloaded,
    isDownloading,
    getProgress,
    removeDownload,
  };
};
