# CNH Advisory website

This repository contains the completed static CNH Advisory website. The files Cloudflare Pages should publish are in the `site` folder.

## Preview locally

Open `site/index.html` in a web browser. For a local web-server preview, run this command from the repository folder:

```sh
python -m http.server 8000 --directory site
```

Then open `http://localhost:8000`.

## Update the website

- Edit page content in `site/index.html`.
- Edit visual styles in `site/styles.css`.
- Edit interactions in `site/script.js`.
- Add or replace images in `site/assets`, then update their paths in the HTML or CSS.
- Preview the site before committing and pushing changes.

The files outside `site` are local working copies, exports, or backups. They are excluded from Git and should not be uploaded to GitHub.

## Deploy with Cloudflare Pages

1. Push this repository to GitHub.
2. In Cloudflare, create a Pages project and connect the GitHub repository.
3. Choose no framework preset.
4. Leave the build command blank.
5. Set the build output directory to `site`.
6. Save and deploy.

Cloudflare Pages will publish the contents of `site` and redeploy automatically after future pushes.

