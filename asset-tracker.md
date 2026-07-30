# Asset Tracker

| Chapter | Reviewed | Generated |
|---:|:---:|:---:|
| 01 | ☐ | ☐ |
| 02 | ☐ | ☐ |
| 03 | ☐ | ☐ |
| 04 | ☐ | ☐ |
| 05 | ☐ | ☐ |
| 06 | ☐ | ☐ |
| 07 | ☐ | ☐ |
| 08 | ☐ | ☐ |
| 09 | ☐ | ☐ |
| 10 | ☑ | N/A |
| 11 | ☐ | ☐ |
| 12 | ☐ | ☐ |
| 13 | ☑ | N/A |
| 14 | ☐ | ☐ |
| 15 | ☐ | ☐ |
| 16 | ☐ | ☐ |
| 17 | Not Applicable | ☑ |
| 18 | Not Applicable | ☑ |
| 19 | N/A | ☑ |
| 20 | N/A | ☑ |
| 21 | N/A | ☑ |
| 22 | N/A | ☑ |
| 23 | N/A | ☑ |
| 24 | ☐ | ☐ |

## Asset publishing checklist

When adding artwork for a chapter:

1. Save the files under `assets/chapter-NN/` and reference them from
   `src/chapter-NN.md`.
2. Add the chapter's asset-path rewrite in `site/book-data.js`:
   - `assetFrom`: `../assets/chapter-NN/` and `/assets/chapter-NN/`
   - `assetTo`: `assets/chapter-NN/`
3. Add the same rewrite to `tools/asset_audit.py`.
4. Increase the shared site edition/cache version whenever assets, paths, or
   reader behavior change. Keep the version synchronized across:
   - `site/app.js`
   - `site/cache-version.js`
   - versioned references in `site/chapter.html` and `site/index.html`
   - chapter artwork scripts that declare a build version
   - `scripts/check-workbook-rendering.mjs`
5. Run the asset audit and confirm every reader-resolved image path exists.
6. Push the change to `main` so the GitHub Pages workflow deploys it.
7. After deployment, open the affected chapter with the new version query and
   confirm that no “Illustration file is missing or empty” fallback appears.
