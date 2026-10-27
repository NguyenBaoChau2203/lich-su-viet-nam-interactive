"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { catalogStoryInputs } from "@/lib/local-heroes/admin-form";
import { Field } from "@/components/admin/forms/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CatalogSourcesEditor } from "./CatalogSourcesEditor";
import { LocalityEditor } from "./LocalityEditor";
import { MediaEvidenceEditor } from "./MediaEvidenceEditor";
import { StoryEditor } from "./StoryEditor";
import type { MediaItemData } from "@/components/admin/MediaManager";
import type {
  EvidenceInput,
  LocalHeroAdminGraph,
  LocalityInput,
  MediaEvidenceInput,
  StoryInput,
} from "@/lib/local-heroes/admin-types";
import type { Option } from "@/lib/queries/admin-content";

export type FigureCatalogState = {
  contributionSummary: string;
  contributionStartYear: number | null;
  contributionEndYear: number | null;
  catalogAliases: string[];
  sources: EvidenceInput[];
  localities: LocalityInput[];
  stories: StoryInput[];
  mediaEvidence: MediaEvidenceInput[];
  expectedRevision: string | null;
};

type FigureCatalogEditorProps = {
  catalogGraph?: LocalHeroAdminGraph | null;
  sources: Option[];
  media: MediaItemData[];
  readOnly?: boolean;
  errors?: Record<string, string[]>;
  initialRawGraphJson?: string | null;
};

