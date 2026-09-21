/* ============================================================
   Business Plan — interactions
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. theme ---------- */
  var themeBtn = document.getElementById("theme-btn");
  var label = themeBtn.querySelector(".theme-label");

  function setTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    label.textContent = mode === "dark" ? "Light" : "Dark";
    themeBtn.setAttribute("aria-label", mode === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem("bp-theme", mode); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem("bp-theme"); } catch (e) {}
  if (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) saved = "dark";
  setTheme(saved === "dark" ? "dark" : "light");

  themeBtn.addEventListener("click", function () {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- 2. build nav from the sections ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll(".sec[data-nav]"));
  var railList = document.getElementById("rail-list");
  var chipTrack = document.getElementById("chipnav-track");

  sections.forEach(function (sec) {
    var name = sec.getAttribute("data-nav");

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + sec.id;
    a.textContent = name;
    li.appendChild(a);
    railList.appendChild(li);

    var chip = document.createElement("a");
    chip.href = "#" + sec.id;
    chip.className = "chip";
    chip.textContent = name;
    chipTrack.appendChild(chip);
  });

  var railLinks = railList.querySelectorAll("a");
  var chips = chipTrack.querySelectorAll(".chip");

  function markActive(index) {
    for (var i = 0; i < railLinks.length; i++) {
      railLinks[i].classList.toggle("is-active", i === index);
      chips[i].classList.toggle("is-active", i === index);
    }
    var active = chips[index];
    if (active && chipTrack.scrollWidth > chipTrack.clientWidth) {
      var target = active.offsetLeft - chipTrack.clientWidth / 2 + active.offsetWidth / 2;
      chipTrack.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
    }
  }

  /* ---------- 3. scroll progress + active section + sticky bar ---------- */
  var fill = document.getElementById("scrollbar-fill");
  var topbar = document.querySelector(".topbar");
  var ticking = false;

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.width = pct.toFixed(2) + "%";
    topbar.classList.toggle("is-stuck", window.scrollY > 12);

    var line = window.scrollY + window.innerHeight * 0.32;
    var current = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= line) current = i;
    }
    markActive(current);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- 4. reveal sections on scroll ---------- */
  if ("IntersectionObserver" in window && !reduced) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    sections.forEach(function (s) { revealObs.observe(s); });
  } else {
    sections.forEach(function (s) { s.classList.add("is-in"); });
  }

  /* ---------- 5. number counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    if (reduced) { el.textContent = prefix + target.toLocaleString("en-US"); return; }
    var start = performance.now();
    var dur = 1500;
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); countObs.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(counters, function (c) { countObs.observe(c); });
  } else {
    Array.prototype.forEach.call(counters, countUp);
  }

  /* ---------- 6. cash-flow cost bars (figures come from the plan) ---------- */
  var costs = [
    { name: "20-30 mid to high end gpus", value: 12000, text: "20-30 mid to high end gpus -- 12 000$", note: "Mainly cist for buy gpus from overseas" },
    { name: "Website development/setup", value: 2000, text: "$2,000", note: "Make a e commerce web site by own for this project and host it" },
    { name: "Marketing", value: 150, text: "$150", note: "Market that using website and Instagram" },
    { name: "Pyement gate way", value: 140, text: "$100 - $140", note: "A secured payment gateway for the online store" },
    { name: "Deploy n89", value: 120, text: "$120", note: "n8n automation for the customer service" },
    { name: "Sms gateway", value: 40, text: "$40", note: "We should implement a sms gateway also" },
    { name: "Business registration", value: 10, text: "$10", note: "One time registration cost" }
  ];

  var barsEl = document.getElementById("bars");
  var maxCost = Math.max.apply(null, costs.map(function (c) { return c.value; }));
  var total = costs.reduce(function (a, c) { return a + c.value; }, 0);

  costs.forEach(function (c) {
    var li = document.createElement("li");
    li.className = "bar";
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "button");
    li.setAttribute("aria-expanded", "false");
    li.innerHTML =
      '<span class="bar-name">' + c.name + '</span>' +
      '<span class="bar-val">' + c.text + '</span>' +
      '<span class="bar-track"><span class="bar-fill" data-w="' + ((c.value / maxCost) * 100).toFixed(1) + '"></span></span>' +
      '<span class="bar-note">' + c.note + '</span>';

    function toggle() {
      var open = li.classList.toggle("is-open");
      li.setAttribute("aria-expanded", open ? "true" : "false");
    }
    li.addEventListener("click", toggle);
    li.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
    barsEl.appendChild(li);
  });

  var totalEl = document.getElementById("cost-total");
  var barsGrown = false;

  function growBars() {
    if (barsGrown) return;
    barsGrown = true;
    var fills = barsEl.querySelectorAll(".bar-fill");
    Array.prototype.forEach.call(fills, function (f, i) {
      setTimeout(function () { f.style.width = f.getAttribute("data-w") + "%"; }, reduced ? 0 : i * 90);
    });
    totalEl.setAttribute("data-count", total);
    totalEl.setAttribute("data-prefix", "$");
    countUp(totalEl);
  }

  /* ---------- 7. tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var ink = document.getElementById("tab-ink");

  function moveInk(tab) {
    ink.style.width = tab.offsetWidth + "px";
    ink.style.transform = "translateX(" + tab.offsetLeft + "px)";
  }

  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.classList.toggle("is-open", on);
    });
    moveInk(tab);
    if (focus) tab.focus();
    if (tab.id === "tab-cash") growBars();
    if (tab.id === "tab-income") showGoal();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  window.addEventListener("load", function () { moveInk(tabs[0]); });
  window.addEventListener("resize", function () {
    var active = document.querySelector('.tab[aria-selected="true"]');
    if (active) moveInk(active);
  });
  moveInk(tabs[0]);

  /* ---------- 8. goal bar ---------- */
  var goal = document.getElementById("goalbar");
  function showGoal() { goal.classList.add("is-in"); }

  if ("IntersectionObserver" in window) {
    var goalObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { showGoal(); goalObs.disconnect(); } });
    }, { threshold: 0.4 });
    goalObs.observe(goal);
  } else {
    showGoal();
  }

  /* ---------- 9. accordion ---------- */
  var accBtns = document.querySelectorAll(".acc-btn");
  Array.prototype.forEach.call(accBtns, function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();
