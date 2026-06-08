# The Real-World Email Regex

An interactive, single-page site adapted from the article *On the Practicality of Regex for
Email Address Processing* by Adam Z. Wasserman. Part of the Honest project.

Tool-first, terminal aesthetic, dependency-free static site. All regex matching runs in the
browser; nothing the user types is sent anywhere.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page. Semantic HTML, JSON-LD (TechArticle, Dataset, FAQPage). |
| `styles.css` | Terminal aesthetic, dark default with a light toggle. |
| `app.js` | Live tester, decision widget, redaction playground, cookbook builder, test runner. |
| `llms.txt` | GEO: a clean, quotable summary for answer engines. |
| `robots.txt`, `sitemap.xml` | Crawl/index hints. |

## Interactive pieces

1. **Live tester** — paste an address, capture groups highlight, verdict updates as you type.
   Toggle Practical / RFC 5321 / Full Monty.
2. **The data** — the 82/15/3 distribution and the business-host Pareto, as pure-CSS bars.
3. **Decision widget** — signup / contact form / log parsing maps to the right strategy.
4. **Redaction playground** — paste log text, redact every address in one pass.
5. **Cookbook builder** — toggle composable regex chunks, watch the pattern assemble.
6. **Test runner** — runs the Practical and 5321 patterns against contentious cases live.

## Regex fidelity note

The **Practical** and **RFC 5321** modes run natively in the JavaScript engine. The **Full Monty**
(RFC 5322 with POSIX classes, folded whitespace, and IPv6 literals) cannot run in JS and is shown
as copyable Python. The redaction pattern is a JavaScript adaptation of the original Python log-miner.

## Before launch

- Replace the placeholder domain `realworldemailregex.com` throughout (`index.html` canonical/OG,
  `llms.txt`, `robots.txt`, `sitemap.xml`) with the real domain.
- Add an Open Graph image and reference it via `og:image` / `twitter:image`.
- Point the Regex101 link in the Full Monty section at the saved pattern.
- Confirm the canonical strategy: this page as canonical, HackerNoon as syndication, or vice versa.

## Deploy

Pure static. Drop the directory on any static host (Render static site, etc.). No build step.
