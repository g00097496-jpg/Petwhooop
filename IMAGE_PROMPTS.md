# Replacing the concept illustrations with real renders

The site currently uses hand-built SVG illustrations (`src/components/Illustrations.tsx`). They are labelled "concept render / concept illustration" on the page. AI image generation was not available when this was built, so no AI images are included.

## Prompts (use in your image tool of choice)
Keep the palette: ivory #FAF8F3, cream #F4EBDD, sage #A9BEA3, forest #243C32, peach #F4C6AD.

1. **Hero:** "Premium product concept render, soft studio lighting, a happy golden retriever sitting beside a minimalist cream-and-forest-green smart pet feeder, a sage-green smart collar on the dog, warm ivory background, shallow depth of field, calm and cinematic, no text, no logos."
2. **Collar:** "Product concept render of a slim forest-green pet collar with a small rounded sage-green sensor module, on a cream surface, soft shadow, editorial product photography, no text."
3. **Feeder:** "Product concept render of a rounded minimalist automatic pet feeder, ivory body, forest-green base, sage accent ring, soft studio light, no text."
4. **Vision / lifestyle:** "Warm lifestyle scene, a person and a dog in a bright home, soft morning light, feeder visible in the background, natural and unposed, no text."

## Workflow
1. Generate at 2x the display size. Export as WebP or PNG.
2. Save into `public/images/` (e.g. `hero.webp`).
3. Replace the `<DogScene />`, `<CollarArt />`, `<FeederArt />` usages with `next/image`, keep the "Concept render" caption, and keep a meaningful `alt`.
4. Re-export `public/og.png` (1200×630) and `public/email/hero.png` (600 px wide) from the new hero.
5. Only drop the "concept" caption once the images show the real product.
