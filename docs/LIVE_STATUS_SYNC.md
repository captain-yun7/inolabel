# Live Status Sync

This project exposes a server-side sync endpoint that updates `live_status` rows
from the `organization` table. It is designed to be called by a cron job.

## Endpoint

```
POST /api/live-status/sync
```

### Headers

```
x-cron-secret: <LIVE_STATUS_SYNC_SECRET>
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
LIVE_STATUS_SYNC_SECRET=... # optional, enables header check
```

## Current Behavior

- Reads active `organization` members and their `social_links`.
- Upserts rows into `live_status` per platform.
- Uses `organization.is_live` as the current live flag.

## Next Step (Provider Integration)

Replace the placeholder logic with a real provider fetch:

- Query each platform API (pandatv/chzzk/youtube/twitch).
- Set `is_live`, `viewer_count`, `thumbnail_url`.
- Run on a cron schedule (Vercel Cron or Supabase scheduled function).

