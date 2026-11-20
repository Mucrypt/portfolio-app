-- Contact form: messages are written only by POST /api/contact (service role), which validates,
-- rate-limits and drops spam. Close the open insert policy so nobody can write rows directly
-- with the public anon key, bypassing those checks.
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.contact_inquiries;
REVOKE INSERT ON public.contact_inquiries FROM anon;

-- Owner reads/updates already exist (owner_read_contact_inquiries / owner_update_contact_inquiries).
-- Statuses the admin Messages page uses. NOT VALID: existing rows aren't re-checked, new ones are.
ALTER TABLE public.contact_inquiries
  ADD CONSTRAINT contact_inquiries_status_check
  CHECK (status IN ('new', 'read', 'replied', 'archived')) NOT VALID;

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created ON public.contact_inquiries (created_at DESC);
