-- Create business_line_images table for storing slider images
CREATE TABLE IF NOT EXISTS business_line_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_line_id UUID NOT NULL REFERENCES business_lines(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption_id TEXT,
  caption_en TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_business_line_images_business_line_id ON business_line_images(business_line_id);
CREATE INDEX IF NOT EXISTS idx_business_line_images_display_order ON business_line_images(display_order);

-- Enable RLS
ALTER TABLE business_line_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to business line images"
  ON business_line_images
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users (admin) to manage images
CREATE POLICY "Allow authenticated users to insert business line images"
  ON business_line_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update business line images"
  ON business_line_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete business line images"
  ON business_line_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment
COMMENT ON TABLE business_line_images IS 'Stores slider images for each business line';
