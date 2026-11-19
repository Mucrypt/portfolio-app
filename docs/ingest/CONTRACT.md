# Course Ingest API — Contract v0.2

Status: **implemented** (`app/api/ingest/*`, database functions in
`supabase/migrations/20261119140000_ingest_api.sql`). Live once that migration is applied and
`INGEST_TOKEN` + `SUPABASE_SERVICE_ROLE_KEY` are set in the site's env.
This file is the agreement between ytfactory (sender) and portfolio-app (receiver). Change it here first,
then in code.

Reference data used to design it: `~/ytfactory/output/_catalog/squad-streaks.json` and
`~/ytfactory/output/squad-streaks-13-website-apk-download/{script.json,publish/kit.json}`.

---

## 1. Basics

| | |
|---|---|
| Base URL | `https://romeomukulah.org` (production) · `http://localhost:3000` (local) · Vercel preview URL (preview) |
| Auth | `Authorization: Bearer <INGEST_TOKEN>` on every request |
| Token | Random, ≥ 32 bytes (e.g. `openssl rand -base64 48`). Same value in ytfactory's env and the site's Vercel env. Never in a client bundle, never in git, never logged. Compared in constant time. |
| Rotation | The site also accepts `INGEST_TOKEN_NEXT` if it's set. Set it on the site, switch ytfactory to it, then promote it and unset the old one. |
| Content type | `application/json` (except `/assets`, which is `multipart/form-data`) |
| Body limit | JSON: 1 MB. Assets: 4 MB per file (Vercel caps function bodies at about 4.5 MB). When sending transcripts, split lessons across requests **by byte size** (keep each body under ~900 KB), not by a fixed count. |
| Validation | zod, **strict**: unknown keys are rejected (400), so typos fail loudly instead of being silently dropped. |
| Writes | Server-side only, with the Supabase service role. A request is applied in a single transaction: all or nothing. |
| Idempotency | Every write is an upsert keyed by `external_id`. Re-sending the same request is safe and gives the same result. |

### Retries

- Retry on network errors, `429`, and `5xx`, with exponential backoff (1 s, 2 s, 4 s … max 5 tries).
- Never retry a `4xx` other than `429`. Fix the payload instead.

---

## 2. Endpoints

| Method & path | Purpose | When ytfactory calls it |
|---|---|---|
| `POST /api/ingest/courses` | Upsert one course with its modules and lessons | After `approve` (lessons unpublished); for the backfill, once per course |
| `GET /api/ingest/courses/{external_id}` | Read a course's current state on the site | `status`; before PATCHing, to send only what changed; to notice admin-side publish changes |
| `PATCH /api/ingest/lessons/{external_id}` | Partial update of one lesson | After `upload` (set `video_ref`); when a video goes public (`is_published: true`) |
| `PATCH /api/ingest/products/{slug}` | Set a product's showcase video only | After the showcase/sales video is uploaded |
| `POST /api/ingest/assets` | Upload course or product art and get back a public URL | Before sending a `thumbnail_url` for a course |

### 2.1 `POST /api/ingest/courses`

