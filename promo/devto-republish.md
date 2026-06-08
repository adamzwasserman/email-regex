Paste everything below (including the --- frontmatter) into a new dev.to draft. The canonical_url
tells Google the original is your site, so this republish builds authority for the site instead of
competing with it. dev.to allows a maximum of four tags. Set published to true when ready.

---
title: The email regex you should actually use (backed by 5.28M addresses)
published: false
canonical_url: https://emailregex.honestcode.software/
cover_image: https://emailregex.honestcode.software/og.png
tags: regex, webdev, javascript, programming
---

Every few months someone reposts the legendary RFC 5322 email regex, and the "you cannot validate
email with regex" takes follow. Both miss the practical point. Here is the regex you should actually
use, why it works, and the data behind it.

> There is a live, interactive version of this post (test any address, run the suite, see the data
> move) at **[emailregex.honestcode.software](https://emailregex.honestcode.software/)**.

## The short answer

For signup forms, contact forms, and log parsing, match ASCII alphanumeric characters, single dots,
and dashes in the mailbox, an `@`, and a DNS-parsable domain:

```
^[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$
```

This reaches better than five-nines accuracy against real-world consumer addresses. Regex proves an
address is well formed, not that it exists. Confirm existence by sending a verification link.

## RFC 5321 supersedes RFC 5322

The "futility" argument relies on RFC 5322, which treats an email address as a generic message header
and permits comments and folded whitespace, even inside a domain. But email is delivered over SMTP,
governed by RFC 5321, which restricts the domain to ASCII letters, digits, and hyphens. For practical
validation, RFC 5321 has the final word, and it makes the problem far simpler.

## The data: what email actually looks like in the wild

I analyzed 5,280,739 real email addresses (sampled from 115 million accounts; 99% confidence, 0.055%
margin of error):

- 82% contain only ASCII alphanumeric characters
- 97% contain only ASCII alphanumeric characters plus dots
- ~100% contain only ASCII alphanumeric characters, dots, and dashes
- Underscores: 0.00072% (38 addresses)
- Plus signs: 0.00051% (27 addresses)
- Unicode: 0.00002% (one single address)

For business email, the top 10 hosting providers cover 95.19% of mailboxes, and the largest three
(Gmail, Microsoft Exchange Online, GoDaddy/Microsoft 365) all permit only ASCII letters, numbers,
and dots at mailbox creation.

## The regex in every language

Same rule, adapted to each engine. Two languages need real care.

**JavaScript / TypeScript**
```js
const EMAIL = /^[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
EMAIL.test(value);
```

**Python** (use `fullmatch`)
```python
import re
EMAIL = re.compile(r"[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}")
bool(EMAIL.fullmatch(value))
```

**Go** (RE2 has no lookahead, so use a structural variant)
```go
var email = regexp.MustCompile(`^[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*@(?:[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.)+[A-Za-z]{2,63}$`)
```

**Ruby** (use `\A` and `\z`, never `^` and `$`, which match line boundaries and let a newline sneak past)
```ruby
EMAIL = /\A[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}\z/
```

(Java, PHP, and C# versions are on the [interactive page](https://emailregex.honestcode.software/#languages).)

## When to use regex, and when not to

- **Signup and contact forms:** validate shape for instant feedback, but do not block on synchronous
  validation. A well-formed address can still be fake. Send a verification link and finish
  asynchronously.
- **Parsing logs or bulk text:** this is the genuine use case for email regex. One compiled pattern
  in a single pass can anonymize hundreds of millions of lines on a laptop in minutes.

## Bonus: can regex match balanced parentheses?

Not with a formally regular expression. Balanced parentheses are the Dyck language, which is
context-free, not regular; the pumping lemma proves no finite automaton can count nesting depth.
Engines beyond regular languages can: PCRE and Perl via recursion (`(?&name)`), and .NET via
balancing groups. JavaScript has neither, so count with a one-pass scan instead. There is a live
balanced-parentheses checker on the site.

## Try it

The interactive version, with a live tester (Realistic and full RFC 5321 with IP literals), the test
suite, a log-redaction playground, and the annotated cookbook, is at
**[emailregex.honestcode.software](https://emailregex.honestcode.software/)**. It is a single static
page, vanilla JavaScript, no tracking, everything runs in your browser.
