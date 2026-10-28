import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabase-helper.mjs';

const pkgDir = 'supabase/content/heritage-sites/v1';
const outDir = 'supabase/content/heritage-sites/release-v1-media-fix';
const beforeFile = path.join(outDir, 'before.json');
const baseUrl = 'https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media';

async function main() {
  console.log('=== KHỞI ĐỘNG ÁP DỤNG FIX MEDIA CHO DATABASE LIVE ===');
  const beforeData = JSON.parse(fs.readFileSync(beforeFile, 'utf8'));
  const sitesData = JSON.parse(fs.readFileSync(path.join(pkgDir, 'sites.json'), 'utf8'));
  const acceptedSites = sitesData.sites.filter(s => s.decision === 'accepted');

  const supabase = getSupabaseClient();

  // 1. Preflight
  console.log('\n[1/5] Chạy Preflight Assertions kiểm tra trạng thái live DB...');
  const { data: liveLocs, error: locErr } = await supabase
    .from('historical_locations')
    .select('id, slug, name, heritage_tier');
  if (locErr) throw new Error(`Lỗi truy vấn locations: ${locErr.message}`);

  const liveHeritageLocs = liveLocs.filter(l => l.heritage_tier);
  if (liveHeritageLocs.length !== 64) {
    throw new Error(`Số di tích trên DB khác 64: ${liveHeritageLocs.length}`);
  }

  const liveLocMapBySlug = new Map(liveHeritageLocs.map(l => [l.slug, l]));
  for (const bLoc of beforeData) {
    const live = liveLocMapBySlug.get(bLoc.slug);
    if (!live || live.id !== bLoc.id) {
      throw new Error(`Location ${bLoc.slug} không khớp ID hoặc bị mất!`);
    }
  }

  const { data: liveMedia, error: mediaErr } = await supabase
    .from('media_assets')
    .select('id, location_id, file_url, is_cover, sort_order');
  if (mediaErr) throw new Error(`Lỗi truy vấn media_assets: ${mediaErr.message}`);

  const liveMediaById = new Map(liveMedia.map(m => [m.id, m]));

  const enrolledSlugs = ['pac-bo-cao-bang', 'dinh-doc-lap'];
  const mediaToDelete = [];
  const videosToDelete = [];

  for (const loc of beforeData) {
    const isEnrolled = enrolledSlugs.includes(loc.slug);
    for (const ma of loc.media_assets || []) {
      if (isEnrolled && ma.is_cover && ma.sort_order === 1 && !ma.file_url.includes('Special:FilePath')) {
        continue;
      }
      const existing = liveMediaById.get(ma.id);
      if (!existing) {
        throw new Error(`Obsolete media ${ma.id} (${ma.file_url}) không tìm thấy trên DB live!`);
      }
      mediaToDelete.push({ id: ma.id, slug: loc.slug, file_url: ma.file_url });
    }
    for (const v of loc.location_videos || []) {
      videosToDelete.push({ id: v.id, slug: loc.slug, youtube_id: v.youtube_id, title: v.title });
    }
  }

  const { data: liveVids, error: vidErr } = await supabase
    .from('location_videos')
    .select('id, location_id, youtube_id, title');
  if (vidErr) throw new Error(`Lỗi truy vấn location_videos: ${vidErr.message}`);
  const liveVidById = new Map(liveVids.map(v => [v.id, v]));

  for (const v of videosToDelete) {
    if (!liveVidById.has(v.id)) {
      throw new Error(`Video ${v.id} (${v.title}) không tìm thấy trên DB live!`);
    }
  }

  console.log(`✓ Preflight hoàn tất: 64 locations khớp, ${mediaToDelete.length} obsolete media khớp, ${videosToDelete.length} fake videos khớp.`);

  // 2. Delete Fake Videos
  console.log(`\n[2/5] Đang xóa ${videosToDelete.length} fake videos...`);
  const vidIds = videosToDelete.map(v => v.id);
  const { error: delVidErr } = await supabase
    .from('location_videos')
    .delete()
    .in('id', vidIds);
  if (delVidErr) throw new Error(`Lỗi khi xóa videos: ${delVidErr.message}`);
  console.log(`✓ Đã xóa thành công ${vidIds.length} fake videos.`);

  // 3. Delete Obsolete Media Rows
  console.log(`\n[3/5] Đang xóa ${mediaToDelete.length} obsolete media rows...`);
  const mediaIds = mediaToDelete.map(m => m.id);
  const { error: delMediaErr } = await supabase
    .from('media_assets')
    .delete()
    .in('id', mediaIds);
  if (delMediaErr) throw new Error(`Lỗi khi xóa media: ${delMediaErr.message}`);
  console.log(`✓ Đã xóa thành công ${mediaIds.length} obsolete media rows.`);

  // 4. Insert Genuine Media Assets
  console.log(`\n[4/5] Đang thêm 64 genuine media assets với public Supabase Storage URLs...`);
  const rowsToInsert = [];
  for (const site of acceptedSites) {
    const slug = site.enrollExistingSlug || site.key;
    const loc = liveLocMapBySlug.get(slug);
    const isEnrolled = enrolledSlugs.includes(slug);

    for (let i = 0; i < site.media.length; i++) {
      const m = site.media[i];
      const name = m.key.startsWith(site.key + '-') ? m.key.slice(site.key.length + 1) : m.key;
      const fileUrl = `${baseUrl}/locations/heritage/${site.key}/${name}-1200.webp`;

      rowsToInsert.push({
        location_id: loc.id,
        file_url: fileUrl,
        source_page_url: m.sourcePageUrl,
        media_type: 'image',
        caption: m.caption,
        alt_text: m.altText,
        era: m.era,
        year_taken: m.yearTaken,
        photographer: m.photographer,
        license: m.license,
        license_url: m.licenseUrl,
        usage_basis: m.usageBasis,
        is_cover: isEnrolled ? false : (m.isCover ?? true),
        is_reenactment: false,
        is_colorized: false,
        width: m.width,
        height: m.height,
        sort_order: isEnrolled ? 2 : 1
      });
    }
  }

  const { data: insertedData, error: insErr } = await supabase
    .from('media_assets')
    .insert(rowsToInsert)
    .select('id, location_id, file_url, is_cover, sort_order');
  if (insErr) throw new Error(`Lỗi khi thêm media: ${insErr.message}`);
  console.log(`✓ Đã thêm thành công ${insertedData.length} genuine media rows.`);

  // 5. Post-apply Assertions
  console.log(`\n[5/5] Kiểm tra Post-apply Verification...`);
  const { data: postMedia, error: postMediaErr } = await supabase
    .from('media_assets')
    .select('id, location_id, file_url, is_cover, sort_order');
  if (postMediaErr) throw postMediaErr;

  const { data: postVids, error: postVidErr } = await supabase
    .from('location_videos')
    .select('id, location_id');
  if (postVidErr) throw postVidErr;

  // Check videos
  const heritageLocIds = new Set(liveHeritageLocs.map(l => l.id));
  const remainingHeritageVids = postVids.filter(v => heritageLocIds.has(v.location_id));
  if (remainingHeritageVids.length !== 0) {
    throw new Error(`Còn sót ${remainingHeritageVids.length} videos trong di tích lịch sử!`);
  }

  // Check media per heritage location
  const postHeritageMedia = postMedia.filter(m => heritageLocIds.has(m.location_id));
  console.log(`Tổng số media assets của 64 di tích: ${postHeritageMedia.length} (kỳ vọng: 66)`);
  if (postHeritageMedia.length !== 66) {
    throw new Error(`Tổng số media assets của 64 di tích là ${postHeritageMedia.length}, khác 66!`);
  }

  const mediaByLoc = new Map();
  for (const m of postHeritageMedia) {
    if (!mediaByLoc.has(m.location_id)) mediaByLoc.set(m.location_id, []);
    mediaByLoc.get(m.location_id).push(m);
  }

  let specialFilePathCount = 0;
  for (const loc of liveHeritageLocs) {
    const locMedia = mediaByLoc.get(loc.id) || [];
    if (locMedia.length < 1) {
      throw new Error(`Di tích ${loc.slug} không có media nào!`);
    }
    const covers = locMedia.filter(m => m.is_cover);
    if (covers.length !== 1) {
      throw new Error(`Di tích ${loc.slug} có ${covers.length} covers (kỳ vọng đúng 1)!`);
    }
    for (const m of locMedia) {
      if (m.file_url.includes('Special:FilePath')) specialFilePathCount++;
    }
  }

  if (specialFilePathCount !== 0) {
    throw new Error(`Còn ${specialFilePathCount} URL Special:FilePath trong di tích!`);
  }

  console.log('✓ TẤT CẢ POST-APPLY ASSERTIONS ĐÃ ĐẠT:');
  console.log('  - 64/64 di tích có ít nhất 1 ảnh.');
  console.log('  - 64/64 di tích có chính xác 1 cover.');
  console.log('  - 0 fake videos còn tồn tại.');
  console.log('  - 0 Special:FilePath còn tồn tại.');
  console.log('  - pac-bo-cao-bang & dinh-doc-lap bảo tồn nguyên vẹn ảnh bìa gốc.');
  console.log('\n=== HOÀN TẤT CẬP NHẬT DATABASE LIVE THÀNH CÔNG RỰC RỠ ===');
}

main().catch(err => {
  console.error('\n❌ LỖI TRONG QUÁ TRÌNH ÁP DỤNG:', err);
  process.exit(1);
});
