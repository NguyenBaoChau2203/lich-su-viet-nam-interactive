"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import type { MediaEvidenceInput } from "@/lib/local-heroes/admin-types";
import type { MediaItemData } from "@/components/admin/MediaManager";
import type { Option } from "@/lib/queries/admin-content";
import { resizeCommonsImage } from "@/lib/utils/text";

const DEPICTION_LABELS: Record<"portrait" | "historical_context", string> = {
  portrait: "Chân dung xác thực",
  historical_context: "Tư liệu bối cảnh (không phải chân dung)",
};

const USAGE_LABELS: Record<MediaEvidenceInput["usageBasis"], string> = {
  open_license: "Giấy phép mở (CC BY, CC BY-SA...)",
  public_domain: "Phạm vi công cộng (Public Domain)",
  permission: "Có thỏa thuận / cho phép sử dụng",
  coursework_reference: "Tham khảo nghiên cứu / học tập",
  unknown: "Chưa rõ bản quyền (chưa đủ điều kiện phát hành)",
};

type MediaEvidenceEditorProps = {
  media: MediaItemData[];
  sources: Option[];
  evidence: MediaEvidenceInput[];
  onChange: (updated: MediaEvidenceInput[]) => void;
  readOnly?: boolean;
};

export function MediaEvidenceEditor({
  media,
  sources,
  evidence,
  onChange,
  readOnly,
}: MediaEvidenceEditorProps) {
  const getEvidence = (mediaId: string): MediaEvidenceInput => {
    const existing = evidence.find((e) => e.mediaId === mediaId);
    if (existing) return existing;
    return {
      mediaId,
      depictionKind: "portrait",
      decision: "held",
      identitySourceId: sources[0]?.id || "",
      identityLocator: "",
      identityCertainty: "verified",
      usageBasis: "coursework_reference",
      usageSourceId: null,
      usageLocator: null,
      usageNote: "Sử dụng cho mục đích học tập và nghiên cứu.",
      checkedAt: new Date().toISOString(),
    };
  };

  const handleUpdate = (mediaId: string, patch: Partial<MediaEvidenceInput>) => {
    const current = getEvidence(mediaId);
    const updated = {
      ...current,
      ...patch,
      mediaId,
      checkedAt: patch.checkedAt ?? current.checkedAt ?? new Date().toISOString(),
    };
    const filtered = evidence.filter((e) => e.mediaId !== mediaId);
    onChange([...filtered, updated]);
  };

  if (media.length === 0) {
    return (
      <section aria-labelledby="chung-cu-anh" className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
        <h2 id="chung-cu-anh" className="font-serif text-lg font-semibold text-foreground">
          Chứng cứ ảnh và quyền sử dụng tư liệu
        </h2>
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          Chưa có ảnh nào trong kho tư liệu của nhân vật này. Hãy tải ảnh lên ở mục “Ảnh và tư liệu” phía dưới trước khi thiết lập chứng cứ ảnh.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="chung-cu-anh" className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4">
      <div className="flex flex-col gap-1">
        <h2 id="chung-cu-anh" className="font-serif text-lg font-semibold text-foreground">
          Chứng cứ ảnh và quyền sử dụng tư liệu ({media.length} ảnh)
        </h2>
        <p className="text-sm text-muted-foreground">
          Mỗi ảnh cần xác định rõ loại hình thể hiện (chân dung thật hay bối cảnh), nguồn nhận diện và căn cứ sử dụng hợp lệ trước khi được chấp nhận vào danh mục.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {media.map((item, idx) => {
          const ev = getEvidence(item.id);
          const isAccepted = ev.decision === "accepted";

          return (
            <div
              key={item.id}
              className={`flex flex-col gap-4 rounded-lg border p-4 transition-colors ${
                isAccepted ? "border-green-600/40 bg-background" : "border-border bg-muted/30"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="w-28 shrink-0">
                  <SafeImage
                    src={resizeCommonsImage(item.file_url, 300)}
                    alt={item.alt_text ?? "Ảnh tư liệu"}
                    className="aspect-[3/4] w-full rounded border border-border object-cover"
                    fallbackClassName="aspect-[3/4] w-full rounded border border-border"
                  />
                  <div className="mt-1 flex items-center justify-center">
                    {isAccepted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-800 dark:text-green-400">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Được chấp nhận
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Tạm giữ
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                    <span className="text-sm font-semibold text-foreground">
                      Ảnh #{idx + 1}: {item.caption || item.alt_text || "(Không có chú thích)"}
                    </span>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAccepted}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleUpdate(item.id, {
                            decision: e.target.checked ? "accepted" : "held",
                          })
                        }
                        className="rounded border-border text-accent focus:ring-accent"
                      />
                      <span>Chấp nhận đưa vào danh mục</span>
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label htmlFor={`media-depiction-${item.id}`} className="text-xs font-medium text-foreground">Loại hình thể hiện</label>
                      <Select
                        id={`media-depiction-${item.id}`}
                        value={ev.depictionKind}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleUpdate(item.id, {
                            depictionKind: e.target.value as "portrait" | "historical_context",
                          })
                        }
                      >
                        {Object.entries(DEPICTION_LABELS).map(([k, label]) => (
                          <option key={k} value={k}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor={`media-usage-${item.id}`} className="text-xs font-medium text-foreground">Căn cứ bản quyền / sử dụng</label>
                      <Select
                        id={`media-usage-${item.id}`}
                        value={ev.usageBasis}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleUpdate(item.id, {
                            usageBasis: e.target.value as MediaEvidenceInput["usageBasis"],
                          })
                        }
                      >
                        {Object.entries(USAGE_LABELS).map(([k, label]) => (
                          <option key={k} value={k}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label htmlFor={`media-identity-source-${item.id}`} className="text-xs font-medium text-foreground">Nguồn xác minh danh tính ảnh</label>
                      <Select
                        id={`media-identity-source-${item.id}`}
                        value={ev.identitySourceId}
                        disabled={readOnly}
                        onChange={(e) => handleUpdate(item.id, { identitySourceId: e.target.value })}
                      >
                        {sources.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor={`media-identity-locator-${item.id}`} className="text-xs font-medium text-foreground">Vị trí trong nguồn</label>
                      <Input
                        id={`media-identity-locator-${item.id}`}
                        value={ev.identityLocator}
                        disabled={readOnly}
                        placeholder="Tr. 12 hoặc link"
                        maxLength={2000}
                        onChange={(e) => handleUpdate(item.id, { identityLocator: e.target.value })}
                      />
                    </div>
                  </div>

                  {ev.usageBasis === "coursework_reference" ? (
                    <div className="flex flex-col gap-1">
                      <label htmlFor={`media-usage-note-${item.id}`} className="text-xs font-medium text-foreground">Ghi chú căn cứ sử dụng</label>
                      <Input
                        id={`media-usage-note-${item.id}`}
                        value={ev.usageNote ?? ""}
                        disabled={readOnly}
                        placeholder="Nêu rõ căn cứ sử dụng cho học tập và nghiên cứu..."
                        maxLength={2000}
                        onChange={(e) => handleUpdate(item.id, { usageNote: e.target.value || null })}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label htmlFor={`media-usage-source-${item.id}`} className="text-xs font-medium text-foreground">Nguồn chứng minh quyền sử dụng</label>
                        <Select
                          id={`media-usage-source-${item.id}`}
                          value={ev.usageSourceId ?? ""}
                          disabled={readOnly}
                          onChange={(e) => handleUpdate(item.id, { usageSourceId: e.target.value || null })}
                        >
                          <option value="">— Chọn nguồn —</option>
                          {sources.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor={`media-usage-locator-${item.id}`} className="text-xs font-medium text-foreground">Vị trí chứng minh</label>
                        <Input
                          id={`media-usage-locator-${item.id}`}
                          value={ev.usageLocator ?? ""}
                          disabled={readOnly}
                          placeholder="Link cấp phép hoặc số văn bản..."
                          maxLength={2000}
                          onChange={(e) => handleUpdate(item.id, { usageLocator: e.target.value || null })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
