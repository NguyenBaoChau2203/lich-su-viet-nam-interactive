"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { LocalityInput } from "@/lib/local-heroes/admin-types";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import type { Certainty, LocalityCode, RelationshipKind } from "@/lib/local-heroes/types";
import type { Option } from "@/lib/queries/admin-content";

const RELATIONSHIP_LABELS: Record<RelationshipKind, string> = {
  birthplace: "Nơi sinh",
  home_origin: "Quê quán / Nguyên quán",
  activity: "Địa bàn hoạt động",
  commemoration: "Tưởng niệm / Ghi nhớ",
};

const CERTAINTY_LABELS: Record<Certainty, string> = {
  verified: "Đã thẩm định",
  approximate: "Gần đúng",
  disputed: "Còn tranh luận",
  editorial: "Quy ước biên tập",
};

type LocalityEditorProps = {
  localities: LocalityInput[];
  sources: Option[];
  onChange: (updated: LocalityInput[]) => void;
  readOnly?: boolean;
  errors?: Record<string, string[]>;
};

export function LocalityEditor({ localities, sources, onChange, readOnly, errors = {} }: LocalityEditorProps) {
  const [selectedLocality, setSelectedLocality] = useState<LocalityCode>("01");
  const [selectedKind, setSelectedKind] = useState<RelationshipKind>("birthplace");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAdd = () => {
    setLocalError(null);
    const existing = localities.find(
      (l) => l.localityCode === selectedLocality && l.kind === selectedKind,
    );
    if (existing) {
      setLocalError("Quan hệ địa phương này đã tồn tại trong danh sách.");
      return;
    }
    const defaultSourceId = sources[0]?.id || "";
    const newLocality: LocalityInput = {
      id: crypto.randomUUID(),
      localityCode: selectedLocality,
      kind: selectedKind,
      historicalPlaceLabel: "",
      explanation: "",
      claimKey: `locality:${selectedLocality}:${selectedKind}`,
      primarySourceId: defaultSourceId,
      certainty: "verified",
      uncertaintyNote: null,
    };
    onChange([...localities, newLocality]);
  };

  const handleRemove = (id: string) => {
    onChange(localities.filter((l) => l.id !== id));
  };

  const handleUpdate = (id: string, patch: Partial<LocalityInput>) => {
    onChange(
      localities.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, ...patch };
        updated.claimKey = `locality:${updated.localityCode}:${updated.kind}`;
        return updated;
      }),
    );
  };

  return (
    <section aria-labelledby="dia-phuong-lien-ket" className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4">
      <div className="flex flex-col gap-1">
        <h2 id="dia-phuong-lien-ket" className="font-serif text-lg font-semibold text-foreground">
          Địa phương liên kết (34 tỉnh / thành phố)
        </h2>
        <p className="text-sm text-muted-foreground">
          Gắn nhân vật với một hoặc nhiều địa phương trong danh mục chuẩn VN-34-2025. Cần ít nhất một liên kết xác minh (nơi sinh, quê quán hoặc hoạt động).
        </p>
      </div>

      {localError && (
        <p role="alert" className="text-sm font-medium text-accent">
          {localError}
        </p>
      )}

      {localities.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          Chưa gắn với địa phương nào. Hãy chọn địa phương và loại quan hệ bên dưới để thêm.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {localities.map((item, index) => {
            const locName = LOCALITIES.find((l) => l.code === item.localityCode)?.officialName ?? item.localityCode;
            const errKey = `localities.${index}`;
            const fieldError = Object.entries(errors)
              .filter(([k]) => k.startsWith(errKey))
              .map(([, v]) => v.join(", "))
              .join("; ");

            return (
              <li key={item.id} className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                  <span className="font-medium text-foreground">
                    #{index + 1}: {locName} — <span className="text-gold-deep">{RELATIONSHIP_LABELS[item.kind]}</span>
                  </span>
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Xóa liên kết ${locName}`}
                      className="text-muted-foreground hover:text-accent"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Xóa
                    </Button>
                  )}
                </div>

                {fieldError && (
                  <p role="alert" className="text-sm text-accent">
                    {fieldError}
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`loc-kind-${item.id}`} className="text-sm font-medium text-foreground">
                      Loại quan hệ
                    </label>
                    <Select
                      id={`loc-kind-${item.id}`}
                      value={item.kind}
                      disabled={readOnly}
                      onChange={(e) => handleUpdate(item.id, { kind: e.target.value as RelationshipKind })}
                    >
                      {Object.entries(RELATIONSHIP_LABELS).map(([k, label]) => (
                        <option key={k} value={k}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`loc-hist-${item.id}`} className="text-sm font-medium text-foreground">
                      Tên địa danh lịch sử <span className="text-accent">*</span>
                    </label>
                    <Input
                      id={`loc-hist-${item.id}`}
                      value={item.historicalPlaceLabel}
                      disabled={readOnly}
                      placeholder="Ví dụ: Làng Sen, Nam Đàn, Nghệ An"
                      maxLength={500}
                      onChange={(e) => handleUpdate(item.id, { historicalPlaceLabel: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`loc-exp-${item.id}`} className="text-sm font-medium text-foreground">
                    Giải thích mối liên hệ <span className="text-accent">*</span>
                  </label>
                  <Textarea
                    id={`loc-exp-${item.id}`}
                    rows={2}
                    value={item.explanation}
                    disabled={readOnly}
                    placeholder="Mô tả cụ thể căn cứ lịch sử gắn nhân vật với địa phương này..."
                    maxLength={2000}
                    onChange={(e) => handleUpdate(item.id, { explanation: e.target.value })}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`loc-src-${item.id}`} className="text-sm font-medium text-foreground">
                      Nguồn tham khảo chính <span className="text-accent">*</span>
                    </label>
                    <Select
                      id={`loc-src-${item.id}`}
                      value={item.primarySourceId}
                      disabled={readOnly}
                      onChange={(e) => handleUpdate(item.id, { primarySourceId: e.target.value })}
                    >
                      {sources.length === 0 ? (
                        <option value="">— Chưa có nguồn trong hệ thống —</option>
                      ) : (
                        sources.map((src) => (
                          <option key={src.id} value={src.id}>
                            {src.label}
                          </option>
                        ))
                      )}
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`loc-cert-${item.id}`} className="text-sm font-medium text-foreground">
                      Mức độ chắc chắn
                    </label>
                    <Select
                      id={`loc-cert-${item.id}`}
                      value={item.certainty}
                      disabled={readOnly}
                      onChange={(e) => handleUpdate(item.id, { certainty: e.target.value as Certainty })}
                    >
                      {Object.entries(CERTAINTY_LABELS).map(([k, label]) => (
                        <option key={k} value={k}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {(item.certainty === "approximate" || item.certainty === "disputed") && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`loc-uncert-${item.id}`} className="text-sm font-medium text-foreground">
                      Ghi chú điểm chưa chắc chắn / tranh luận <span className="text-accent">*</span>
                    </label>
                    <Input
                      id={`loc-uncert-${item.id}`}
                      value={item.uncertaintyNote ?? ""}
                      disabled={readOnly}
                      placeholder="Giải thích rõ cơ sở suy luận hoặc các luồng ý kiến khác nhau..."
                      maxLength={2000}
                      onChange={(e) => handleUpdate(item.id, { uncertaintyNote: e.target.value || null })}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Select
            aria-label="Chọn địa phương để thêm"
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value as LocalityCode)}
            className="min-w-0 flex-1 sm:max-w-xs"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc.code} value={loc.code}>
                [{loc.code}] {loc.officialName}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Chọn loại quan hệ để thêm"
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value as RelationshipKind)}
            className="min-w-0 flex-1 sm:max-w-xs"
          >
            {Object.entries(RELATIONSHIP_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </Select>

          <Button type="button" variant="secondary" size="md" onClick={handleAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Thêm địa phương
          </Button>
        </div>
      )}
    </section>
  );
}
