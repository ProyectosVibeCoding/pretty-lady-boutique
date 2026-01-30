-- Add is_on_sale column to products table
ALTER TABLE public.products 
ADD COLUMN is_on_sale boolean DEFAULT false;

-- Mark some products as on sale (different from featured ones)
UPDATE public.products 
SET is_on_sale = true 
WHERE slug IN (
  'pantalon-palazzo-negro',
  'falda-midi-plisada',
  'blazer-oversize-lino',
  'vestido-encaje-romantic',
  'blusa-mangas-globo',
  'pantalon-cigarette-crema',
  'falda-linea-a-crema',
  'collar-perla-dorado',
  'slip-saten-negro',
  'kimono-seda-rose',
  'blusa-crop-lino',
  'jean-mom-fit'
);