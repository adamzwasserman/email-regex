# Reddit

Reddit posts get retrieved heavily by Perplexity and ChatGPT search, so these double as GEO. Each
subreddit has different norms; do not cross-post identical text the same day. Read each sub's rules
on self-promotion first. Engage in the comments quickly.

---

## r/programming

Norms: descriptive title, no clickbait, substance in comments. Link post.

**Title:**
> The email regex you should actually use, backed by analysis of 5.28 million addresses

**First comment:**
The standard advice is that validating email with regex is futile. That argument rests on RFC 5322
(message headers, which allow comments and folded whitespace). But delivery runs on SMTP, and RFC
5321 restricts the domain to ASCII letters, digits, and hyphens. I analyzed 5,280,739 real addresses
to see what actually occurs: 82% are ASCII alphanumeric only, 97% add only dots, ~100% add only
dashes, and exactly one used Unicode. So a simple ASCII alphanumeric/dots/dashes pattern reaches
five-nines on real input. The page is an interactive tester (Realistic vs full RFC 5321 with IP
literals), a test-suite runner, and the dataset. Vanilla JS, no tracking. Critique the methodology.

---

## r/webdev

Norms: tools and "I built" posts are welcome. More casual.

**Title:**
> I built an interactive email-regex tester (Realistic vs Ludicrous RFC modes) and analyzed 5.28M addresses to back it up

**First comment:**
Every few months someone reposts the giant RFC 5322 email regex and the "don't validate email with
regex" takes follow. I wanted a practical answer, so I analyzed 5.28M real addresses (82% ASCII
alphanumeric only, ~100% once you allow dots and dashes) and built a tool around it: paste any
address, watch the capture groups light up, flip between a realistic pattern and the full RFC 5321
one with IPv4/IPv6 literals, run the contentious test cases, and try a log-redaction playground.
Copy-paste snippets for JS, Python, Java, Go, PHP, C#, and Ruby (with the Go RE2 and Ruby anchor
gotchas handled). No framework, no build, runs entirely in your browser. Feedback welcome.

---

## r/webdev "Showoff Saturday" variant (if posting on a weekend)

**Title:**
> [Showoff Saturday] The Real-World Email Regex: a data-backed, interactive take on the email regex debate

(Use the r/webdev first comment above.)

---

## Other subs worth a tailored post

- r/javascript (lead with the in-browser tester and the JS pattern; mention the `d` flag for
  capture-group indices)
- r/regex (lead with the cookbook, the IPv6 literal pattern, and the balanced-parentheses section)
- r/SEO or r/juststart only if framed as a case study, not a tool drop