```jsonc
{
  "course": {
    "external_id": "squad-streaks",          // required. ^[a-z0-9-]{1,120}$. Stable forever.
    "slug": "squad-streaks",                 // optional. Defaults to external_id. Site URL: /courses/{slug}
    "title": "Squad Streaks: build a real app from zero",   // required. 1–150 chars
    "description": "…",                      // required. 1–5000 chars
    "thumbnail_url": "https://…",            // optional, nullable. Must be a URL returned by /api/ingest/assets
    "access": "free",                        // required. Only "free" is accepted in v0.1
    "product_slug": "squad-streaks",         // optional, nullable. Must match an existing product (see §4)
    "playlist_id": null                      // optional, nullable. YouTube playlist id, ^[A-Za-z0-9_-]{10,64}$
  },
  "modules": [                               // optional. 0–50 items
    { "external_id": "backend", "title": "Backend: API, database, accounts, squads", "sort_order": 1 }
    // external_id: ^[a-z0-9-]{1,120}$, unique within the course. title 1–150. sort_order int ≥ 0
  ],
  "lessons": [                               // required. 0–200 items (send [] to update only the course)
    {
      "external_id": "squad-streaks-13-website-apk-download",  // required. ^[a-z0-9-]{1,120}$. GLOBALLY unique
      "module_external_id": "live",          // optional, nullable. Must exist in this payload or already in the DB
      "slug": "part-13-website-apk-download",// required. ^[a-z0-9-]{1,120}$, unique within the course
      "title": "…",                          // required. 1–150 chars
      "description": "…",                    // required. 0–5000 chars
      "objective": "…",                      // optional, nullable. 0–1000 chars
      "sort_order": 13,                      // required. int ≥ 0 (= series.part)
      "duration_seconds": 1430,              // optional, nullable. int ≥ 0
      "video_provider": "youtube",           // required. Only "youtube" in v0.1
      "video_ref": null,                     // optional, nullable. YouTube video id, ^[A-Za-z0-9_-]{11}$
      "short_ref": null,                     // optional, nullable. YouTube id of the episode's vertical Short. Stored, not shown yet
      "thumbnail_url": null,                 // optional, nullable override. See §3
      "transcript": null,                    // optional, nullable. Plain text, 0–100,000 chars (no SRT timestamps).
                                             // Shown as a collapsible transcript on the published lesson page (SEO)
      "chapters": [                          // optional. 0–200 items, sorted by start ascending
        { "start": 0, "title": "Intro" },
        { "start": 37.9, "title": "Where we are going" }
        // start: number ≥ 0, seconds, at most 1 decimal place (ytfactory rounds to 0.1). title 1–150 chars
      ],
      "resources": [                         // optional. 0–50 items
        { "label": "Source on GitHub", "url": "https://…", "type": "repo" }
        // label 1–150. url must be https. type: "link" | "repo" | "doc" | "file"
      ],
      "is_published": false                  // optional on update, defaults to false on create. See §3
    }
  ]
}
```

**How fields are applied**

| Situation | Result |
|---|---|
| `external_id` not in the DB yet | Insert. Omitted optional fields take their defaults. |
| `external_id` already in the DB | Update. **Omitted** fields are left unchanged. An explicit `null` clears the field. Arrays (`chapters`, `resources`) are replaced as a whole when sent. |
| A lesson or module that's in the DB but missing from the payload | Left untouched. Nothing is ever deleted by ingest. To hide a lesson, send `is_published: false`. |
| `lessons[].external_id` that already belongs to a **different** course | `409 lesson_belongs_to_other_course` |
| Duplicate `slug` or `external_id` inside one payload | `400 validation_failed` |

**200 response**

```json
{
  "ok": true,
  "course": { "id": "uuid", "external_id": "squad-streaks", "slug": "squad-streaks", "url": "https://romeomukulah.org/courses/squad-streaks" },
  "modules": { "created": 5, "updated": 0 },
  "lessons": { "created": 16, "updated": 0 }
}
```

### 2.1a `GET /api/ingest/courses/{external_id}`

Same Bearer token. Read-only. Returns unpublished lessons too (that's the point), so it is never public.

```jsonc
{
  "ok": true,
  "course": {
    "id": "uuid", "external_id": "squad-streaks", "slug": "squad-streaks",
    "title": "…", "access": "free", "product_slug": "squad-streaks", "playlist_id": null,
    "thumbnail_url": null, "updated_at": "2026-11-19T10:00:00Z",
    "url": "https://romeomukulah.org/courses/squad-streaks"
  },
  "modules": [ { "external_id": "backend", "title": "…", "sort_order": 1 } ],
  "lessons": [
    {
      "external_id": "squad-streaks-13-website-apk-download",
      "slug": "part-13-website-apk-download",
      "module_external_id": "live",
      "sort_order": 13,
      "video_ref": null,
      "short_ref": null,
      "is_published": false,
      "has_transcript": true,
      "updated_at": "2026-11-19T10:00:00Z"
    }
  ]
}
```

Lessons are sorted by `sort_order`. `404 course_not_found` if the course doesn't exist. Full lesson bodies (description,
chapters, transcript) are not returned; compare `updated_at` if you need change detection.

