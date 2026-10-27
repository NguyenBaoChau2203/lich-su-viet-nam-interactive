"use client";

import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import type { EvidenceInput } from "@/lib/local-heroes/admin-types";
import type { Certainty } from "@/lib/local-heroes/types";
import type { Option } from "@/lib/queries/admin-content";

const CERTAINTY_LABELS: Record<Certainty, string> = {
  verified: "Đã thẩm định",
  approximate: "Gần đúng",
  disputed: "Còn tranh luận",
  editorial: "Quy ước biên tập",
};

const REQUIRED_CLAIMS = [
  { key: "identity", label: "Xác minh danh tính nhân vật", hint: "Nguồn chính thống chứng minh nhân thân, họ tên và sự tồn tại lịch sử của nhân vật." },
  { key: "contribution", label: "Xác minh đóng góp cách mạng", hint: "Nguồn khẳng định vai trò, hoạt động trong phong trào cách mạng/giải phóng dân tộc." },
  { key: "period", label: "Xác minh thời kỳ hoạt động (1858–1975)", hint: "Nguồn xác minh giai đoạn đóng góp có điểm giao với khung 1858–1975." },
] as const;

type CatalogSourcesEditorProps = {
  sources: EvidenceInput[];
  availableSources: Option[];
  onChange: (updated: EvidenceInput[]) => void;
  readOnly?: boolean;
};

export function CatalogSourcesEditor({
  sources,
  availableSources,
  onChange,
  readOnly,
}: CatalogSourcesEditorProps) {
  const getEvidence = (key: string): EvidenceInput => {
    const existing = sources.find((s) => s.claimKey === key);
    if (existing) return existing;
    return {
      claimKey: key,
      sourceId: availableSources[0]?.id || "",
      claimText: "",
      locator: "",
      scopeNote: "",
      certainty: "verified",
      uncertaintyNote: null,
    };
  };

  const handleUpdateClaim = (key: string, patch: Partial<EvidenceInput>) => {
    const current = getEvidence(key);
    const updated = { ...current, ...patch, claimKey: key };
    const filtered = sources.filter((s) => s.claimKey !== key);
    onChange([...filtered, updated]);
  };

  return (
    <section aria-labelledby="chung-cu-nguon" className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4">
      <div className="flex flex-col gap-1">
        <h2 id="chung-cu-nguon" className="font-serif text-lg font-semibold text-foreground">
          Nguồn thẩm định tiêu chuẩn (Danh mục toàn quốc)
        </h2>
        <p className="text-sm text-muted-foreground">
          Ba nguồn xác minh bắt buộc theo quy tắc kiểm chứng: Danh tính, Đóng góp cách mạng và Thời kỳ hoạt động.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {REQUIRED_CLAIMS.map((claim) => {
          const evidence = getEvidence(claim.key);

          return (
            <div key={claim.key} className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">
                  {claim.label} <span className="text-accent">*</span>
                </span>
                <span className="text-xs text-muted-foreground">{claim.hint}</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`claim-source-${claim.key}`} className="text-sm font-medium text-foreground">
                    Chọn nguồn tài liệu <span className="text-accent">*</span>
                  </label>
                  <Select
                    id={`claim-source-${claim.key}`}
                    value={evidence.sourceId}
                    disabled={readOnly}
                    onChange={(e) => handleUpdateClaim(claim.key, { sourceId: e.target.value })}
                  >
                    {availableSources.length === 0 ? (
                      <option value="">— Chưa có nguồn trong hệ thống —</option>
                    ) : (
                      availableSources.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))
                    )}
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`claim-locator-${claim.key}`} className="text-sm font-medium text-foreground">
                    Vị trí trong nguồn (trang, tập, mục...) <span className="text-accent">*</span>
                  </label>
                  <Input
                    id={`claim-locator-${claim.key}`}
                    value={evidence.locator}
                    disabled={readOnly}
                    placeholder="Ví dụ: Tập 2, tr. 145"
                    maxLength={2000}
                    onChange={(e) => handleUpdateClaim(claim.key, { locator: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`claim-text-${claim.key}`} className="text-sm font-medium text-foreground">
                    Dữ kiện trích lược từ nguồn
                  </label>
                  <Input
                    id={`claim-text-${claim.key}`}
                    value={evidence.claimText}
                    disabled={readOnly}
                    placeholder="Đoạn văn ngắn hoặc nội dung xác thực..."
                    maxLength={20000}
                    onChange={(e) => handleUpdateClaim(claim.key, { claimText: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`claim-cert-${claim.key}`} className="text-sm font-medium text-foreground">
                    Mức độ chắc chắn
                  </label>
                  <Select
                    id={`claim-cert-${claim.key}`}
                    value={evidence.certainty}
                    disabled={readOnly}
                    onChange={(e) => handleUpdateClaim(claim.key, { certainty: e.target.value as Certainty })}
                  >
                    {Object.entries(CERTAINTY_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {(evidence.certainty === "approximate" || evidence.certainty === "disputed") && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`claim-uncert-${claim.key}`} className="text-sm font-medium text-foreground">
                    Ghi chú điểm chưa chắc chắn / tranh luận <span className="text-accent">*</span>
                  </label>
                  <Input
                    id={`claim-uncert-${claim.key}`}
                    value={evidence.uncertaintyNote ?? ""}
                    disabled={readOnly}
                    placeholder="Nêu rõ mức độ sai lệch hoặc các tài liệu đối chiếu..."
                    maxLength={2000}
                    onChange={(e) => handleUpdateClaim(claim.key, { uncertaintyNote: e.target.value || null })}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
