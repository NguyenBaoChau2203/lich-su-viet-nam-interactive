import { balancedColumns } from "@/lib/lessons/layout";
import { VideoEmbed } from "@/components/lesson/VideoEmbed";
import { cn } from "@/lib/utils/cn";
import type { HeritageVideo } from "@/lib/heritage/types";

type Props = {
  videos: HeritageVideo[];
};

export function HeritageVideos({ videos }: Props) {
  if (videos.length === 0) return null;

  const cols = balancedColumns(videos.length, 1, 2);
  const gridColsClass = cols === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";

  return (
    <section aria-labelledby="video" className="mt-10">
      <h2 id="video" className="mb-4 font-serif text-2xl font-bold text-foreground">
        Video tư liệu
      </h2>

      <div className={cn("grid gap-6", gridColsClass)}>
        {videos.map((video) => (
          <div key={video.youtubeId} className="flex flex-col gap-2">
            <VideoEmbed
              video={{
                youtubeId: video.youtubeId,
                title: video.title,
                channel: video.channel,
                note: video.note ?? "",
              }}
            />
            {video.checkedAt && (
              <p className="text-xs text-muted-foreground">
                Kiểm tra nhúng: {video.checkedAt}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Video phát từ YouTube của kênh nêu tên; bản quyền thuộc kênh đó. Video chỉ tải khi bấm phát.
      </p>
    </section>
  );
}
