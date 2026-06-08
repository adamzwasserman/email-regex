# The Real-World Email Regex

*The email validation regex you should actually use, backed by primary analysis of 5,280,739 real email addresses. By Adam Z. Wasserman. Part of the Honest project.*

Interactive version: https://emailregex.honestcode.software/

## The short answer

For signup forms, contact forms, and log parsing, match ASCII alphanumeric characters, single dots, and dashes in the mailbox, an `@`, and a DNS-parsable domain:

```
^[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$
```

This reaches better than five-nines accuracy against real-world consumer addresses. Regex proves an address is well formed, not that it exists. Confirm existence by sending a verification link.

## RFC 5321 supersedes RFC 5322

The popular "email regex is futile" argument relies on RFC 5322, which treats an email address as a generic message header and permits comments and folded whitespace. SMTP delivery is governed by RFC 5321, which restricts the domain to ASCII letters, digits, and hyphens. For practical validation, RFC 5321 has the final word and makes the problem far simpler.

| Aspect | RFC 5322 (message header) | RFC 5321 (SMTP address) |
|---|---|---|
| Domain characters | Comments, whitespace, broad set | ASCII letters, digits, hyphens |
| Comments in parentheses | Legal, even in the domain | Not part of the deliverable address |
| Folded whitespace | Legal (multi-line headers) | Not applicable to delivery |
| Practical relevance | Theoretical edge cases | What actually gets delivered |

## The data: email addresses in the wild

According to Adam Z. Wasserman's analysis of 5,280,739 real email addresses (sampled from 115 million accounts; 99% confidence, 0.055% margin of error):

- 82% contain only ASCII alphanumeric characters
- 97% contain only ASCII alphanumeric characters plus dots
- ~100% contain only ASCII alphanumeric characters, dots, and dashes
- Underscores: 0.00072% (38 addresses)
- Plus signs: 0.00051% (27 addresses)
- Unicode: 0.00002% (one single address)

Business email (Datanyze, 6,771,269 companies, 91 hosts): the top 10 providers hold 95.19% of mailboxes. Gmail for Business (34.35%), Microsoft Exchange Online (33.60%), and GoDaddy/Microsoft 365 (14.71%) all permit only ASCII letters, numbers, and dots at mailbox creation.

## The regex in every language

The same realistic rule, adapted to each engine.

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

**Java**
```java
Pattern.compile("^[A-Za-z0-9](?:[A-Za-z0-9-]|\\.(?!\\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\\.)+[A-Za-z]{2,63}$");
```

**Go** (RE2 has no lookahead, so use a structural variant)
```go
var email = regexp.MustCompile(`^[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*@(?:[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.)+[A-Za-z]{2,63}$`)
```

**PHP** (PCRE)
```php
preg_match('/^[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/', $value);
```

**C# / .NET**
```csharp
Regex.IsMatch(value, @"^[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$");
```

**Ruby** (use `\A` and `\z`, never `^` and `$`, which match line boundaries)
```ruby
EMAIL = /\A[A-Za-z0-9](?:[A-Za-z0-9-]|\.(?!\.)){0,62}[A-Za-z0-9]@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}\z/
```

## Use cases

- **Signup / account creation:** validate shape for instant feedback, but do not block on synchronous validation. Send a verification link and complete signup asynchronously.
- **Contact forms:** accepting plausible-but-fake addresses degrades your database. Validate shape, then verify by email.
- **Parsing logs / bulk text:** this is the genuine use case for email regex. Use one compiled pattern in a single pass; scope it to the characters the data can contain. A compiled pattern can process hundreds of millions of lines on a laptop in minutes.

## Can regex match balanced parentheses?

Not with a formally regular expression. Balanced parentheses form the Dyck language, which is context-free, not regular; the pumping lemma proves no finite automaton can count nesting depth. Engines that extend beyond regular languages can:

- PCRE / Perl / Ruby / Python's `regex` module: recursion, e.g. `(?<paren>\((?:[^()]|(?&paren))*\))`
- .NET: balancing groups, e.g. `^(?:[^()]|\((?<d>)|\)(?<-d>))*(?(d)(?!))$`
- Any engine including JavaScript: only by unrolling to a fixed maximum depth (still regular because depth is finite).

JavaScript has neither recursion nor balancing groups. The pragmatic answer is to count rather than match: a one-pass linear scan that increments on `(`, decrements on `)`, and fails on a negative count or a nonzero final count.

## FAQ

**Can you validate an email address with regex?** Yes, for practical purposes. RFC 5321 restricts the domain to ASCII letters, digits, and hyphens, and real-world data shows ASCII alphanumeric, dots, and dashes cover better than 99.999% of addresses. Regex cannot tell you whether an address exists; send a verification link for that.

**Should I use RFC 5321 or RFC 5322?** RFC 5321. It governs SMTP, which is how email is actually delivered.

**Is a plus sign valid?** Yes, under RFC 5321, and used for sub-addressing. It is rare (0.00051%), so the strict realistic pattern omits it; add `+` to the mailbox class if you support plus-addressing.

**Are email addresses case sensitive?** The domain is case insensitive; the mailbox is technically case sensitive but treated insensitively in practice. Lowercase for storage and comparison.

**Is it worth validating every RFC 5322 edge case?** No. In 5.28 million addresses, exactly one used Unicode. Scope the regex to inputs that actually occur.

## Source

Original article: *On the Practicality of Regex for Email Address Processing* (HackerNoon).
Interactive version: https://emailregex.honestcode.software/
