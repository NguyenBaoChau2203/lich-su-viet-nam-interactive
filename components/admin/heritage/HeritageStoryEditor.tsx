"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Edit2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { deleteStorySectionAction, reorderStorySectionsAction, saveStorySectionAction } from "@/lib/actions/heritage";
import type { Option } from "@/lib/queries/admin-content";

export type StorySourceInput = {
  source_id: string;
  locator: string;
  scope_note: string;
  source_title?: string;
};

export type StorySectionData = {
  id: string;
  sort_order: number;
  heading: string;
  body: string;
  certainty: "verified" | "approximate" | "disputed" | "editorial";
  uncertainty_note: string | null;
  sources: StorySourceInput[];
};

type HeritageStoryEditorProps = {
  locationId: string;
  sections: StorySectionData[];
  sources: Option[];
  readOnly?: boolean;
};

const CERTAINTY_LABELS: Record<StorySectionData["certainty"], string> = {
  verified: "Đã kiểm chứng",
  approximate: "Gần đúng / ước lượng",
  disputed: "Đang tranh luận",
  editorial: "Biên tập tổng thuật",
};

export function HeritageStoryEditor({
  locationId,
  sections,
  sources,
  readOnly,
}: HeritageStoryEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New section form state
  const [newHeading, setNewHeading] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCertainty, setNewCertainty] = useState<StorySectionData["certainty"]>("verified");
  const [newUncertaintyNote, setNewUncertaintyNote] = useState("");
  const [newSources, setNewSources] = useState<StorySourceInput[]>([]);

  // Source picker temporary state
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [locator, setLocator] = useState("");
  const [scopeNote, setScopeNote] = useState("");

  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  const handleAddSourceToNew = () => {
    if (!selectedSourceId || !locator.trim() || !scopeNote.trim()) return;
    const sourceObj = sources.find((s) => s.id === selectedSourceId);
    setNewSources([
      ...newSources,
      {
        source_id: selectedSourceId,
        locator: locator.trim(),
        scope_note: scopeNote.trim(),
        source_title: sourceObj?.label ?? selectedSourceId,
      },
    ]);
    setSelectedSourceId("");
    setLocator("");
    setScopeNote("");
  };

  const handleRemoveSourceFromNew = (idx: number) => {
    setNewSources(newSources.filter((_, i) => i !== idx));
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (readOnly) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedSections.length) return;

    const reordered = [...sortedSections];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const payload = reordered.map((s, i) => ({ id: s.id, sort_order: i + 1 }));
    const formData = new FormData();
    formData.append("location_id", locationId);
    formData.append("sections_order", JSON.stringify(payload));

    const res = await reorderStorySectionsAction({ status: "idle" }, formData);
    if (res.status === "error") {
      setStatusMessage(res.message ?? "Lỗi khi sắp xếp thứ tự.");
    }
  };

  return (
    <section aria-labelledby="heritage-story-editor" className="flex flex-col gap-4 rounded-card border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="heritage-story-editor" className="font-serif text-lg font-semibold text-foreground">
            Câu chuyện lịch sử ({sortedSections.length} phần)
          </h2>
          <p className="text-sm text-muted-foreground">
            Các phần câu chuyện theo thứ tự xuất hiện, gắn nguồn trích dẫn chi tiết (tối thiểu 3 phần để công bố).
          </p>
        </div>
        {!readOnly && !isAddingNew && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsAddingNew(true);
              setEditingId(null);
              setNewHeading("");
              setNewBody("");
              setNewCertainty("verified");
              setNewUncertaintyNote("");
              setNewSources([]);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Thêm phần câu chuyện
          </Button>
        )}
      </div>

      {statusMessage && (
        <div role="alert" className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-300">
          {statusMessage}
        </div>
      )}

      {/* Add New Section Form */}
      {isAddingNew && !readOnly && (
        <form
          action={async (formData) => {
            formData.append("sources_json", JSON.stringify(newSources));
            const res = await saveStorySectionAction({ status: "idle" }, formData);
            if (res.status === "success") {
              setIsAddingNew(false);
              setStatusMessage(null);
            } else {
              setStatusMessage(res.message ?? "Không thể lưu phần câu chuyện.");
            }
          }}
          className="flex flex-col gap-4 rounded-lg border border-primary/40 bg-surface p-4"
        >
          <input type="hidden" name="location_id" value={locationId} />
          <input type="hidden" name="sort_order" value={sortedSections.length + 1} />

          <h3 className="font-medium text-foreground">Thêm phần câu chuyện mới (vị trí {sortedSections.length + 1})</h3>

          <div>
            <label className="text-sm font-medium text-foreground">Tiêu đề phần</label>
            <Input
              name="heading"
              required
              minLength={2}
              maxLength={120}
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
              placeholder="Ví dụ: Bối cảnh, Chuyện ở nơi này, Ý nghĩa, Di tích ngày nay..."
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">Nội dung</label>
              <span className={`text-xs ${newBody.length < 80 ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}`}>
                {newBody.length}/4000 ký tự (tối thiểu 80)
              </span>
            </div>
            <Textarea
              name="body"
              required
              rows={5}
              minLength={80}
              maxLength={4000}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Nội dung kể chuyện ngắn gọn, chuẩn xác theo chương trình Lớp 12..."
              className="mt-1"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Độ tin cậy</label>
              <Select
                name="certainty"
                value={newCertainty}
                onChange={(e) => setNewCertainty(e.target.value as StorySectionData["certainty"])}
                className="mt-1"
              >
                {Object.entries(CERTAINTY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            {(newCertainty === "approximate" || newCertainty === "disputed") && (
              <div>
                <label className="text-sm font-medium text-foreground">Ghi chú độ tin cậy (bắt buộc)</label>
                <Input
                  name="uncertainty_note"
                  required
                  maxLength={500}
                  value={newUncertaintyNote}
                  onChange={(e) => setNewUncertaintyNote(e.target.value)}
                  placeholder="Nêu rõ lý do hoặc các cách diễn giải khác..."
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Sources for this section */}
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-3">
            <h4 className="text-sm font-semibold text-foreground">Nguồn trích dẫn ({newSources.length})</h4>

            {newSources.length > 0 && (
              <ul className="flex flex-col gap-2">
                {newSources.map((s, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2 rounded bg-muted/50 p-2 text-xs">
                    <div>
                      <span className="font-semibold">[{idx + 1}] {s.source_title}: </span>
                      <span className="text-muted-foreground">{s.locator} ({s.scope_note})</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSourceFromNew(idx)}
                      className="h-6 w-6 p-0 text-destructive"
                      aria-label="Xóa nguồn"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label className="text-xs text-muted-foreground">Chọn nguồn</label>
                <Select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="mt-0.5 text-xs"
                >
                  <option value="">— Chọn nguồn —</option>
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Vị trí (locator)</label>
                <Input
                  value={locator}
                  onChange={(e) => setLocator(e.target.value)}
                  placeholder="Trang 45 / mục 2 / đoạn 1"
                  className="mt-0.5 text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Phạm vi (scope note)</label>
                <Input
                  value={scopeNote}
                  onChange={(e) => setScopeNote(e.target.value)}
                  placeholder="Thời điểm / số liệu / sự kiện"
                  className="mt-0.5 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddSourceToNew}
                disabled={!selectedSourceId || !locator.trim() || !scopeNote.trim()}
              >
                Gắn nguồn vào mục này
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingNew(false)}>
              Hủy
            </Button>
            <Button type="submit" size="sm">
              Lưu phần câu chuyện
            </Button>
          </div>
        </form>
      )}

      {/* Sections List */}
      {sortedSections.length === 0 && !isAddingNew ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Chưa có phần câu chuyện nào. Bấm “Thêm phần câu chuyện” để bổ sung.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedSections.map((sec, idx) => {
            const isEditing = editingId === sec.id;
            return (
              <div
                key={sec.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {sec.sort_order}
                    </span>
                    <h3 className="font-semibold text-foreground">{sec.heading}</h3>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {CERTAINTY_LABELS[sec.certainty]}
                    </span>
                  </div>

                  {!readOnly && !isEditing && (
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, "up")}
                        aria-label="Di chuyển lên"
                        className="h-8 w-8 p-0"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={idx === sortedSections.length - 1}
                        onClick={() => handleMove(idx, "down")}
                        aria-label="Di chuyển xuống"
                        className="h-8 w-8 p-0"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(sec.id)}
                        aria-label="Sửa phần câu chuyện"
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <form
                        action={async (formData) => {
                          const res = await deleteStorySectionAction({ status: "idle" }, formData);
                          if (res.status === "error") {
                            setStatusMessage(res.message ?? "Lỗi khi xóa.");
                          }
                        }}
                      >
                        <input type="hidden" name="location_id" value={locationId} />
                        <input type="hidden" name="section_id" value={sec.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          aria-label="Xóa phần câu chuyện"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  )}
                </div>

                {isEditing && !readOnly ? (
                  <EditSectionForm
                    locationId={locationId}
                    section={sec}
                    sources={sources}
                    onClose={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{sec.body}</p>
                    {sec.uncertainty_note && (
                      <p className="rounded bg-amber-500/10 p-2 text-xs text-amber-800 dark:text-amber-200">
                        <span className="font-medium">Lưu ý độ tin cậy:</span> {sec.uncertainty_note}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                      <span className="font-medium">Nguồn trích dẫn:</span>
                      {sec.sources.length === 0 ? (
                        <span className="text-destructive">Chưa gắn nguồn</span>
                      ) : (
                        sec.sources.map((s, sIdx) => (
                          <span key={sIdx} className="rounded bg-muted px-1.5 py-0.5">
                            [{sIdx + 1}] {s.source_title ?? s.source_id}: {s.locator}
                          </span>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EditSectionForm({
  locationId,
  section,
  sources,
  onClose,
}: {
  locationId: string;
  section: StorySectionData;
  sources: Option[];
  onClose: () => void;
}) {
  const [heading, setHeading] = useState(section.heading);
  const [body, setBody] = useState(section.body);
  const [certainty, setCertainty] = useState<StorySectionData["certainty"]>(section.certainty);
  const [uncertaintyNote, setUncertaintyNote] = useState(section.uncertainty_note ?? "");
  const [sectionSources, setSectionSources] = useState<StorySourceInput[]>(section.sources);

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [locator, setLocator] = useState("");
  const [scopeNote, setScopeNote] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddSource = () => {
    if (!selectedSourceId || !locator.trim() || !scopeNote.trim()) return;
    const sourceObj = sources.find((s) => s.id === selectedSourceId);
    setSectionSources([
      ...sectionSources,
      {
        source_id: selectedSourceId,
        locator: locator.trim(),
        scope_note: scopeNote.trim(),
        source_title: sourceObj?.label ?? selectedSourceId,
      },
    ]);
    setSelectedSourceId("");
    setLocator("");
    setScopeNote("");
  };

  return (
    <form
      action={async (formData) => {
        formData.append("sources_json", JSON.stringify(sectionSources));
        const res = await saveStorySectionAction({ status: "idle" }, formData);
        if (res.status === "success") {
          onClose();
        } else {
          setErrorMsg(res.message ?? "Lỗi khi lưu phần câu chuyện.");
        }
      }}
      className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-background p-4"
    >
      <input type="hidden" name="location_id" value={locationId} />
      <input type="hidden" name="section_id" value={section.id} />
      <input type="hidden" name="sort_order" value={section.sort_order} />

      {errorMsg && (
        <div role="alert" className="rounded bg-destructive/10 p-2 text-xs text-destructive">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-foreground">Tiêu đề</label>
        <Input
          name="heading"
          required
          minLength={2}
          maxLength={120}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <div className="flex justify-between">
          <label className="text-xs font-medium text-foreground">Nội dung</label>
          <span className={`text-xs ${body.length < 80 ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}`}>
            {body.length}/4000 ký tự
          </span>
        </div>
        <Textarea
          name="body"
          required
          rows={5}
          minLength={80}
          maxLength={4000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-foreground">Độ tin cậy</label>
          <Select
            name="certainty"
            value={certainty}
            onChange={(e) => setCertainty(e.target.value as StorySectionData["certainty"])}
            className="mt-1 text-xs"
          >
            {Object.entries(CERTAINTY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        {(certainty === "approximate" || certainty === "disputed") && (
          <div>
            <label className="text-xs font-medium text-foreground">Ghi chú độ tin cậy</label>
            <Input
              name="uncertainty_note"
              required
              maxLength={500}
              value={uncertaintyNote}
              onChange={(e) => setUncertaintyNote(e.target.value)}
              className="mt-1 text-xs"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded border border-border bg-muted/30 p-3">
        <h4 className="text-xs font-semibold text-foreground">Nguồn trích dẫn ({sectionSources.length})</h4>
        {sectionSources.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {sectionSources.map((s, idx) => (
              <li key={idx} className="flex items-center justify-between gap-2 rounded bg-surface p-1.5 text-xs">
                <span>[{idx + 1}] {s.source_title ?? s.source_id}: {s.locator} ({s.scope_note})</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSectionSources(sectionSources.filter((_, i) => i !== idx))}
                  className="h-5 w-5 p-0 text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-2 sm:grid-cols-3">
          <Select
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            className="text-xs"
          >
            <option value="">— Chọn nguồn —</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
          <Input
            value={locator}
            onChange={(e) => setLocator(e.target.value)}
            placeholder="Vị trí (locator)"
            className="text-xs"
          />
          <Input
            value={scopeNote}
            onChange={(e) => setScopeNote(e.target.value)}
            placeholder="Phạm vi (scope note)"
            className="text-xs"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddSource}
            disabled={!selectedSourceId || !locator.trim() || !scopeNote.trim()}
            className="text-xs"
          >
            Gắn nguồn
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Đóng
        </Button>
        <Button type="submit" size="sm">
          Cập nhật mục này
        </Button>
      </div>
    </form>
  );
}
