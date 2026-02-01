-- Migrate data from hero_slides to page_banners
-- We look for hero_slides that were "borrowed" for subpages.
-- Typically these had a cta_secondary_link that was used as the page path discriminator.

INSERT INTO public.page_banners (
    page_path,
    title_id,
    title_en,
    subtitle_id,
    subtitle_en,
    image_url,
    sort_order,
    is_active
)
SELECT 
    replace(cta_secondary_link, '#', ''), -- Clean up hash if stored with it
    title_id,
    title_en,
    subtitle_id,
    subtitle_en,
    image_url,
    sort_order,
    is_active
FROM 
    public.hero_slides
WHERE 
    cta_secondary_link IS NOT NULL 
    AND cta_secondary_link != '' 
    AND cta_secondary_link != '/' -- Exclude home if it was stored as slash
    AND cta_secondary_link NOT LIKE 'http%' -- Exclude external links if any
    AND cta_secondary_link NOT LIKE '#%' -- Exclude pure anchors that aren't page paths (though code treated them as paths)
    -- You might want to remove this last condition if your paths ARE storing '#about' etc.
    -- The previous code used `pagePath` which often had leading slash or was just a slug.
    -- Let's assume valid page paths look like '/about' or 'about'.
;

-- OPTIONAL: If you want to delete these migrated rows from hero_slides to clean it up:
-- DELETE FROM public.hero_slides WHERE cta_secondary_link ... (same conditions as above)
