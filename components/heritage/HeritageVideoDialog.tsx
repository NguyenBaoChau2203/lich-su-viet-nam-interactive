"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { VideoEmbed } from "@/components/lesson/VideoEmbed";
import type { HeritageVideo } from "@/lib/heritage/types";

type Props = {
  video: HeritageVideo | null;
  siteName: string;
  open: boolean;
  onClose(): void;
};

export function HeritageVideoDialog({ video, siteName, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
        closeButtonRef.current?.focus({ preventScroll: true });
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  if (!video) return null;

  return (
    <dialog
      ref={dialogRef}
      className="heritage-video-dialog"
      aria-labelledby="heritage-video-heading"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{siteName}</p>
          <h3 id="heritage-video-heading" className="text-lg font-medium text-foreground">
            {video.title}
          </h3>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng video"
          className="p-1 text-muted-foreground hover:text-foreground rounded border border-border"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4">
        {open && <VideoEmbed video={{ ...video, note: video.note ?? "" }} />}
      </div>
    </dialog>
  );
}
