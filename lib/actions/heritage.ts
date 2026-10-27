"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { contentPaths } from "@/lib/admin/content-kinds";
import { requireRole } from "@/lib/auth";
import { parseYouTubeId } from "@/lib/heritage/youtube";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions/state";

const STAFF_ROLES = ["editor", "reviewer", "system_admin"] as const;

export async function checkYouTubeEmbedAction(
  input: string,
): Promise<{ ok: true; youtubeId: string; title: string; channel: string; channelUrl?: string } | { ok: false; youtubeId: string | null; message: string }> {
  await requireRole(STAFF_ROLES);
  const id = parseYouTubeId(input);
  if (!id) {
    return { ok: false, youtubeId: null, message: "Định dạng đường dẫn hoặc mã YouTube ID không hợp lệ." };
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    const res = await fetch(oembedUrl, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "LichSuVietNam/1.0" },
    });
    if (!res.ok) {
      return {
        ok: false,
        youtubeId: id,
        message: "Video không tồn tại hoặc đã tắt tính năng nhúng. Bạn có thể nhập tiêu đề và tên kênh thủ công.",
      };
    }
    const data = (await res.json()) as { title?: string; author_name?: string; author_url?: string };
    return {
      ok: true,
      youtubeId: id,
      title: data.title ?? "",
      channel: data.author_name ?? "",
      channelUrl: data.author_url,
    };
  } catch {
    return {
      ok: false,
      youtubeId: id,
      message: "Không thể kết nối tới YouTube oEmbed (quá thời gian chờ hoặc mạng bận). Bạn có thể nhập tiêu đề và tên kênh thủ công.",
    };
  }
}

const storySectionSchema = z
  .object({
    location_id: z.string().uuid("Mã địa điểm không hợp lệ."),
    section_id: z.string().uuid("Mã phần câu chuyện không hợp lệ.").optional().or(z.literal("")),
    sort_order: z.coerce.number().int().min(1).max(20),
    heading: z.string().trim().min(2, "Tiêu đề phải từ 2 đến 120 ký tự.").max(120),
    body: z.string().trim().min(80, "Nội dung mục phải từ 80 đến 4000 ký tự.").max(4000),
    certainty: z.enum(["verified", "approximate", "disputed", "editorial"]),
    uncertainty_note: z.string().trim().max(500).optional().or(z.literal("")),
    sources: z.array(
      z.object({
        source_id: z.string().uuid("Nguồn không hợp lệ."),
        locator: z.string().trim().min(1, "Vui lòng nhập vị trí trích dẫn (locator)."),
        scope_note: z.string().trim().min(1, "Vui lòng nhập phạm vi kiểm chứng (scope note)."),
      }),
    ).default([]),
  })
  .superRefine((val, ctx) => {
    if (
      (val.certainty === "approximate" || val.certainty === "disputed") &&
      (!val.uncertainty_note || val.uncertainty_note.trim().length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["uncertainty_note"],
        message: "Khi độ tin cậy là Gần đúng hoặc Đang tranh luận, bắt buộc ghi chú lý do.",
      });
    }
  });

