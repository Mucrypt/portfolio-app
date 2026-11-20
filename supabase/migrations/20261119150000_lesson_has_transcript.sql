-- =====================================================================
-- course_lessons.has_transcript (2026-11-19)
--
-- The admin Courses pages show "transcript yes/no" per lesson without loading
-- the transcripts themselves (up to 100 KB each). A stored generated column keeps
-- it correct automatically; nothing writes to it.
-- =====================================================================

ALTER TABLE public.course_lessons
  ADD COLUMN has_transcript boolean
  GENERATED ALWAYS AS (transcript IS NOT NULL AND length(transcript) > 0) STORED;
