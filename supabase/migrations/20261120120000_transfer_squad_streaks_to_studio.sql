-- Transfer ownership of the squad-streaks course from ytfactory to mukulah-studio (contract v0.2.1 §ownership).
-- Requested by the owner on 2026-11-20: Studio becomes the only sender for this course.
-- After this, ytfactory's token gets 409 course_owned_by_other_sender for squad-streaks; Studio's token can write it.
-- Lessons, slugs, external_ids, module assignments and publish state are untouched.
-- Guarded: only moves the course if ytfactory still owns it, and fails loudly if it isn't there.

DO $$
DECLARE
  moved integer;
BEGIN
  UPDATE public.courses
     SET source = 'studio'
   WHERE external_id = 'squad-streaks'
     AND source = 'ytfactory';
  GET DIAGNOSTICS moved = ROW_COUNT;

  IF moved = 0 AND NOT EXISTS (
    SELECT 1 FROM public.courses WHERE external_id = 'squad-streaks' AND source = 'studio'
  ) THEN
    RAISE EXCEPTION 'squad-streaks not found, or owned by a sender other than ytfactory/studio';
  END IF;
END
$$;
