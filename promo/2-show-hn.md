# Show HN

HN rewards substance, methodology, and a defensible contrarian claim. Lead with the data and the
thesis, not the tool. Be ready to defend the methodology in comments; that is where HN traffic
converts. Post Tue to Thu, roughly 8-10am ET. Submit the URL, then immediately add the text below
as the first comment.

## Title (pick one, keep under 80 chars)

Primary:
> Show HN: I analyzed 5.28M email addresses to find the regex you should actually use

Alternates:
> Show HN: The real-world email regex, backed by 5.28M addresses (interactive)
> Show HN: Stop overthinking email regex. Here is the data and a live tester

## URL

https://emailregex.honestcode.software/

## First comment (post immediately after submitting)

The "you can't validate email with regex" canon is built on RFC 5322, which treats an address as a
generic message header and allows comments and folded whitespace. But email is delivered over SMTP,
and RFC 5321 restricts the domain to ASCII letters, digits, and hyphens. That one constraint makes
the practical problem far simpler than the famous edge-case tour suggests.

To check what actually occurs in the wild, I analyzed 5,280,739 real addresses:

- 82% use only ASCII alphanumeric characters
- 97% use only ASCII alphanumeric plus dots
- ~100% use only ASCII alphanumeric, dots, and dashes
- Unicode: exactly one address in the whole sample

So a regex matching ASCII alphanumeric, single dots, and dashes hits better than five-nines on real
consumer email. The site is a single static page (vanilla JS, no framework, no build) where you can:

- test any address against a Realistic pattern and a full RFC 5321 pattern (IPv4 and IPv6 literals
  included), with capture groups highlighted live
- run the contentious "futility" test cases and see exactly where the two patterns diverge
- paste log text into a redaction playground
- build the RFC pattern chunk by chunk in an annotated cookbook
- read why balanced parentheses are formally impossible in pure regex (Dyck language), with the
  PCRE recursion and .NET balancing-group escapes that do work

Methodology, caveats, and the per-language snippets (including the Go RE2 no-lookahead variant and
the Ruby \A...\z anchor gotcha) are all on the page. Happy to defend or correct any of it. The core
claim I am most interested in stress-testing: for real signup and contact-form validation, shape
matching plus a verification email beats chasing RFC 5322 completeness every time.

(It is by me; part of a project called Honest. There is also a Spaceballs joke hidden in it.)
