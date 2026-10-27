"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, valueReader } from "@/components/admin/forms/Field";
import { FormFooter } from "@/components/admin/forms/FormFooter";
import { TitleSlugFields } from "@/components/admin/forms/TitleSlugFields";
import { FigureCatalogEditor } from "@/components/admin/figures/FigureCatalogEditor";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { MediaItemData } from "@/components/admin/MediaManager";
import { saveFigureAction } from "@/lib/actions/content";
import { initialActionState } from "@/lib/actions/state";
import { contentPaths } from "@/lib/admin/content-kinds";
import type { LocalHeroAdminGraph } from "@/lib/local-heroes/admin-types";
import type { Option } from "@/lib/queries/admin-content";

type FigureFormProps = {
  id?: string;
  initial: {
    name: string;
    slug: string;
    other_names: string | null;
    birth_year: number | null;
    death_year: number | null;
    biography: string | null;
    portrait_url: string | null;
    is_local_hero?: boolean;
  };
  readOnly?: boolean;
  catalogGraph?: LocalHeroAdminGraph | null;
  sources?: Option[];
  media?: MediaItemData[];
};

/** Form nhân vật (UC07) — hỗ trợ nhân vật thông thường và nhân vật danh mục lịch sử địa phương. */
export function FigureForm({
  id,
  initial,
  readOnly,
  catalogGraph,
  sources = [],
  media = [],
}: FigureFormProps) {
  const [state, formAction, pending] = useActionState(saveFigureAction, initialActionState);
  const value = valueReader(state, initial);
  const errors = state.fieldErrors ?? {};

  // Giữ trạng thái checkbox danh mục: ưu tiên giá trị vừa submit, rồi tới ban đầu
  const initialIsCatalog = Boolean(initial.is_local_hero || catalogGraph);
  const [isCatalog, setIsCatalog] = useState<boolean>(() => {
    if (state.values?.is_local_hero) {
      return state.values.is_local_hero === "true" || state.values.is_local_hero === "on";
    }
    return initialIsCatalog;
  });

  return (
    <form action={formAction} noValidate className="flex max-w-3xl flex-col gap-6">
      {id && <input type="hidden" name="id" value={id} />}
      <FormMessage state={state} />

      <fieldset disabled={readOnly} className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0">
        <TitleSlugFields
          titleName="name"
          titleLabel="Tên nhân vật"
          initialTitle={value("name")}
          initialSlug={value("slug")}
          isNew={!id}
          titleError={errors.name}
          slugError={errors.slug}
        />

        <Field
          name="other_names"
          label="Tên khác"
          error={errors.other_names}
          hint="Bí danh, tên gọi thời trẻ… ngăn cách bằng dấu phẩy."
        >
          {(props) => <Input {...props} defaultValue={value("other_names")} />}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="birth_year" label="Năm sinh" error={errors.birth_year}>
            {(props) => <Input {...props} inputMode="numeric" defaultValue={value("birth_year")} />}
          </Field>
          <Field name="death_year" label="Năm mất" error={errors.death_year}>
            {(props) => <Input {...props} inputMode="numeric" defaultValue={value("death_year")} />}
          </Field>
        </div>

        <Field
          name="portrait_url"
          label="Địa chỉ ảnh chân dung"
          error={errors.portrait_url}
          hint="Địa chỉ http(s) của ảnh có giấy phép sử dụng rõ ràng (ví dụ Wikimedia Commons)."
        >
          {(props) => <Input {...props} type="url" defaultValue={value("portrait_url")} />}
        </Field>

        <Field name="biography" label="Tiểu sử" error={errors.biography} hint="Cách nhau một dòng trống để tách đoạn.">
          {(props) => <Textarea {...props} defaultValue={value("biography")} rows={8} />}
        </Field>

        {/* Khung đăng ký Danh mục Nhân vật Lịch sử Địa phương toàn quốc */}
        <div className="flex flex-col gap-3 rounded-card border border-gold/40 bg-gold/5 p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="is_local_hero"
              name="is_local_hero"
              value="true"
              checked={isCatalog}
              disabled={readOnly || initialIsCatalog}
              onChange={(e) => setIsCatalog(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent disabled:opacity-75"
            />
            <div className="flex flex-col">
              <label htmlFor="is_local_hero" className="font-serif font-bold text-foreground cursor-pointer">
                Đăng ký vào Danh mục Nhân vật Cách mạng Địa phương (Toàn quốc)
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Khi được kích hoạt, hồ sơ yêu cầu thẩm định nguồn gốc, liên kết địa phương (trong 34 tỉnh/thành), câu chuyện lịch sử đạt chuẩn và chứng cứ bản quyền ảnh.
                {initialIsCatalog && " (Hồ sơ đã vào danh mục không thể hủy kích hoạt trực tiếp tại form này)."}
              </p>
            </div>
          </div>
        </div>

        {/* Phần quản trị danh mục mở rộng */}
        {isCatalog && (
          <FigureCatalogEditor
            key={`${catalogGraph?.revision ?? "new"}:${state.values?.expected_revision ?? "initial"}`}
            catalogGraph={catalogGraph}
            sources={sources}
            media={media}
            readOnly={readOnly}
            errors={Object.fromEntries(Object.entries(errors).map(([key, message]) => [key, [message]]))}
            initialRawGraphJson={state.values?.catalog_graph_json}
          />
        )}
      </fieldset>

      <FormFooter pending={pending} cancelHref={contentPaths.list("nhan-vat")} readOnly={readOnly} />
    </form>
  );
}
