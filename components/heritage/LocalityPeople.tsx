import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { getLocalHeroPage } from "@/lib/queries/local-heroes";
import type { LocalityCode } from "@/lib/local-heroes/types";

type Props = {
  localityCode: LocalityCode;
  localityName: string;
};

export async function LocalityPeople({ localityCode, localityName }: Props) {
  let items = [];
  try {
    const page = await getLocalHeroPage({ localityCode, query: "", page: 1 });
    items = page.items.slice(0, 4);
  } catch {
    return null;
  }

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="nhan-vat-dia-phuong" className="rounded-card border border-border bg-surface p-4">
      <h2 id="nhan-vat-dia-phuong" className="font-serif text-lg font-bold text-surface-foreground">
        Nhân vật cùng địa phương
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Gắn bó với {localityName}
      </p>
      <ul className="mt-3 space-y-3">
        {items.map((person) => (
          <li key={person.id} className="flex items-center gap-3">
            {person.image?.url ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                <SafeImage
                  src={person.image.url}
                  alt={person.image.altText || person.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-serif text-xs text-muted-foreground">
                {person.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link
                href={`/nhan-vat/${person.slug}`}
                className="line-clamp-1 font-medium text-sm text-foreground hover:text-accent hover:underline"
              >
                {person.name}
              </Link>
              {person.birthYear !== null && (
                <p className="text-xs text-muted-foreground">
                  {person.birthYear} – {person.deathYear ?? "?"}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
