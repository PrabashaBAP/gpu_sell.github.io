# Business Plan — GPU Online Store (web version)

An interactive one-page website built from the group business plan document.
Plain HTML, CSS and JavaScript — no build step, no frameworks, no dependencies.

## Files

| File | What it holds |
|---|---|
| `index.html` | All the business plan content (used exactly as written in the doc) |
| `styles.css` | Design tokens, light/dark themes, layout, animations |
| `script.js` | Nav, scroll progress, tabs, accordion, counters, cost bars, theme switch |

## Run it locally

Just open `index.html` in a browser. That's it.

## Put it on GitHub Pages

1. Create a new repository on GitHub (public).
2. Upload `index.html`, `styles.css`, `script.js` and `README.md` to the root of the repo (Add file → Upload files → Commit).
3. Go to **Settings → Pages**.
4. Under **Source** pick **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
5. Wait about a minute and refresh. The link appears at the top:
   `https://<your-username>.github.io/<repo-name>/`

Keep the file named `index.html` in the root — GitHub Pages looks for that file first.

## What is interactive

- Reading progress bar at the very top of the page
- Section index on the left that highlights the section you are reading (turns into a scrollable chip bar on phones)
- Light / dark theme switch, remembered between visits
- Animated counters for the sales target, stock count and partnerships
- Financial Projection split into four tabs with a sliding underline
- Cash flow cost bars that grow when the tab opens — click any row to see a note
- Appendix accordion
- Section reveal on scroll, disabled automatically for anyone using "reduce motion"

## Notes

- Every sentence, bullet and figure comes from the business plan document and has not been edited.
- The one calculated value on the page is the cash flow total, which adds up the cost figures already listed in the plan. It is labelled as such.
- Fonts load from Google Fonts. Offline, the page falls back to system fonts and still looks fine.