export async function saveStorySectionAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(STAFF_ROLES);

  const rawSources = formData.get("sources_json");
  let parsedSources: unknown = [];
  if (typeof rawSources === "string" && rawSources.trim().length > 0) {
    try {
      parsedSources = JSON.parse(rawSources);
    } catch {
      return { status: "error", message: "Định dạng nguồn tham khảo không hợp lệ." };
    }
  }

  const rawData = {
    location_id: formData.get("location_id"),
    section_id: formData.get("section_id") || undefined,
    sort_order: formData.get("sort_order"),
    heading: formData.get("heading"),
    body: formData.get("body"),
    certainty: formData.get("certainty") || "verified",
    uncertainty_note: formData.get("uncertainty_note") || undefined,
    sources: parsedSources,
  };

  const parsed = storySectionSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString() ?? "general";
      fieldErrors[field] = issue.message;
    }
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin.", fieldErrors };
  }

  const { location_id, section_id, sort_order, heading, body, certainty, uncertainty_note, sources } = parsed.data;
  const supabase = await createClient();

  let targetSectionId = section_id;

  if (targetSectionId) {
    const { error } = await supabase
      .from("location_story_sections")
      .update({
        sort_order,
        heading,
        body,
        certainty,
        uncertainty_note: uncertainty_note || null,
      })
      .eq("id", targetSectionId);

    if (error) {
      return { status: "error", message: `Không thể lưu phần câu chuyện: ${error.message}` };
    }
  } else {
    const { data, error } = await supabase
      .from("location_story_sections")
      .insert({
        location_id,
        sort_order,
        heading,
        body,
        certainty,
        uncertainty_note: uncertainty_note || null,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { status: "error", message: `Không thể thêm phần câu chuyện: ${error?.message}` };
    }
    targetSectionId = data.id;
  }

  // Sync sources
  const { error: delError } = await supabase
    .from("location_story_sources")
    .delete()
    .eq("section_id", targetSectionId);

  if (delError) {
    return { status: "error", message: `Không thể cập nhật nguồn: ${delError.message}` };
  }

  if (sources.length > 0) {
    const sourceRows = sources.map((s) => ({
      section_id: targetSectionId!,
      source_id: s.source_id,
      locator: s.locator,
      scope_note: s.scope_note,
    }));
    const { error: insError } = await supabase.from("location_story_sources").insert(sourceRows);
    if (insError) {
      return { status: "error", message: `Không thể gắn nguồn tham khảo: ${insError.message}` };
    }
  }

  revalidatePath(contentPaths.edit("dia-diem", location_id));
  return { status: "success", message: "Đã lưu phần câu chuyện thành công." };
}

export async function deleteStorySectionAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(STAFF_ROLES);
  const locationId = formData.get("location_id")?.toString();
  const sectionId = formData.get("section_id")?.toString();

  if (!locationId || !sectionId) {
    return { status: "error", message: "Thiếu mã địa điểm hoặc phần câu chuyện." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("location_story_sections").delete().eq("id", sectionId);
  if (error) {
    return { status: "error", message: `Không thể xóa phần câu chuyện: ${error.message}` };
  }

  revalidatePath(contentPaths.edit("dia-diem", locationId));
  return { status: "success", message: "Đã xóa phần câu chuyện." };
}

export async function reorderStorySectionsAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(STAFF_ROLES);
  const locationId = formData.get("location_id")?.toString();
  const orderJson = formData.get("sections_order")?.toString();

  if (!locationId || !orderJson) {
    return { status: "error", message: "Dữ liệu sắp xếp không hợp lệ." };
  }

  let orders: Array<{ id: string; sort_order: number }>;
  try {
    orders = JSON.parse(orderJson);
  } catch {
    return { status: "error", message: "Định dạng thứ tự không hợp lệ." };
  }

  const supabase = await createClient();
  for (const item of orders) {
    const { error } = await supabase
      .from("location_story_sections")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);
    if (error) {
      return { status: "error", message: `Không thể cập nhật thứ tự: ${error.message}` };
    }
  }

  revalidatePath(contentPaths.edit("dia-diem", locationId));
  return { status: "success", message: "Đã cập nhật thứ tự các phần câu chuyện." };
}

