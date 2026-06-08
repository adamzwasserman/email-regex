# YouTube package

A 4-to-5 minute contrarian-data explainer built around screen-recording the live tester. The asset
is genuinely video-worthy because of two hooks: the contrarian thesis and the 5.28M-address stat.
Note: YouTube description links are nofollow (no ranking equity), so the value here is reach, a
second search surface, and an AI-citation surface, not backlinks.

---

## Titles (CTR plus keyword; pick one, A/B if you can)

1. I Analyzed 5,280,739 Emails to Settle the Email Regex Debate
2. Stop Overthinking Email Regex (I Checked 5 Million Addresses)
3. The Email Regex Everyone Gets Wrong

Primary recommendation: #1 (specific number drives clicks and is honest).

## Thumbnail

- Background: the site's dark terminal look (near-black, JetBrains Mono).
- Big text, two lines: `5,280,739 EMAILS` then `THE REGEX YOU ACTUALLY NEED`.
- Small green-to-gold accent: `82% -> 97% -> ~100%`.
- Optional face in corner with a skeptical expression. Keep words under 7 total.

## Description (paste as-is, links up top)

I analyzed 5,280,739 real email addresses to answer a question that starts a fight in every comment
section: can you validate email with a regex? The short version is yes, for practical purposes, and
the famous "futility" argument is solving the wrong problem.

Try the interactive tool (live tester, the data, the full RFC patterns):
https://emailregex.honestcode.software/

The recommended regex:
^[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$

Original article: https://hackernoon.com/on-the-practicality-of-regex-for-email-address-processing
Source code: https://github.com/adamzwasserman/email-regex

Chapters:
0:00 The email regex fight
0:30 RFC 5321 beats RFC 5322
1:15 I analyzed 5.28 million addresses
2:15 The regex you should actually use
3:00 Live demo: the tester
3:45 Realistic vs Ludicrous (IPv6 literals)
4:30 They've gone to plaid
4:50 The one rule: shape is not existence

#regex #webdev #programming #javascript #emailvalidation

---

## Voiceover script

### 0:00 — Hook
Here is a regex that is supposed to validate an email address. [show the monstrous RFC 5322 regex
filling the screen] It is real, it is technically correct, and you should almost never use it.
Because the advice that grew up around this monster, that validating email with regex is futile, is
solving the wrong problem. I analyzed over five million real email addresses to prove it, and at the
end I will give you the regex you should actually use.

### 0:30 — RFC 5321 beats RFC 5322
That giant regex implements RFC 5322, which describes email addresses as generic message headers. Under
those rules, comments in parentheses and even folded whitespace are legal, including inside the domain.
But your email is not a message header floating in the void. It is delivered over SMTP, and SMTP is
governed by a different document, RFC 5321. RFC 5321 says the domain is restricted to ASCII letters,
digits, and hyphens. That one rule throws out most of the scary edge cases before you write a single
character of regex.

### 1:15 — The data
Theory is nice. I wanted to know what email actually looks like in the wild, so I analyzed 5,280,739
real addresses. [bring up the chart] 82% use nothing but ASCII letters and numbers. Add dots, and you
are at 97%. Add dashes, and you are at essentially 100%. Underscores and plus signs are rounding
errors. Unicode? In five million addresses, there was exactly one. So if your regex accepts ASCII
letters, numbers, dots, and dashes, you are correct better than 99.999% of the time on real input.

### 2:15 — The regex you should use
Here it is. [show the recommended regex, highlight parts as described] Start and end on an alphanumeric
character, allow single dots and dashes in between but never two dots in a row, cap the mailbox at 64
characters, an at sign, then a normal DNS domain. That is the whole thing. It is readable, it is fast,
and it matches reality.

### 3:00 — Live demo
And you can try it yourself. [screen-record the site] Type an address and the match splits into its
parts: the mailbox in blue, the at sign in gold, the domain in green, with a live pass or fail. Watch
what happens with two dots in a row. Rejected. A leading dot. Rejected. A normal address. Clean pass.

### 3:45 — Realistic vs Ludicrous
Now flip the speed. Realistic is the pattern I just showed you. Ludicrous is the full RFC 5321
compliance attempt: it adds every legal special character and even bracketed IPv4 and IPv6 address
literals. [type john@[192.168.1.1] and user@[IPv6:2001:db8::1]] These fail on realistic and pass on
ludicrous. You almost never need them, which is exactly the point.

### 4:30 — Gone to plaid
And because RFC 5322 takes you one step past ludicrous, there is, of course, a plaid mode. [trigger
the plaid easter egg] They have gone to plaid.

### 4:50 — The one rule
Here is the one rule to remember. A regex proves an address is shaped like an email. It cannot prove
the address exists. So validate the shape for instant feedback, then send a verification link to prove
it is real. Shape is not existence. The tool, the data, and the per-language versions are all linked
below. Thanks for watching.

---

## Shot-by-shot storyboard

| Time | Visual | Source |
|---|---|---|
| 0:00 | The full RFC 5322 "Full Monty" pattern scrolling to fill the frame | Screen-record the Full Monty section / Python block |
| 0:30 | Split screen: "5322 = message header" vs "5321 = SMTP delivery"; then the comparison table | Screen-record the "RFC 5321 vs 5322" table |
| 1:15 | The 82 / 97 / 100% bar chart animating in; then the rare-feature fineprint | Screen-record the data section bars |
| 2:15 | The recommended regex, zoomed; highlight mailbox, dot rule, @, domain in turn | Hero code block, or a slide |
| 3:00 | Type in the tester: good address, then `john..doe@`, then `.john@` | Live screen-record of the tester |
| 3:45 | Click Realistic -> Ludicrous; type the two IP-literal addresses | Live screen-record, speed toggle |
| 4:30 | Type the word "plaid" and let the tartan splash play | Live screen-record of the easter egg |
| 4:50 | The decision widget (signup / contact / logs) and the "verify by email" line | Screen-record the use-case decider |
| outro | Site URL card + subscribe | Static end card |

## Production notes

- Record the browser at 1080p or higher, dark theme, zoom the page to ~125% so code is legible on
  mobile.
- The plaid easter egg is the payoff; do not explain it beforehand, just trigger it.
- Keep total length under 5 minutes. Tighter is better for retention.
- Caption everything (auto-captions then correct). YouTube indexes the transcript, which is what AI
  answer engines retrieve, so accurate captions are a GEO asset.
- Pin a top comment with the regex and the site link.