export function FigureCatalogEditor({
  catalogGraph,
  sources,
  media,
  readOnly,
  errors = {},
  initialRawGraphJson,
}: FigureCatalogEditorProps) {
  const [state, setState] = useState<FigureCatalogState>(() => {
    if (initialRawGraphJson) {
      try {
        const parsed = JSON.parse(initialRawGraphJson);
        return {
          contributionSummary: parsed.figure?.contributionSummary ?? "",
          contributionStartYear: parsed.figure?.contributionStartYear ?? null,
          contributionEndYear: parsed.figure?.contributionEndYear ?? null,
          catalogAliases: parsed.figure?.catalogAliases ?? [],
          sources: parsed.sources ?? [],
          localities: parsed.localities ?? [],
          stories: parsed.stories ?? [],
          mediaEvidence: parsed.mediaEvidence ?? [],
          expectedRevision: parsed.expectedRevision ?? catalogGraph?.revision ?? null,
        };
      } catch {
        // Fall back to catalogGraph if JSON is invalid
      }
    }

    if (catalogGraph) {
      return {
        contributionSummary: catalogGraph.figure.contributionSummary ?? "",
        contributionStartYear: catalogGraph.figure.contributionStartYear ?? null,
        contributionEndYear: catalogGraph.figure.contributionEndYear ?? null,
        catalogAliases: catalogGraph.figure.catalogAliases ?? [],
        sources: catalogGraph.sources ?? [],
        localities: catalogGraph.localities ?? [],
        stories: catalogStoryInputs(catalogGraph.stories),
        mediaEvidence: catalogGraph.mediaEvidence ?? [],
        expectedRevision: catalogGraph.revision ?? null,
      };
    }

    return {
      contributionSummary: "",
      contributionStartYear: null,
      contributionEndYear: null,
      catalogAliases: [],
      sources: [],
      localities: [],
      stories: [],
      mediaEvidence: [],
      expectedRevision: null,
    };
  });

  const [aliasesText, setAliasesText] = useState<string>(() =>
    state.catalogAliases.join(", "),
  );

  const handleAliasesChange = (textVal: string) => {
    setAliasesText(textVal);
    const split = textVal
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setState((prev) => ({ ...prev, catalogAliases: split }));
  };

  const serializedPayload = JSON.stringify({
    expectedRevision: state.expectedRevision,
    figure: {
      contributionSummary: state.contributionSummary || null,
      contributionStartYear: state.contributionStartYear,
      contributionEndYear: state.contributionEndYear,
      catalogAliases: state.catalogAliases,
    },
    sources: state.sources,
    localities: state.localities,
    stories: catalogStoryInputs(state.stories),
    mediaEvidence: state.mediaEvidence,
  });

  const readiness = catalogGraph?.readiness;
  const isReady = readiness && readiness.blocking.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden inputs for atomic graph save */}
      <input type="hidden" name="catalog_graph_json" value={serializedPayload} />
      <input type="hidden" name="expected_revision" value={state.expectedRevision ?? ""} />

      {/* Readiness status overview */}
      {readiness && (
        <section
          aria-labelledby="muc-san-sang"
          className={`flex flex-col gap-3 rounded-card border p-4 ${
            isReady
              ? "border-green-600/40 bg-green-600/5 text-green-900 dark:text-green-200"
              : "border-accent/30 bg-accent/5 text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            {isReady ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="h-5 w-5 text-accent shrink-0" aria-hidden="true" />
            )}
            <h2 id="muc-san-sang" className="font-serif text-lg font-bold">
              {isReady
                ? "Hồ sơ đủ điều kiện gửi duyệt"
                : `Hồ sơ chưa đủ điều kiện phát hành (còn ${readiness.blocking.length} mục bắt buộc)`}
            </h2>
          </div>

          {!isReady && (
            <ul className="flex flex-col gap-1.5 pl-7 text-sm">
              {readiness.blocking.map((item, idx) => (
                <li key={idx} className="list-disc text-accent">
                  {item.message}
                </li>
              ))}
            </ul>
          )}

          {readiness.warnings.length > 0 && (
            <div className="mt-1 flex flex-col gap-1 pl-7 text-sm text-yellow-800 dark:text-yellow-300">
              <span className="font-medium flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Khuyến nghị bổ sung:
              </span>
              <ul className="flex flex-col gap-1 pl-5">
                {readiness.warnings.map((item, idx) => (
                  <li key={idx} className="list-disc">
                    {item.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* General Catalog Information */}
      <section aria-labelledby="thong-tin-danh-muc" className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4">
        <h2 id="thong-tin-danh-muc" className="font-serif text-lg font-semibold text-foreground">
          Đóng góp cách mạng và thời kỳ lịch sử
        </h2>

        <Field
          name="contributionSummary"
          label="Tóm tắt đóng góp tiêu biểu"
          required
          error={errors["figure.contributionSummary"]?.[0]}
          hint="Khái quát ngắn gọn (1–600 ký tự) về phong trào, chiến dịch hoặc cống hiến lớn nhất của nhân vật."
        >
          {(props) => (
            <Textarea
              {...props}
              rows={3}
              value={state.contributionSummary}
              disabled={readOnly}
              maxLength={600}
              placeholder="Ví dụ: Lãnh đạo cuộc khởi nghĩa Ba Đình trong phong trào Cần Vương chống thực dân Pháp..."
              onChange={(e) => setState((prev) => ({ ...prev, contributionSummary: e.target.value }))}
            />
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="contributionStartYear"
            label="Năm bắt đầu đóng góp"
            required
            error={errors["figure.contributionStartYear"]?.[0]}
            hint="Thời kỳ đóng góp phải có điểm giao với giai đoạn 1858–1975."
          >
            {(props) => (
              <Input
                {...props}
                type="number"
                value={state.contributionStartYear ?? ""}
                disabled={readOnly}
                placeholder="1885"
                min={1}
                max={2200}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    contributionStartYear: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            )}
          </Field>

          <Field
            name="contributionEndYear"
            label="Năm kết thúc đóng góp"
            required
            error={errors["figure.contributionEndYear"]?.[0]}
            hint="Không được trước năm bắt đầu đóng góp."
          >
            {(props) => (
              <Input
                {...props}
                type="number"
                value={state.contributionEndYear ?? ""}
                disabled={readOnly}
                placeholder="1887"
                min={1}
                max={2200}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    contributionEndYear: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            )}
          </Field>
        </div>

        <Field
          name="catalogAliases"
          label="Bí danh trong danh mục"
          hint="Các bí danh hoặc tên gọi hoạt động cách mạng (ngăn cách bằng dấu phẩy). Cần nguồn xác minh nếu có bí danh."
        >
          {(props) => (
            <Input
              {...props}
              value={aliasesText}
              disabled={readOnly}
              placeholder="Ví dụ: Anh Ba, Nguyễn Ái Quốc, Chín Thầu"
              onChange={(e) => handleAliasesChange(e.target.value)}
            />
          )}
        </Field>
      </section>

      {/* Core Claims / Sources */}
      <CatalogSourcesEditor
        sources={state.sources}
        availableSources={sources}
        onChange={(sources) => setState((prev) => ({ ...prev, sources }))}
        readOnly={readOnly}
      />

      {/* Locality Editor */}
      <LocalityEditor
        localities={state.localities}
        sources={sources}
        onChange={(localities) => setState((prev) => ({ ...prev, localities }))}
        readOnly={readOnly}
        errors={errors}
      />

      {/* Story Editor */}
      <StoryEditor
        stories={state.stories}
        sources={sources}
        onChange={(stories) => setState((prev) => ({ ...prev, stories }))}
        readOnly={readOnly}
        errors={errors}
      />

      {/* Media Evidence Editor */}
      <MediaEvidenceEditor
        media={media}
        sources={sources}
        evidence={state.mediaEvidence}
        onChange={(mediaEvidence) => setState((prev) => ({ ...prev, mediaEvidence }))}
        readOnly={readOnly}
      />
    </div>
  );
}