const locationVideoSchema = z.object({
  location_id: z.string().uuid("Mã địa điểm không hợp lệ."),
  video_id: z.string().uuid("Mã video không hợp lệ.").optional().or(z.literal("")),
  youtube_id: z.string().trim().regex(/^[A-Za-z0-9_-]{11}$/, "YouTube ID phải gồm đúng 11 ký tự."),
  title: z.string().trim().min(3, "Tiêu đề video phải từ 3 đến 200 ký tự.").max(200),
  channel: z.string().trim().min(2, "Tên kênh phải từ 2 đến 120 ký tự.").max(120),
  channel_url: z
    .string()
    .trim()
    .url("Đường dẫn kênh không hợp lệ.")
    .regex(/^https:\/\/(www\.)?youtube\.com\//, "Đường dẫn kênh phải bắt đầu bằng https://youtube.com/")
    .optional()
    .or(z.literal("")),
  note: z.string().trim().max(300, "Ghi chú tối đa 300 ký tự.").optional().or(z.literal("")),
  embed_checked_at: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày kiểm tra phải có dạng YYYY-MM-DD."),
  sort_order: z.coerce.number().int().min(1).max(5),
});

export async function saveLocationVideoAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(STAFF_ROLES);

  const rawData = {
    location_id: formData.get("location_id"),
    video_id: formData.get("video_id") || undefined,
    youtube_id: formData.get("youtube_id"),
    title: formData.get("title"),
    channel: formData.get("channel"),
    channel_url: formData.get("channel_url") || undefined,
    note: formData.get("note") || undefined,
    embed_checked_at: formData.get("embed_checked_at") || new Date().toISOString().slice(0, 10),
    sort_order: formData.get("sort_order") || 1,
  };

  const parsed = locationVideoSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString() ?? "general";
      fieldErrors[field] = issue.message;
    }
    return { status: "error", message: "Vui lòng kiểm tra lại thông tin video.", fieldErrors };
  }

  const { location_id, video_id, youtube_id, title, channel, channel_url, note, embed_checked_at, sort_order } =
    parsed.data;
  const supabase = await createClient();

  if (video_id) {
    const { error } = await supabase
      .from("location_videos")
      .update({
        youtube_id,
        title,
        channel,
        channel_url: channel_url || null,
        note: note || null,
        embed_checked_at,
        sort_order,
      })
      .eq("id", video_id);

    if (error) {
      return { status: "error", message: `Không thể lưu video: ${error.message}` };
    }
  } else {
    const { error } = await supabase.from("location_videos").insert({
      location_id,
      youtube_id,
      title,
      channel,
      channel_url: channel_url || null,
      note: note || null,
      embed_checked_at,
      sort_order,
    });

    if (error) {
      return { status: "error", message: `Không thể thêm video: ${error.message}` };
    }
  }

  revalidatePath(contentPaths.edit("dia-diem", location_id));
  return { status: "success", message: "Đã lưu video thành công." };
}

export async function deleteLocationVideoAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(STAFF_ROLES);
  const locationId = formData.get("location_id")?.toString();
  const videoId = formData.get("video_id")?.toString();

  if (!locationId || !videoId) {
    return { status: "error", message: "Thiếu mã địa điểm hoặc video." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("location_videos").delete().eq("id", videoId);
  if (error) {
    return { status: "error", message: `Không thể xóa video: ${error.message}` };
  }

  revalidatePath(contentPaths.edit("dia-diem", locationId));
  return { status: "success", message: "Đã xóa video." };
}

export async function reorderLocationVideosAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(STAFF_ROLES);
  const locationId = formData.get("location_id")?.toString();
  const orderJson = formData.get("videos_order")?.toString();

  if (!locationId || !orderJson) {
    return { status: "error", message: "Dữ liệu sắp xếp không hợp lệ." };
  }

  let orders: Array<{ id: string; sort_order: number }>;
  try {
    orders = JSON.parse(orderJson);
  } catch {
    return { status: "error", message: "Định dạng thứ tự không hợp lệ." };
  }

  const supabase = await createClient();
  for (const item of orders) {
    const { error } = await supabase
      .from("location_videos")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);
    if (error) {
      return { status: "error", message: `Không thể cập nhật thứ tự video: ${error.message}` };
    }
  }

  revalidatePath(contentPaths.edit("dia-diem", locationId));
  return { status: "success", message: "Đã cập nhật thứ tự các video." };
}