### 2.2 `PATCH /api/ingest/lessons/{external_id}`

The body is any subset of the lesson fields above, **except** `external_id` (it's in the path) and `slug`
(fixed after creation so URLs don't break). At least one field is required.

```jsonc
// after upload (video still PRIVATE on YouTube)
{ "video_ref": "dQw4w9WgXcQ" }

// after Romeo makes it public on YouTube
{ "is_published": true }
```

- `404 lesson_not_found` if the lesson doesn't exist. Create it with `POST /courses` first.
- Response: `{ "ok": true, "lesson": { "id", "external_id", "is_published", "video_ref", "url" } }`

### 2.3 `PATCH /api/ingest/products/{slug}`

Only media fields can be set here. Price, Lemon Squeezy variant, copy and status are owner-only (admin or SQL),
never set via ingest.

```json
{ "showcase_video_ref": "abcdefghijk", "showcase_duration_seconds": 716 }
```

`404 product_not_found` if there's no product with that slug.

### 2.4 `POST /api/ingest/assets`

`multipart/form-data` with these fields:

| Field | Value |
|---|---|
| `file` | PNG, JPEG or WebP, ≤ 4 MB. Recommended size 1280×720. |
| `kind` | `course` or `product` |
| `external_id` | The course `external_id` or product slug it belongs to |

- Stored in the public `course-thumbnails` bucket at `{kind}/{external_id}/{sha256-of-file}.{ext}`. Uploading
  the same file twice returns the same URL.
- Response: `{ "ok": true, "url": "https://<project>.supabase.co/storage/v1/object/public/course-thumbnails/…" }`
- Pass that URL as `course.thumbnail_url`. Lesson images don't need this endpoint (see §3).

---

### 2.5 Dry run: `?dry_run=1`

Accepted on every write endpoint (`POST /courses`, `PATCH /lessons/…`, `PATCH /products/…`, `POST /assets`).

- Runs everything a real call runs: auth, zod validation, and the database checks (`unknown_product`, `unknown_module`,
  `lesson_belongs_to_other_course`, `publish_requires_video_ref`, `lesson_not_found` …). Then it rolls back, so
  nothing is written and no file is stored.
- Returns the same status code and body as the real call, plus `"dry_run": true`. The counts (`created`/`updated`)
  are what would have happened. For `/assets`, `url` is the URL the file would get.
- Any value other than `1` is treated as a real call. Use it against production before the first real backfill.

## 3. Publishing and thumbnails

YouTube uploads start **private**, and Romeo makes them public by hand. A private video embedded on the site shows
an error player. So a lesson moves through these states:

| Step | ytfactory sends | Visible on site? |
|---|---|---|
| `approve` | `POST /courses` with the lesson, `video_ref: null`, `is_published: false` | No |
| `upload` (YouTube private) | `PATCH /lessons/{id}` `{ "video_ref": "<id>" }` | No |
| Romeo makes it public | `PATCH /lessons/{id}` `{ "is_published": true }` | **Yes** |

**Only set `is_published: true` once the video's YouTube privacy status is `public`** (or `unlisted`, if that's
ever wanted). ytfactory can check it with the YouTube Data API (`videos.list?part=status`) on a schedule, or Romeo
can flip it from the site's admin. The site also refuses `is_published: true` for a lesson without a `video_ref`
(`422 publish_requires_video_ref`).

A course is listed on `/courses` once it has at least one published lesson.

**Thumbnails**
- Lesson image = `thumbnail_url` if set; otherwise derived from YouTube:
  `https://i.ytimg.com/vi/{video_ref}/maxresdefault.jpg`, falling back to `hqdefault.jpg`.
- Course image = `course.thumbnail_url`; otherwise the first published lesson's image.

---

## 4. Products

Products (the thing for sale, e.g. Squad Streaks source code) are created by Romeo (seed SQL or admin), not
by ingest, because they carry prices and Lemon Squeezy ids. `course.product_slug` only links a course to an
existing product.
- Unknown slug → `422 unknown_product`.
- Seed the product first. For the Squad Streaks backfill, its product row will exist before ytfactory sends the course.
- Courses with no product (e.g. Burp Suite, MAC changer) omit `product_slug`.

---

## 5. Errors

All errors look like this:

```json
{ "ok": false, "error": "validation_failed", "message": "Human-readable summary", "issues": [ { "path": "lessons.3.chapters.0.start", "message": "Expected number ≥ 0" } ] }
```

| Status | `error` | Meaning |
|---|---|---|
| 400 | `validation_failed` | The body failed the zod schema. `issues` lists each problem. |
| 400 | `invalid_json` | The body isn't JSON. |
| 401 | `unauthorized` | Missing or wrong token. Same response for both, no detail. |
| 404 | `course_not_found` / `lesson_not_found` / `product_not_found` | The GET or PATCH target doesn't exist. |
| 409 | `lesson_belongs_to_other_course` | `external_id` clash across courses. |
| 409 | `slug_taken` | The course `slug` is used by another course, or a new lesson's `slug` is used by another lesson in the same course. |
| 413 | `payload_too_large` | Over 1 MB (JSON) or 4 MB (asset). |
| 415 | `unsupported_media_type` | Wrong Content-Type, or an asset that isn't PNG/JPEG/WebP. |
| 422 | `unknown_product` / `unknown_module` / `publish_requires_video_ref` | The request is well-formed but conflicts with what's in the DB. |
| 429 | `rate_limited` | More than 60 requests a minute. Back off; the `Retry-After` header gives the seconds until the window resets. |
| 500 | `internal_error` | Safe to retry. |

---

## 6. Mapping from ytfactory output

| Contract field | ytfactory source |
|---|---|
| `course.external_id` | series slug (`squad-streaks`) |
| `course.title`, `course.description` | catalog file |
| `modules[]` | catalog file groups (backend, phone, live, control, finale) |
| `lessons[].external_id` | episode folder slug (`output/<slug>/`) |
| `lessons[].sort_order` | `script.json → series.part` |
| `lessons[].title`, `description` | `publish/kit.json` final YouTube title + first paragraph of the description |
| `lessons[].objective` | `script.json → lesson.objective` |
| `lessons[].duration_seconds` | measured from `long.mp4` |
| `lessons[].chapters` | `publish/kit.json → chapters`, `start` rounded to 0.1 |
| `lessons[].video_ref` | YouTube id returned by `upload` |
| `lessons[].short_ref` | YouTube id of `short.mp4` once uploaded |
| `lessons[].transcript` | `long.srt`, converted to plain text: cue numbers and timestamps stripped, cues joined into paragraphs |

Not carried in v0.1, but can be added later without breaking anything: tags, prerequisites, result, pinned comment.

---

## 7. Changelog

- **v0.2 (2026-11-19):** implemented. Additive only, nothing changes for an existing sender:
  - New `409 slug_taken` (a slug clash previously had no defined error).
  - `429` responses carry a `Retry-After` header.
  - Clarified: `modules[].title` and `modules[].sort_order` are required; `course.thumbnail_url` must start with
    the `course-thumbnails` public URL returned by `/assets`; chapters must be sorted by `start`.
  - Error responses on a `?dry_run=1` call also carry `"dry_run": true` (except `401`).

- **v0.1 (2026-11-19):** first draft, agreed with ytfactory-24 in the Squad Streaks planning thread. Before any
  implementation, ytfactory's change requests were folded in: lesson `transcript` and `short_ref`,
  `GET /api/ingest/courses/{external_id}`, and `?dry_run=1` on all write endpoints.
