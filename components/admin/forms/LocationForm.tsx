"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, valueReader } from "@/components/admin/forms/Field";
import { FormFooter } from "@/components/admin/forms/FormFooter";
import { LocationMapPickerLazy } from "@/components/admin/forms/LocationMapPickerLazy";
import { TitleSlugFields } from "@/components/admin/forms/TitleSlugFields";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { saveLocationAction } from "@/lib/actions/content";
import { initialActionState } from "@/lib/actions/state";
import { contentPaths } from "@/lib/admin/content-kinds";
import { lessonCatalog } from "@/lib/lessons/catalog";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import { accuracyLevelLabels, parseAccuracyLevel } from "@/lib/utils/labels";

type LocationFormProps = {
  id?: string;
  initial: {
    name: string;
    historical_name: string | null;
    slug: string;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
    accuracy_level: string;
    accuracy_note: string | null;
    locality_code?: string | null;
    heritage_tier?: string | null;
    heritage_rank?: number | null;
    heritage_period?: string | null;
    heritage_teaser?: string | null;
    lesson_slug?: string | null;
  };
  readOnly?: boolean;
};

/** Chuỗi người dùng gõ → số hợp lệ (để vẽ ghim trên bản đồ), hoặc null. Chấp nhận dấu phẩy thập phân. */
function toCoordinate(text: string, min: number, max: number): number | null {
  const normalized = text.trim().replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
  const number = Number(normalized);
  return number >= min && number <= max ? number : null;
}

/**
 * Form địa điểm (UC07): tọa độ chọn bằng cách bấm lên bản đồ mini hoặc nhập tay; BẮT BUỘC chọn
 * độ chính xác (không mặc định) để dữ liệu ước lượng luôn được gắn nhãn trung thực.
 */
