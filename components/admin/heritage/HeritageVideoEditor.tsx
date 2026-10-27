"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle, ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  checkYouTubeEmbedAction,
  deleteLocationVideoAction,
  reorderLocationVideosAction,
  saveLocationVideoAction,
} from "@/lib/actions/heritage";

export type LocationVideoData = {
  id: string;
  youtube_id: string;
  title: string;
  channel: string;
  channel_url: string | null;
  note: string | null;
  embed_checked_at: string;
  sort_order: number;
};

type HeritageVideoEditorProps = {
  locationId: string;
  videos: LocationVideoData[];
  readOnly?: boolean;
};

export function HeritageVideoEditor({
  locationId,
  videos,
  readOnly,
}: HeritageVideoEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    ok: boolean;
    message?: string;
  } | null>(null);

  // Form values
  const [youtubeId, setYoutubeId] = useState("");
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [note, setNote] = useState("");
  const [checkedAt, setCheckedAt] = useState(new Date().toISOString().slice(0, 10));
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const sortedVideos = [...videos].sort((a, b) => a.sort_order - b.sort_order);

  const handleCheckEmbed = async () => {
    if (!inputUrl.trim()) return;
    setIsChecking(true);
    setCheckResult(null);

    const res = await checkYouTubeEmbedAction(inputUrl);
    setIsChecking(false);

    if (res.ok) {
      setYoutubeId(res.youtubeId);
      setTitle(res.title);
      setChannel(res.channel);
      setChannelUrl(res.channelUrl ?? "");
      setCheckResult({ ok: true });
    } else {
      if (res.youtubeId) {
        setYoutubeId(res.youtubeId);
      }
      setCheckResult({ ok: false, message: res.message });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (readOnly) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedVideos.length) return;

    const reordered = [...sortedVideos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const payload = reordered.map((v, i) => ({ id: v.id, sort_order: i + 1 }));
    const formData = new FormData();
    formData.append("location_id", locationId);
    formData.append("videos_order", JSON.stringify(payload));

    const res = await reorderLocationVideosAction({ status: "idle" }, formData);
    if (res.status === "error") {
      setStatusMsg(res.message ?? "Lỗi khi sắp xếp thứ tự video.");
    }
  };

  return (
    <section aria-labelledby="heritage-video-editor" className="flex flex-col gap-4 rounded-card border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="heritage-video-editor" className="font-serif text-lg font-semibold text-foreground">
            Video tư liệu ({sortedVideos.length}/5 video)
          </h2>
          <p className="text-sm text-muted-foreground">
            Các đoạn phim phóng sự, tư liệu lịch sử uy tín (tối đa 5 video; khuyến khích có ít nhất 1 video).
          </p>
        </div>

        {!readOnly && !isAdding && sortedVideos.length < 5 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsAdding(true);
              setInputUrl("");
              setCheckResult(null);
              setYoutubeId("");
              setTitle("");
              setChannel("");
              setChannelUrl("");
              setNote("");
              setCheckedAt(new Date().toISOString().slice(0, 10));
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Thêm video
          </Button>
        )}
      </div>

      {statusMsg && (
        <div role="alert" className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-300">
          {statusMsg}
        </div>
      )}

      {/* Add Video Form */}
      {isAdding && !readOnly && (
        <div className="flex flex-col gap-4 rounded-lg border border-primary/40 bg-surface p-4">
          <h3 className="font-medium text-foreground">Thêm video tư liệu mới</h3>

          {/* Step 1: Input URL & Check oEmbed */}
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3">
            <label className="text-xs font-semibold text-foreground">Đường dẫn YouTube hoặc mã Video ID</label>
            <div className="flex gap-2">
              <Input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... hoặc youtu.be/... hoặc mã ID"
                className="text-xs"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCheckEmbed}
                disabled={isChecking || !inputUrl.trim()}
              >
                <Search className="mr-1.5 h-3.5 w-3.5" />
                {isChecking ? "Đang kiểm tra..." : "Kiểm tra nhúng"}
              </Button>
            </div>

            {checkResult && (
              <div
                className={`rounded p-2 text-xs ${
                  checkResult.ok
                    ? "bg-green-500/10 text-green-800 dark:text-green-300"
                    : "bg-amber-500/10 text-amber-800 dark:text-amber-300"
                }`}
              >
                {checkResult.ok ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Đã kiểm tra oEmbed thành công! Tiêu đề và kênh đã được điền tự động.
                  </span>
                ) : (
                  <span>{checkResult.message}</span>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Metadata form */}
          <form
            action={async (formData) => {
              const res = await saveLocationVideoAction({ status: "idle" }, formData);
              if (res.status === "success") {
                setIsAdding(false);
                setStatusMsg(null);
              } else {
                setStatusMsg(res.message ?? "Lỗi khi lưu video.");
              }
            }}
            className="flex flex-col gap-3"
          >
            <input type="hidden" name="location_id" value={locationId} />
            <input type="hidden" name="sort_order" value={sortedVideos.length + 1} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-foreground">Mã YouTube ID (11 ký tự)</label>
                <Input
                  name="youtube_id"
                  required
                  maxLength={11}
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="Ví dụ: dQw4w9WgXcQ"
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Ngày kiểm tra nhúng</label>
                <Input
                  name="embed_checked_at"
                  type="date"
                  required
                  value={checkedAt}
                  onChange={(e) => setCheckedAt(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Tiêu đề video</label>
              <Input
                name="title"
                required
                minLength={3}
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề tư liệu..."
                className="mt-1 text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-foreground">Tên kênh / Nguồn sản xuất</label>
                <Input
                  name="channel"
                  required
                  minLength={2}
                  maxLength={120}
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="Ví dụ: VTV Đặc biệt, Truyền hình Nhân Dân..."
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Đường dẫn kênh (tùy chọn)</label>
                <Input
                  name="channel_url"
                  type="url"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@..."
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Ghi chú bối cảnh / nội dung (tùy chọn, tối đa 300 ký tự)</label>
              <Textarea
                name="note"
                rows={2}
                maxLength={300}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Phim tư liệu của Đài Truyền hình Việt Nam ghi lại diễn biến..."
                className="mt-1 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={!youtubeId || !title || !channel}>
                Lưu video
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Video List */}
      {sortedVideos.length === 0 && !isAdding ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Chưa có video nào. Bấm “Thêm video” để bổ sung tư liệu video từ YouTube.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {sortedVideos.map((video, idx) => (
            <div
              key={video.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {video.sort_order}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{video.title}</h3>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      title="Mở trên YouTube"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kênh: {video.channel} · YouTube ID: {video.youtube_id} · Đã kiểm tra: {video.embed_checked_at}
                  </p>
                  {video.note && <p className="mt-0.5 text-xs text-muted-foreground italic">{video.note}</p>}
                </div>
              </div>

              {!readOnly && (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    aria-label="Di chuyển lên"
                    className="h-7 w-7 p-0"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={idx === sortedVideos.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    aria-label="Di chuyển xuống"
                    className="h-7 w-7 p-0"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <form
                    action={async (formData) => {
                      const res = await deleteLocationVideoAction({ status: "idle" }, formData);
                      if (res.status === "error") {
                        setStatusMsg(res.message ?? "Lỗi khi xóa video.");
                      }
                    }}
                  >
                    <input type="hidden" name="location_id" value={locationId} />
                    <input type="hidden" name="video_id" value={video.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      aria-label="Xóa video"
                      className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
