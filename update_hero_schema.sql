-- Add section column to hero_slides
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'home';

-- Update RLS if necessary (usually public read is fine)

-- Migration Logic
-- 1. Identify "Page Slides" (likely used by PageSlider)
--    Assumption: Page Slides don't have a primary CTA link, but utilize cta_secondary_link as the ID.
UPDATE hero_slides
SET section = cta_secondary_link
WHERE (cta_primary_link IS NULL OR cta_primary_link = '')
  AND cta_secondary_link IS NOT NULL
  AND (cta_secondary_link LIKE '/%' OR cta_secondary_link LIKE 'investor/%' OR cta_secondary_link LIKE 'about/%');

-- 2. Identify "Home Slides" explicitly
--    Everything else defaults to 'home' via the DEFAULT, but let's be sure for existing records.
UPDATE hero_slides
SET section = 'home'
WHERE section IS NULL;
