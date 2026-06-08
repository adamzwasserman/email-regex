/* ============================================================
   The Real-World Email Regex — interactive workbench
   Vanilla JS, no dependencies. All regex runs in the browser.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- regex modes -----------------------------------
     Built with the constructor so we control escaping cleanly.
     The 'd' flag gives us match.indices.groups for highlighting.
  ---------------------------------------------------------- */
  var BASIC = "A-Za-z0-9";
  var SPECIAL = "A-Za-z0-9!#$%&'*+/=?^_`{|}~";

  // domain building blocks
  var DNS = "(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\\.)+[A-Za-z]{2,63}";
  var OCT = "(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
  var IPV4 = "(?:" + OCT + "\\.){3}" + OCT;
  var IPV4LIT = "\\[" + IPV4 + "\\]";
  var H = "[0-9A-Fa-f]{1,4}";
  var IPV6 = "(?:" +
    "(?:" + H + ":){7}" + H + "|" +
    "(?:" + H + ":){1,7}:|" +
    "(?:" + H + ":){1,6}:" + H + "|" +
    "(?:" + H + ":){1,5}(?::" + H + "){1,2}|" +
    "(?:" + H + ":){1,4}(?::" + H + "){1,3}|" +
    "(?:" + H + ":){1,3}(?::" + H + "){1,4}|" +
    "(?:" + H + ":){1,2}(?::" + H + "){1,5}|" +
    H + ":(?::" + H + "){1,6}|" +
    ":(?:(?::" + H + "){1,7}|:)|" +
    "::(?:ffff(?::0{1,4})?:)?" + IPV4 + "|" +
    "(?:" + H + ":){1,4}:" + IPV4 +
    ")";
  var IPV6LIT = "\\[IPv6:" + IPV6 + "\\]";

  function mailboxGroup(charClass) {
    return "(?<mailbox>[" + charClass + "](?:[" + charClass + "-]|\\.(?!\\.)){0,62}[" + charClass + "]" +
           "|[" + charClass + "])";
  }
  function buildEmailRe(charClass, domainAlt) {
    return new RegExp("^" + mailboxGroup(charClass) + "(?<at>@)(?<domain>" + domainAlt + ")$", "d");
  }

  // Two speeds. Realistic = practical default. Ludicrous = full RFC 5321
  // compliance attempt, address literals included. Both run natively in JS.
  var MODES = {
    realistic: {
      label: "Realistic",
      re: buildEmailRe(BASIC, DNS),
      note: "Realistic speed: ASCII alphanumeric, single dots, and dashes in the mailbox, and a DNS domain. Covers better than five-nines of real-world addresses."
    },
    ludicrous: {
      label: "Ludicrous",
      re: buildEmailRe(SPECIAL, DNS + "|" + IPV4LIT + "|" + IPV6LIT),
      note: "Ludicrous speed: the full RFC 5321 compliance attempt. Adds every conditionally-legal mailbox character, plus bracketed IPv4 and IPv6 address literals as the domain."
    }
  };

  /* ---------- live tester ----------------------------------- */
  var input = document.getElementById("email-input");
  var verdict = document.getElementById("verdict");
  var highlight = document.getElementById("highlight");
  var modeNote = document.getElementById("mode-note");
  var activePattern = document.getElementById("active-pattern-code");
  var currentSpeed = "realistic";

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderTester() {
    var value = input.value;

    if (currentSpeed === "plaid") {
      activePattern.textContent = "(RFC 5322 itself: POSIX classes, folded whitespace, the works. Not runnable in a browser. See the Full Monty below.)";
      verdict.className = "verdict na";
      verdict.textContent = "✦ THEY'VE GONE TO PLAID — too fast to measure";
      highlight.innerHTML = '<span class="g-none">' + esc(value) + "</span>";
      modeNote.textContent = "Plaid speed is RFC 5322 in full. No browser regex engine can run it; this is as fast as the dial goes.";
      return;
    }

    var mode = MODES[currentSpeed];
    activePattern.textContent = mode.re.source;

    var m = value.match(mode.re);
    if (m) {
      verdict.className = "verdict pass";
      verdict.textContent = "✓ PASS — valid at " + mode.label + " speed";
      highlight.innerHTML = buildHighlight(value, m.indices.groups);
    } else {
      verdict.className = "verdict fail";
      verdict.textContent = "✗ FAIL — invalid at " + mode.label + " speed";
      highlight.innerHTML = '<span class="g-none">' + esc(value) + "</span>";
    }
    modeNote.textContent = mode.note;
  }

  function buildHighlight(value, groups) {
    // groups: { mailbox:[s,e], at:[s,e], domain:[s,e] }
    var spans = [];
    ["mailbox", "at", "domain"].forEach(function (name) {
      var g = groups[name];
      if (g) spans.push({ s: g[0], e: g[1], cls: "g-" + name });
    });
    spans.sort(function (a, b) { return a.s - b.s; });
    var out = "";
    var pos = 0;
    spans.forEach(function (sp) {
      if (sp.s > pos) out += '<span class="g-none">' + esc(value.slice(pos, sp.s)) + "</span>";
      out += '<span class="' + sp.cls + '">' + esc(value.slice(sp.s, sp.e)) + "</span>";
      pos = sp.e;
    });
    if (pos < value.length) out += '<span class="g-none">' + esc(value.slice(pos)) + "</span>";
    return out || '<span class="g-none"></span>';
  }

  input.addEventListener("input", renderTester);

  // Global speed: drives the tester and the test suite. All speed-toggle
  // controls on the page stay in sync.
  function setSpeed(speed) {
    currentSpeed = speed;
    document.body.setAttribute("data-speed", speed);
    document.querySelectorAll(".speed-btn").forEach(function (b) {
      var on = b.getAttribute("data-speed") === speed;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderTester();
    runTests();
  }
  document.querySelectorAll(".speed-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { setSpeed(btn.getAttribute("data-speed")); });
  });

  // populate the ludicrous-section code block from the live pattern
  var ludCode = document.getElementById("ludicrous-code");
  if (ludCode) ludCode.textContent = MODES.ludicrous.re.source;

  /* ---------- copy buttons ---------------------------------- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      var text = target.innerText || target.textContent;
      navigator.clipboard.writeText(text).then(function () {
        var old = btn.textContent;
        btn.textContent = "copied";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = old; btn.classList.remove("copied"); }, 1400);
      });
    });
  });

  /* ---------- decision widget ------------------------------- */
  var DECISIONS = {
    signup: {
      tag: "fire-and-forget",
      title: "Validate the form, but confirm by email",
      body: "Check the string with the practical regex so you catch typos at the point of entry. Do not block account creation on synchronous validation: a well-formed address may still not exist, and synchronous checks do not scale. Pass the form to a microservice that emails a unique verification link and completes signup asynchronously."
    },
    contact: {
      tag: "fire-and-forget",
      title: "Regex for shape, verification for truth",
      body: "A contact form that accepts plausible-but-fake addresses quietly degrades your marketing database. The regex confirms the address looks valid; only a verification email confirms it exists. Use the practical pattern for instant feedback, then verify out of band."
    },
    logs: {
      tag: "regex is the right tool",
      title: "This is what regex is actually for",
      body: "Anonymising or mining email addresses from large volumes of unstructured text is the genuine use case. A single compiled pattern applied in one pass over the file beats character-by-character looping by orders of magnitude. Scope it to the characters your data can actually contain. Try the redaction playground above."
    }
  };

  var deciderOut = document.getElementById("decider-out");
  function renderDecider(key) {
    var d = DECISIONS[key];
    deciderOut.innerHTML =
      '<span class="verdict-tag">' + d.tag + "</span>" +
      "<h4>" + d.title + "</h4>" +
      "<p>" + d.body + "</p>";
  }
  document.querySelectorAll(".decider .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.querySelectorAll(".decider .chip").forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      renderDecider(chip.getAttribute("data-case"));
    });
  });
  renderDecider("signup");

  /* ---------- redaction playground -------------------------- */
  // JS adaptation: match emails and the %40 URL-encoded form,
  // while skipping image filenames such as imagefile@2x.png.
  // Local-part class excludes / = ? on purpose: those are URL characters,
  // and including them makes the matcher swallow surrounding URL text.
  var REDACT_RE = /[A-Za-z0-9!#$%&'*+^_`{|}~.-]+(?:@|%40)(?!(?:\w+\.)*(?:jpg|jpeg|png|gif|webp|svg))(?:[\w-]+\.)+[\w-]+/gi;

  var redactIn = document.getElementById("redact-in");
  var redactOut = document.getElementById("redact-out");
  var redactCount = document.getElementById("redact-count");

  document.getElementById("redact-run").addEventListener("click", function () {
    var text = redactIn.value;
    var n = 0;
    var marked = esc(text).replace(REDACT_RE, function (match) {
      n++;
      return "<mark>redacted@example.com</mark>";
    });
    redactOut.innerHTML = marked;
    redactCount.textContent = n === 1 ? "1 address redacted" : n + " addresses redacted";
  });

  /* ---------- cookbook builder ------------------------------ */
  var CHUNKS = [
    {
      id: "anchor", name: "^ anchor", tag: "optional", on: true, required: false,
      pattern: "^",
      desc: "Anchors the match to the start of the string. Use it when validating a string that should contain nothing but an email. Omit it to find an email inside longer text."
    },
    {
      id: "mailbox", name: "mailbox", tag: "required", on: true, required: true,
      pattern: "(?<mailbox>([a-zA-Z0-9+!#$%&'*\\-/=?_{}|~]",
      desc: "The unconditionally legal characters, as a character class. Excludes the dot, quotes, and parentheses, which are only conditionally legal and handled separately."
    },
    {
      id: "singleDot", name: "singleDot", tag: "rule", on: true, required: false,
      pattern: "|(?<singleDot>(?<!\\.)(?<!^)\\.(?!\\.))",
      desc: "A dot is only legal as a separator between strings of legal characters. The negative lookbehinds forbid a leading dot and a doubled dot; the lookahead forbids a following dot."
    },
    {
      id: "fws", name: "foldedWhiteSpace", tag: "5322 only", on: false, required: false,
      pattern: "|(?<foldedWhiteSpace>\\s?\\r\\n.)",
      desc: "RFC 5322 allows multi-line headers via folded whitespace. Almost certainly never used in a real address. Included only to play the 5322 game."
    },
    {
      id: "mboxlen", name: "{1,64}", tag: "required", on: true, required: true,
      pattern: "){1,64})",
      desc: "Closes the mailbox group and bounds it to the maximum legal mailbox length of 64 characters."
    },
    {
      id: "atSign", name: "atSign", tag: "required", on: true, required: true,
      pattern: "\\s?(?<atSign>(?<!-)(?<!\\.)@(?!@))",
      desc: "The delimiter. A space is technically legal just before it. It will not match if preceded by a dot or dash, or if followed by another @."
    },
    {
      id: "dns", name: "dns domain", tag: "required", on: true, required: false,
      pattern: "(?<dns>[[:alnum:]]([[:alnum:]\\-]{0,63}\\.){1,24}[[:alnum:]\\-]{1,63}[[:alnum:]])",
      desc: "Standard DNS-parsable domain. Complies strictly with RFC 5321: ASCII letters, digits, and hyphens only."
    },
    {
      id: "ipv4", name: "IPv4 literal", tag: "optional", on: false, required: false,
      pattern: "|(?<IPv4>\\[((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\])",
      desc: "A bracketed IPv4 address literal, the well-known dotted-quad pattern with each octet bounded to 0-255."
    },
    {
      id: "endgrp", name: "close domain + $", tag: "required", on: true, required: false,
      pattern: ")$",
      desc: "Closes the domain alternation group and anchors the end of the string. Drop the $ when searching inside longer text."
    }
  ];

  var chunkList = document.getElementById("chunk-list");
  var assembled = document.getElementById("assembled-code");
  var state = {};
  CHUNKS.forEach(function (c) { state[c.id] = c.on; });

  function renderChunks() {
    chunkList.innerHTML = "";
    CHUNKS.forEach(function (c) {
      var div = document.createElement("div");
      div.className = "chunk" + (c.required ? " required" : "");
      div.innerHTML =
        '<label class="chunk-head">' +
          '<input type="checkbox" ' + (state[c.id] ? "checked" : "") + (c.required ? " disabled" : "") + ' data-chunk="' + c.id + '">' +
          '<span class="chunk-name">' + esc(c.name) + "</span>" +
          '<span class="chunk-tag">' + c.tag + "</span>" +
        "</label>" +
        '<div class="chunk-body">' +
          "<pre>" + esc(c.pattern) + "</pre>" +
          "<p>" + esc(c.desc) + "</p>" +
        "</div>";
      chunkList.appendChild(div);
    });
    chunkList.querySelectorAll("input[data-chunk]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        state[cb.getAttribute("data-chunk")] = cb.checked;
        assemble();
      });
    });
  }

  function assemble() {
    var parts = CHUNKS.filter(function (c) { return state[c.id]; }).map(function (c) { return c.pattern; });
    assembled.textContent = parts.join("");
  }

  renderChunks();
  assemble();

  /* ---------- test suite ------------------------------------ */
  var TESTS = [
    { addr: "john.doe@example.com", note: "Ordinary address: passes everywhere." },
    { addr: "a@b.co", note: "Minimal valid address." },
    { addr: "ops-team@mail.server-01.net", note: "Dashes in mailbox and domain are fine." },
    { addr: "user+tag@gmail.com", note: "Plus sign: outside the realistic class, legal at ludicrous speed." },
    { addr: "john_doe@example.com", note: "Underscore: rare (0.00072%), legal at ludicrous speed." },
    { addr: "john..doe@example.com", note: "Doubled dot: illegal at every speed." },
    { addr: ".john@example.com", note: "Leading dot: illegal at every speed." },
    { addr: "joão@example.com", note: "Unicode: one in 5.28M. ASCII-only patterns reject it." },
    { addr: "john@[192.168.1.1]", note: "IPv4 literal: needs ludicrous speed." },
    { addr: "user@[IPv6:2001:db8::1]", note: "IPv6 literal: needs ludicrous speed." },
    { addr: "john(comment)@example.com", note: "Parenthesised comment: legal only under RFC 5322 (the plaid tier)." },
    { addr: "\"john doe\"@example.com", note: "Quoted string: legal only under RFC 5322 (the plaid tier)." },
    { addr: "john@localhost", note: "No dotted domain and not a literal: rejected at every speed." }
  ];

  var testsBody = document.getElementById("tests-body");
  function pill(ok) {
    return ok
      ? '<span class="pill yes">PASS</span>'
      : '<span class="pill no">FAIL</span>';
  }
  function runTests() {
    testsBody.innerHTML = "";
    var activeCol = currentSpeed === "ludicrous" ? 3 : (currentSpeed === "realistic" ? 2 : 0);
    TESTS.forEach(function (t) {
      var re = MODES.realistic.re;     // no /g flag, so .test has no lastIndex state
      var lu = MODES.ludicrous.re;
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + esc(t.addr) + "</td>" +
        '<td' + (activeCol === 2 ? ' class="active-col"' : '') + ">" + pill(re.test(t.addr)) + "</td>" +
        '<td' + (activeCol === 3 ? ' class="active-col"' : '') + ">" + pill(lu.test(t.addr)) + "</td>" +
        '<td class="note">' + esc(t.note) + "</td>";
      testsBody.appendChild(tr);
    });
  }
  document.getElementById("run-tests").addEventListener("click", runTests);

  /* ---------- balanced-parentheses checker ------------------ */
  var parenInput = document.getElementById("paren-input");
  var parenVerdict = document.getElementById("paren-verdict");
  var parenHi = document.getElementById("paren-highlight");

  function renderParens() {
    var s = parenInput.value;
    var depth = 0;
    var firstError = -1;
    var html = "";
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === "\\") {
        // escaped char: render this and the next literally, dimmed
        html += '<span class="g-none">' + esc(s.slice(i, i + 2)) + "</span>";
        i++;
        continue;
      } else if (c === "(") {
        html += '<span class="p-d' + (depth % 4) + '">(</span>';
        depth++;
      } else if (c === ")") {
        depth--;
        if (depth < 0 && firstError < 0) {
          firstError = i;
          html += '<span class="p-err">)</span>';
          depth = 0;
        } else {
          html += '<span class="p-d' + (depth % 4) + '">)</span>';
        }
      } else {
        html += '<span class="g-none">' + esc(c) + "</span>";
      }
    }
    parenHi.innerHTML = html || '<span class="g-none"></span>';

    if (firstError >= 0) {
      parenVerdict.className = "verdict fail";
      parenVerdict.textContent = "✗ UNBALANCED — a closing paren has no opener (position " + (firstError + 1) + ")";
    } else if (depth > 0) {
      parenVerdict.className = "verdict fail";
      parenVerdict.textContent = "✗ UNBALANCED — " + depth + " opening paren" + (depth === 1 ? "" : "s") + " left unclosed";
    } else {
      parenVerdict.className = "verdict pass";
      parenVerdict.textContent = "✓ BALANCED";
    }
  }
  parenInput.addEventListener("input", renderParens);
  renderParens();

  /* ---------- theme toggle ---------------------------------- */
  var themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", function () {
    var cur = document.body.getAttribute("data-theme");
    document.body.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
  });

  /* ---------- plaid easter egg (Spaceballs) ---------------- */
  var plaidOverlay = document.getElementById("plaid-overlay");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function enterPlaid() {
    currentSpeed = "plaid";
    document.body.setAttribute("data-speed", "plaid");
    document.querySelectorAll(".speed-btn").forEach(function (b) {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    renderTester();
    runTests();
    if (!plaidOverlay) return;
    plaidOverlay.classList.remove("go");
    void plaidOverlay.offsetWidth;     // force reflow so the animation can restart
    plaidOverlay.classList.add("go");
    var hold = reduceMotion ? 1400 : 2800;
    setTimeout(function () { plaidOverlay.classList.remove("go"); }, hold);
  }

  var plaidTrigger = document.getElementById("plaid-trigger");
  if (plaidTrigger) plaidTrigger.addEventListener("click", enterPlaid);

  // secret: type "plaid" anywhere
  var typed = "";
  document.addEventListener("keydown", function (e) {
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-5);
    if (typed === "plaid") { typed = ""; enterPlaid(); }
  });

  /* ---------- init ----------------------------------------- */
  setSpeed("realistic");   // renders tester + runs the test suite once
})();
