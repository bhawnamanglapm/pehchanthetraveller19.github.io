# Photographs

Two kinds of image live here, and they are treated differently.

| | Ours | Someone else's |
|---|---|---|
| Who took it | Bhawna, on the trip | A photographer on Wikimedia Commons, Unsplash or Pexels |
| Credit shown | None needed | **Always**, over the image |
| Label | — | "not our photograph" |

The site's claim is first-hand travel, so an uncredited stock photo would be
the one lie on it. The build enforces this: a `photo` with no `credit` or no
`license` fails `node src/build.mjs`.

## Adding one

1. Put the file here, named after the destination slug: `kedarnath.jpg`.
   Resize the long edge to **1600px** and keep it under ~300KB. Nothing larger
   is useful on a phone and the repo has no image pipeline.
2. Add a `photo` object to that destination in `src/content/destinations.json`:

```json
"photo": {
  "src": "/assets/photos/kedarnath.jpg",
  "alt": "Kedarnath temple with the snow ridge behind it, early morning",
  "credit": "Name of the photographer",
  "creditUrl": "https://commons.wikimedia.org/wiki/File:...",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
}
```

3. `node src/build.mjs`. It fails loudly if anything required is missing.

**For your own photographs**, use the same block with
`"credit": "Bhawna Mangla"` and no `license` — the figure then reads
"Photo Bhawna Mangla", with no "not our photograph" label, because it is ours.

## Where to get properly licensed ones

**Wikimedia Commons** is the right source for Indian pilgrimage sites: the
licence and the photographer's name are stated on every file page, and the
coverage of Kedarnath, Badrinath, Vaishno Devi, Ujjain, Ayodhya and Vrindavan
is good. Search the place name, open the file, use the **"Use this file"**
button — it gives you the attribution string to paste into `credit`.

Unsplash and Pexels need no attribution by licence, but credit them anyway:
the label is what keeps the site honest, not the licence.

## What never goes here

- An image lifted from Google Images, a blog, Instagram or a hotel's website.
  "It was on the internet" is not a licence.
- Any photograph of an identifiable woman who has not agreed to it appearing.
- A stock photo passed off as first-hand by leaving the credit off.
