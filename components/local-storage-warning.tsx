"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useStorageMode } from "./storage-mode-provider";

const WARNING_DISMISSED_KEY = "rootly_local_storage_warning_dismissed";
const PAGES_TO_SHOW_WARNING = [
  "/notes",
  "/courses",
  "/daily-tracking",
  "/review",
  "/overview",
];

export function LocalStorageWarning() {
  const pathname = usePathname();
  const { mode } = useStorageMode();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if warning should be shown
    const shouldShow =
      mode === "localStorage" &&
      PAGES_TO_SHOW_WARNING.includes(pathname) &&
      localStorage.getItem(WARNING_DISMISSED_KEY) !== "true";

    setIsOpen(shouldShow);
  }, [mode, pathname]);

  const handleDismiss = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(WARNING_DISMISSED_KEY, "true");
    setIsOpen(false);
  };

  const handleSignIn = () => {
    // Navigate to login page with return URL
    window.location.href = `/login?next=${encodeURIComponent(pathname)}`;
  };

  // Don't render anything if not open - prevents Dialog from interfering with Toaster
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <DialogTitle>Using Local Storage</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Your data is stored locally in your browser. It will not sync across
            devices and may be lost if you clear your browser data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleSignIn}
            className="w-full sm:w-auto"
          >
            Sign in to sync
          </Button>
          <Button
            variant="default"
            onClick={handleDismiss}
            className="w-full sm:w-auto"
          >
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
