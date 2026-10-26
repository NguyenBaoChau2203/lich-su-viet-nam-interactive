"use client";

import { Box } from "lucide-react";
import { useState } from "react";
import { ModelViewer } from "@/components/model3d/ModelViewer";
import { cn } from "@/lib/utils/cn";
import type { ModelSpec } from "@/lib/models3d/types";

type ModelGalleryProps = {
  specs: ModelSpec[];
  /** Nhãn của danh sách chọn (đọc bởi trình đọc màn hình). */
  label: string;
  debug?: boolean;
  className?: string;
};

/** Nhiều mô hình cùng chủ đề, chọn bằng thẻ; chỉ một khung WebGL hoạt động tại một thời điểm. */
export function ModelGallery({ specs, label, debug, className }: ModelGalleryProps) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const spec = specs[index];
  if (!spec) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % specs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index + specs.length - 1) % specs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = specs.length - 1;
    }
    if (next !== -1) {
      event.preventDefault();
      setIndex(next);
      document.getElementById(`model-tab-${specs[next].id}`)?.focus();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6",
        className
      )}
    >
      {specs.length > 1 && (
        <div
          role="tablist"
          aria-label={label}
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="order-1 flex flex-wrap gap-2 lg:col-start-2 lg:row-start-1 lg:flex-col lg:flex-nowrap lg:overflow-x-hidden lg:overflow-y-auto lg:max-h-[min(65vh,36rem)] lg:gap-2"
        >
          {specs.map((item, i) => (
            <button
              key={item.id}
              id={`model-tab-${item.id}`}
              type="button"
              role="tab"
              aria-label={item.title}
              aria-selected={i === index}
              aria-controls="model-panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              className={cn(
                "flex w-full items-start gap-3 rounded-card border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto lg:w-full",
                i === index
                  ? "border-accent bg-accent/10 text-foreground ring-1 ring-accent"
                  : "border-border bg-surface text-foreground hover:bg-muted"
              )}
              data-testid="model-tab"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted text-accent">
                <Box className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-semibold text-sm leading-tight text-foreground">{item.title}</span>
                {item.summary && (
                  <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.summary}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      <div
        id="model-panel"
        role={specs.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={specs.length > 1 ? `model-tab-${spec.id}` : undefined}
        className="order-2 min-w-0 lg:col-start-1 lg:row-start-1"
      >
        <ModelViewer key={spec.id} spec={spec} autoStart={started} onStarted={() => setStarted(true)} debug={debug} />
      </div>
    </div>
  );
}