export function LocationForm({ id, initial, readOnly }: LocationFormProps) {
  const [state, formAction, pending] = useActionState(saveLocationAction, initialActionState);
  const value = valueReader(state, initial);
  const errors = state.fieldErrors ?? {};

  const [latitude, setLatitude] = useState(value("latitude"));
  const [longitude, setLongitude] = useState(value("longitude"));
  const [accuracy, setAccuracy] = useState(value("accuracy_level"));
  const [tier, setTier] = useState(value("heritage_tier"));
  const [teaser, setTeaser] = useState(value("heritage_teaser"));

  const point = {
    latitude: toCoordinate(latitude, -90, 90),
    longitude: toCoordinate(longitude, -180, 180),
  };

  return (
    <form action={formAction} noValidate className="flex max-w-3xl flex-col gap-5">
      {id && <input type="hidden" name="id" value={id} />}
      <FormMessage state={state} />
      <fieldset disabled={readOnly} className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0">
        <TitleSlugFields
          titleName="name"
          titleLabel="Tên hiện tại"
          initialTitle={value("name")}
          initialSlug={value("slug")}
          isNew={!id}
          titleError={errors.name}
          slugError={errors.slug}
        />
        <Field name="historical_name" label="Tên lịch sử" error={errors.historical_name} hint="Tên gọi thời điểm diễn ra sự kiện, nếu khác tên hiện tại.">
          {(props) => <Input {...props} defaultValue={value("historical_name")} />}
        </Field>
        <Field name="description" label="Mô tả" error={errors.description}>
          {(props) => <Textarea {...props} defaultValue={value("description")} rows={5} />}
        </Field>

        <section aria-labelledby="toa-do" className="flex flex-col gap-3 rounded-card border border-border p-4">
          <h2 id="toa-do" className="font-serif text-lg font-semibold text-foreground">
            Tọa độ
          </h2>
          <p className="text-sm text-muted-foreground">
            Bấm lên bản đồ để đặt vị trí, hoặc nhập tay. Bỏ trống cả hai nếu chưa xác định được (địa điểm sẽ không hiện trên bản đồ).
          </p>
          <div
            role="region"
            aria-label="Bản đồ chọn tọa độ"
            className="h-72 overflow-hidden rounded-lg border border-border"
          >
            <LocationMapPickerLazy
              latitude={point.latitude}
              longitude={point.longitude}
              accuracyLevel={parseAccuracyLevel(accuracy)}
              onPick={(lat, lng) => {
                if (readOnly) return;
                setLatitude(String(lat));
                setLongitude(String(lng));
              }}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="latitude" label="Vĩ độ" error={errors.latitude} hint="Từ -90 đến 90, ví dụ 21.0285.">
              {(props) => (
                <Input {...props} inputMode="decimal" value={latitude} onChange={(event) => setLatitude(event.target.value)} />
              )}
            </Field>
            <Field name="longitude" label="Kinh độ" error={errors.longitude} hint="Từ -180 đến 180, ví dụ 105.8542.">
              {(props) => (
                <Input {...props} inputMode="decimal" value={longitude} onChange={(event) => setLongitude(event.target.value)} />
              )}
            </Field>
          </div>
          {(latitude !== "" || longitude !== "") && !readOnly && (
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLatitude("");
                  setLongitude("");
                }}
              >
                Xóa tọa độ
              </Button>
            </div>
          )}
        </section>

        <Field
          name="accuracy_level"
          label="Độ chính xác của tọa độ"
          required
          error={errors.accuracy_level}
          hint="Chọn trung thực: nếu chỉ là ước lượng khu vực thì chọn “Khu vực” hoặc “Gần đúng”."
        >
          {(props) => (
            // Không điều khiển (defaultValue) + key theo giá trị đã nhập: form reset sau mỗi Action làm mất
            // lựa chọn của ô <select> điều khiển; dựng lại ô khi form trả lỗi để giữ đúng lựa chọn.
            // `accuracy` vẫn được theo dõi bằng onChange để đổi kiểu ghim trên bản đồ.
            <Select
              key={value("accuracy_level")}
              {...props}
              defaultValue={value("accuracy_level")}
              onChange={(event) => setAccuracy(event.target.value)}
            >
              <option value="">— Chọn độ chính xác —</option>
              {Object.entries(accuracyLevelLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field name="accuracy_note" label="Ghi chú độ chính xác" error={errors.accuracy_note} hint="Ví dụ: “Tọa độ trung tâm thành phố; địa điểm cụ thể chưa xác định”.">
          {(props) => <Textarea {...props} defaultValue={value("accuracy_note")} rows={3} />}
        </Field>

        <section aria-labelledby="dia-danh-dia-phuong" className="flex flex-col gap-4 rounded-card border border-border p-4">
          <div>
            <h2 id="dia-danh-dia-phuong" className="font-serif text-lg font-semibold text-foreground">
              Địa danh nổi bật theo địa phương
            </h2>
            <p className="text-sm text-muted-foreground">
              Thiết lập khi địa điểm này được chọn đưa vào chuyên mục “Địa danh lịch sử theo địa phương” (HS-1.0).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="heritage_tier"
              label="Nhóm địa danh"
              error={errors.heritage_tier}
              hint="Địa danh cốt lõi Lớp 12 hoặc địa danh mở rộng của địa phương."
            >
              {(props) => (
                <Select
                  key={value("heritage_tier")}
                  {...props}
                  defaultValue={value("heritage_tier")}
                  onChange={(e) => setTier(e.target.value)}
                >
                  <option value="">— Không (địa điểm thông thường) —</option>
                  <option value="grade12">Lớp 12 (ưu tiên cao nhất)</option>
                  <option value="extended">Mở rộng</option>
                </Select>
              )}
            </Field>

            <Field
              name="locality_code"
              label="Địa phương (34 tỉnh/thành)"
              required={tier === "grade12" || tier === "extended"}
              error={errors.locality_code}
            >
              {(props) => (
                <Select key={value("locality_code")} {...props} defaultValue={value("locality_code")}>
                  <option value="">— Chọn địa phương —</option>
                  {LOCALITIES.map((loc) => (
                    <option key={loc.code} value={loc.code}>
                      {loc.officialName} ({loc.code})
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="heritage_rank"
              label="Thứ hạng (1–9)"
              required={tier === "grade12" || tier === "extended"}
              error={errors.heritage_rank}
              hint="1 = Lớp 12; 2 = Mở rộng"
            >
              {(props) => (
                <Input
                  {...props}
                  type="number"
                  min={1}
                  max={9}
                  defaultValue={value("heritage_rank")}
                />
              )}
            </Field>

            <Field
              name="heritage_period"
              label="Thời kỳ / mốc thời gian"
              required={tier === "grade12" || tier === "extended"}
              error={errors.heritage_period}
              hint="Ví dụ: “13/3 – 7/5/1954”, “Kháng chiến chống Mỹ” (tối đa 60 ký tự)"
            >
              {(props) => (
                <Input
                  {...props}
                  maxLength={60}
                  defaultValue={value("heritage_period")}
                />
              )}
            </Field>
          </div>

          <Field
            name="heritage_teaser"
            label="Lời giới thiệu ngắn (teaser)"
            required={tier === "grade12" || tier === "extended"}
            error={errors.heritage_teaser}
            hint={`Diễn giải ngắn gọn từ các mục câu chuyện, 40–360 ký tự (${teaser.length}/360).`}
          >
            {(props) => (
              <Textarea
                {...props}
                rows={3}
                maxLength={360}
                value={teaser}
                onChange={(e) => setTeaser(e.target.value)}
              />
            )}
          </Field>

          <Field
            name="lesson_slug"
            label="Liên kết chuyên đề bài học"
            error={errors.lesson_slug}
            hint="Tùy chọn: liên kết đến bài học tương ứng để hiện thẻ 'Học sâu trong chuyên đề'."
          >
            {(props) => (
              <Select key={value("lesson_slug")} {...props} defaultValue={value("lesson_slug")}>
                <option value="">— Không liên kết chuyên đề —</option>
                {lessonCatalog.map((lesson) => (
                  <option key={lesson.slug} value={lesson.slug}>
                    {lesson.title} ({lesson.slug})
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </section>
      </fieldset>
      <FormFooter pending={pending} cancelHref={contentPaths.list("dia-diem")} readOnly={readOnly} />
    </form>
  );
}
