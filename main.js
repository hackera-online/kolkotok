/* KolkoTok demo - behaviour
   Header menus, mobile drawer, charging timeline, counters, gallery, cookie bar. */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header ---------- */
  var header = $('.site-header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- dropdowns (click for touch, hover handled in CSS) ---------- */
  function closeMenus(except) {
    $$('.nav__item.is-open').forEach(function (li) {
      if (li !== except) {
        li.classList.remove('is-open');
        var b = $('.nav__btn', li);
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.nav__btn');
    if (btn) {
      var li = btn.parentElement;
      var open = !li.classList.contains('is-open');
      closeMenus(li);
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      return;
    }
    if (!e.target.closest('.nav__item')) closeMenus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenus(); setDrawer(false); }
  });

  /* ---------- mobile drawer (cloned from the desktop nav) ---------- */
  var drawer = $('#drawer');
  var burger = $('.burger');
  var built = false;

  function buildDrawer() {
    if (built) return;
    var nav = $('.nav').cloneNode(true);
    nav.setAttribute('aria-label', 'Мобилна навигация');
    $$('.is-open', nav).forEach(function (n) { n.classList.remove('is-open'); });
    drawer.appendChild(nav);
    drawer.appendChild($('.bar__actions').cloneNode(true));
    built = true;
  }
  function setDrawer(open) {
    if (open) buildDrawer();
    drawer.hidden = !open;
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Затвори менюто' : 'Отвори менюто');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setDrawer(drawer.hidden); });
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) setDrawer(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && !drawer.hidden) setDrawer(false);
  });

  /* ---------- charging timeline: each step "switches on" as it enters view ---------- */
  var steps = $$('.step');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-on'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0.1 });
    steps.forEach(function (s) { io.observe(s); });
  } else {
    steps.forEach(function (s) { s.classList.add('is-on'); });
  }

  /* ---------- counters ---------- */
  var counters = $$('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var t0 = null, dur = 1600;
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window && !reduce && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) {
      c.textContent = (c.getAttribute('data-prefix') || '') + '0';
      cio.observe(c);
    });
  }

  /* ---------- gallery ---------- */
  var track = $('.gallery__track');
  if (track) {
    $$('.gallery__nav [data-dir]').forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = parseInt(b.getAttribute('data-dir'), 10);
        var step = Math.min(track.clientWidth * 0.8, 460);
        track.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- cookie bar ---------- */
  var bar = $('#cookies');
  var KEY = 'kt-cookies';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  if (!stored && bar) {
    setTimeout(function () { bar.hidden = false; }, 800);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      try { localStorage.setItem(KEY, b.getAttribute('data-cookie')); } catch (err) { /* ignore */ }
      bar.hidden = true;
    });
  }
})();
