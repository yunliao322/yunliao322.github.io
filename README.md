# Yunhan Liao Website Template

This is a small static website prepared for Yunhan. It follows the simple academic profile structure of the reference site while keeping only:

- Webpage/home
- Research
- Teaching
- Experience
- CV & Education
- Email
- LinkedIn
- Google Scholar
- ResearchGate

## Edit Your Information

Most content lives in:

```text
assets/site-data.js
```

Update your name, title, location, email, profile links, biography, publications, teaching history, writing, and CV entries there.

## Add Your Photo

Place your photo in the `assets` folder, then update:

```js
photo: "assets/your-photo.jpg"
```

## Add Your CV PDF

Place your CV PDF in a new `files` folder, then update:

```js
cvPdfUrl: "files/Yunhan-Liao-CV.pdf"
```

If you do not want a PDF link, set `cvPdfUrl` to an empty string.

## Open Locally

Open `index.html` in a browser. No build step is required.

## Publish

You can publish this folder with GitHub Pages, Netlify, Vercel, or any static web host.

The included `CNAME` file is set to:

```text
yunhanl.me
```
