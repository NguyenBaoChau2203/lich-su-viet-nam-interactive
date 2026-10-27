import { LOCALITIES } from "@/lib/local-heroes/localities";
import type { LocalityCode } from "@/lib/local-heroes/types";
export function LocalitySelect({ code, onChange }: { code: LocalityCode | null; onChange?: (code: LocalityCode | null) => void }) {
  return <div className="local-heroes-field"><label htmlFor="local-heroes-locality">Địa phương tham chiếu</label>
    <select id="local-heroes-locality" name="dia-phuong" value={LOCALITIES.find((l) => l.code === code)?.slug ?? ""}
      onChange={(event) => onChange?.(LOCALITIES.find((l) => l.slug === event.target.value)?.code ?? null)}>
      <option value="">Tất cả địa phương</option>
      {LOCALITIES.map((l) => <option key={l.code} value={l.slug}>{l.officialName}</option>)}
    </select></div>;
}
