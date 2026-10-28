import fs from 'fs';
import { getSupabaseClient } from './supabase-helper.mjs';

async function checkDrift() {
  const beforeLocations = JSON.parse(
    fs.readFileSync('supabase/content/heritage-sites/release-v1-media-fix/before.json', 'utf8')
  );
  const supabase = getSupabaseClient();

  // 1. Check locations
  const { data: locs, error: locErr } = await supabase
    .from('historical_locations')
    .select('id, slug, name, heritage_tier');
  if (locErr) throw locErr;

  const liveHeritageLocs = locs.filter(l => l.heritage_tier);
  console.log(`Live heritage locations: ${liveHeritageLocs.length}, Before locations: ${beforeLocations.length}`);

  const liveLocBySlug = new Map(liveHeritageLocs.map(l => [l.slug, l]));
  for (const bLoc of beforeLocations) {
    const live = liveLocBySlug.get(bLoc.slug);
    if (!live) {
      console.error(`Missing location in live: ${bLoc.slug}`);
      return;
    }
    if (live.id !== bLoc.id) {
      console.error(`ID mismatch for ${bLoc.slug}: before=${bLoc.id}, live=${live.id}`);
      return;
    }
  }

  // 2. Check media
  const { data: media, error: mediaErr } = await supabase
    .from('media_assets')
    .select('id, location_id, file_url, is_cover, sort_order');
  if (mediaErr) throw mediaErr;

  const liveMediaById = new Map(media.map(m => [m.id, m]));
  const beforeMedia = beforeLocations.flatMap(l => l.media_assets);
  let obsoleteMatch = 0;
  for (const bMed of beforeMedia) {
    const live = liveMediaById.get(bMed.id);
    if (!live) {
      console.error(`Missing obsolete media id: ${bMed.id} (${bMed.file_url})`);
    } else {
      obsoleteMatch++;
    }
  }
  console.log(`Matched obsolete media rows: ${obsoleteMatch} / ${beforeMedia.length}`);

  // 3. Check fake videos
  const { data: vids, error: vidErr } = await supabase
    .from('location_videos')
    .select('id, location_id, youtube_id');
  if (vidErr) throw vidErr;

  const liveVidById = new Map(vids.map(v => [v.id, v]));
  const beforeVideos = beforeLocations.flatMap(l => l.location_videos);
  let vidMatch = 0;
  for (const bVid of beforeVideos) {
    const live = liveVidById.get(bVid.id);
    if (!live) {
      console.error(`Missing fake video id: ${bVid.id}`);
    } else {
      vidMatch++;
    }
  }
  console.log(`Matched fake videos: ${vidMatch} / ${beforeVideos.length}`);

  if (obsoleteMatch === beforeMedia.length && vidMatch === beforeVideos.length) {
    console.log('SUCCESS: Live database perfectly matches before.json snapshot! Zero drift detected.');
  } else {
    console.warn('WARNING: Drift detected between live DB and before.json');
  }
}

checkDrift().catch(console.error);
