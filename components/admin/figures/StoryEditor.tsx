"use client";

import { Plus, Trash2, Star, BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { EvidenceInput, StoryInput } from "@/lib/local-heroes/admin-types";
import type { Certainty } from "@/lib/local-heroes/types";
import type { Option } from "@/lib/queries/admin-content";
import { slugify } from "@/lib/utils/slugify";

const CERTAINTY_LABELS: Record<Certainty, string> = {
  verified: "Đã thẩm định",
  approximate: "Gần đúng",
  disputed: "Còn tranh luận",
  editorial: "Quy ước biên tập",
};

function countStoryWords(text: string): number {
  return text
    .replace(/\[\[cite:[^\]]+\]\]/gu, "")
    .replace(/^\s*#{1,6}\s+/gmu, "")
    .replace(/\*\*|__/gu, "")
    .trim()
    .split(/\p{White_Space}+/u)
    .filter(Boolean).length;
}

type StoryEditorProps = {
  stories: StoryInput[];
  sources: Option[];
  onChange: (updated: StoryInput[]) => void;
  readOnly?: boolean;
  errors?: Record<string, string[]>;
};

export function StoryEditor({ stories, sources, onChange, readOnly }: StoryEditorProps) {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(stories[0]?.id ?? null);

  const handleAddStory = () => {
    const nextOrder = stories.length;
    const isFirst = stories.length === 0;
    const newStory: StoryInput = {
      id: crypto.randomUUID(),
      title: "Câu chuyện lịch sử mới",
      slug: `cau-chuyen-${nextOrder + 1}`,
      summary: "",
      body: "",
      sortOrder: nextOrder,
      isPrimary: isFirst,
      sources: [],
    };
    onChange([...stories, newStory]);
    setActiveStoryId(newStory.id);
  };

  const handleRemoveStory = (id: string) => {
    const remaining = stories.filter((s) => s.id !== id);
    if (stories.find((s) => s.id === id)?.isPrimary && remaining.length > 0) {
      remaining[0].isPrimary = true;
    }
    onChange(remaining);
    if (activeStoryId === id) {
      setActiveStoryId(remaining[0]?.id ?? null);
    }
  };

  const handleUpdateStory = (id: string, patch: Partial<StoryInput>) => {
    onChange(
      stories.map((s) => {
        if (s.id !== id) {
          if (patch.isPrimary) {
            return { ...s, isPrimary: false };
          }
          return s;
        }
        return { ...s, ...patch };
      }),
    );
  };

  const handleAddCitation = (storyId: string) => {
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    const nextKey = `ref_${story.sources.length + 1}`;
    const newEvidence: EvidenceInput = {
      claimKey: nextKey,
      sourceId: sources[0]?.id || "",
      claimText: "",
      locator: "",
      scopeNote: "",
      certainty: "verified",
      uncertaintyNote: null,
    };
    handleUpdateStory(storyId, {
      sources: [...story.sources, newEvidence],
    });
  };

  const handleRemoveCitation = (storyId: string, index: number) => {
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    handleUpdateStory(storyId, {
      sources: story.sources.filter((_, i) => i !== index),
    });
  };

  const handleUpdateCitation = (storyId: string, index: number, patch: Partial<EvidenceInput>) => {
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    handleUpdateStory(storyId, {
      sources: story.sources.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    });
  };

  const activeStory = stories.find((s) => s.id === activeStoryId) ?? stories[0];

  return (
    <section aria-labelledby="cau-chuyen-lich-su" className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4">
      <div className="flex flex-col gap-1">
        <h2 id="cau-chuyen-lich-su" className="font-serif text-lg font-semibold text-foreground">
          Câu chuyện lịch sử và trích dẫn nguồn
        </h2>
        <p className="text-sm text-muted-foreground">
          Mỗi nhân vật cần đúng 1 truyện chính (độ dài tiêu chuẩn 350–700 từ). Mỗi đoạn văn cần có trích dẫn nguồn dạng{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground">[[cite:mã_nguồn]]</code>.
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-6 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Chưa có câu chuyện nào cho nhân vật này.</p>
          {!readOnly && (
            <Button type="button" variant="secondary" size="sm" onClick={handleAddStory}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Thêm câu chuyện đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
            {stories.map((story, idx) => {
              const isActive = story.id === activeStory?.id;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveStoryId(story.id)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-accent bg-accent/10 text-accent font-semibold"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {story.isPrimary && <Star className="h-3.5 w-3.5 fill-gold-deep text-gold-deep" aria-label="Truyện chính" />}
                  <span>
                    #{idx + 1}: {story.title || "(Chưa đặt tiêu đề)"}
                  </span>
                </button>
              );
            })}

            {!readOnly && (
              <Button type="button" variant="ghost" size="sm" onClick={handleAddStory}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Thêm truyện
              </Button>
            )}
          </div>

          {activeStory && (
            <div className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeStory.isPrimary}
                      disabled={readOnly}
                      onChange={(e) => handleUpdateStory(activeStory.id, { isPrimary: e.target.checked })}
                      className="rounded border-border text-accent focus:ring-accent"
                    />
                    <span>Đặt làm truyện chính (yêu cầu bắt buộc để phát hành)</span>
                  </label>
                </div>

                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStory(activeStory.id)}
                    className="text-muted-foreground hover:text-accent"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Xóa câu chuyện
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`story-title-${activeStory.id}`} className="text-sm font-medium text-foreground">
                    Tiêu đề câu chuyện <span className="text-accent">*</span>
                  </label>
                  <Input
                    id={`story-title-${activeStory.id}`}
                    value={activeStory.title}
                    disabled={readOnly}
                    maxLength={200}
                    onChange={(e) => {
                      const title = e.target.value;
                      handleUpdateStory(activeStory.id, {
                        title,
                        slug: activeStory.slug || slugify(title),
                      });
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`story-slug-${activeStory.id}`} className="text-sm font-medium text-foreground">
                    Định danh (slug) <span className="text-accent">*</span>
                  </label>
                  <Input
                    id={`story-slug-${activeStory.id}`}
                    value={activeStory.slug}
                    disabled={readOnly}
                    maxLength={160}
                    onChange={(e) => handleUpdateStory(activeStory.id, { slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`story-summary-${activeStory.id}`} className="text-sm font-medium text-foreground">
                  Tóm tắt câu chuyện
                </label>
                <Textarea
                  id={`story-summary-${activeStory.id}`}
                  rows={2}
                  value={activeStory.summary}
                  disabled={readOnly}
                  maxLength={600}
                  placeholder="Khái quát ngắn gọn về nội dung sự việc được kể..."
                  onChange={(e) => handleUpdateStory(activeStory.id, { summary: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor={`story-body-${activeStory.id}`} className="text-sm font-medium text-foreground">
                    Nội dung câu chuyện <span className="text-accent">*</span>
                  </label>
                  {(() => {
                    const count = countStoryWords(activeStory.body);
                    const isLengthOk = !activeStory.isPrimary || (count >= 350 && count <= 700);
                    return (
                      <span className={`text-xs font-medium ${isLengthOk ? "text-muted-foreground" : "text-accent"}`}>
                        Số từ: {count} {activeStory.isPrimary && "(tiêu chuẩn truyện chính: 350–700 từ)"}
                      </span>
                    );
                  })()}
                </div>
                <Textarea
                  id={`story-body-${activeStory.id}`}
                  rows={8}
                  value={activeStory.body}
                  disabled={readOnly}
                  maxLength={20000}
                  placeholder="Nội dung tường thuật theo định dạng Markdown. Mỗi đoạn văn cần trích dẫn nguồn, ví dụ: ...trong chiến dịch [[cite:ref_1]]."
                  onChange={(e) => handleUpdateStory(activeStory.id, { body: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Danh sách nguồn trích dẫn trong câu chuyện này ({activeStory.sources.length})
                  </span>
                  {!readOnly && (
                    <Button type="button" variant="secondary" size="sm" onClick={() => handleAddCitation(activeStory.id)}>
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Thêm mã trích dẫn
                    </Button>
                  )}
                </div>

                {activeStory.sources.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Chưa có trích dẫn nào. Hãy thêm mã trích dẫn để chèn vào nội dung (ví dụ: [[cite:ref_1]]).
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {activeStory.sources.map((cit, cIdx) => (
                      <li key={cIdx} className="flex flex-col gap-2 rounded border border-border bg-background p-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-accent">
                            [[cite:{cit.claimKey}]]
                          </span>
                          {!readOnly && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCitation(activeStory.id, cIdx)}
                              className="text-xs text-muted-foreground hover:text-accent"
                            >
                              Xóa trích dẫn
                            </button>
                          )}
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3">
                          <div className="flex flex-col gap-1">
                            <label htmlFor={`story-claim-key-${activeStory.id}-${cIdx}`} className="text-xs text-muted-foreground">Mã trích dẫn</label>
                            <Input
                              id={`story-claim-key-${activeStory.id}-${cIdx}`}
                              value={cit.claimKey}
                              disabled={readOnly}
                              placeholder="ref_1"
                              onChange={(e) => handleUpdateCitation(activeStory.id, cIdx, { claimKey: e.target.value })}
                            />
                          </div>

                          <div className="flex flex-col gap-1 sm:col-span-2">
                            <label htmlFor={`story-claim-source-${activeStory.id}-${cIdx}`} className="text-xs text-muted-foreground">Nguồn tài liệu</label>
                            <Select
                              id={`story-claim-source-${activeStory.id}-${cIdx}`}
                              value={cit.sourceId}
                              disabled={readOnly}
                              onChange={(e) => handleUpdateCitation(activeStory.id, cIdx, { sourceId: e.target.value })}
                            >
                              {sources.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <label htmlFor={`story-claim-locator-${activeStory.id}-${cIdx}`} className="text-xs text-muted-foreground">Vị trí trong nguồn (trang, tập...)</label>
                            <Input
                              id={`story-claim-locator-${activeStory.id}-${cIdx}`}
                              value={cit.locator}
                              disabled={readOnly}
                              placeholder="Tr. 120-125"
                              onChange={(e) => handleUpdateCitation(activeStory.id, cIdx, { locator: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label htmlFor={`story-claim-certainty-${activeStory.id}-${cIdx}`} className="text-xs text-muted-foreground">Độ chắc chắn</label>
                            <Select
                              id={`story-claim-certainty-${activeStory.id}-${cIdx}`}
                              value={cit.certainty}
                              disabled={readOnly}
                              onChange={(e) => handleUpdateCitation(activeStory.id, cIdx, { certainty: e.target.value as Certainty })}
                            >
                              {Object.entries(CERTAINTY_LABELS).map(([k, label]) => (
                                <option key={k} value={k}>
                                  {label}
                                </option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-muted-foreground">Dữ kiện trích dẫn nguyên văn / tóm lược</label>
                          <Input
                            value={cit.claimText}
                            disabled={readOnly}
                            placeholder="Dữ kiện cụ thể được nguồn này chứng minh..."
                            onChange={(e) => handleUpdateCitation(activeStory.id, cIdx, { claimText: e.target.value })}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
