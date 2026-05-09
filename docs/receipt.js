// ============================================================
//  receipt.js — "The Receipt"
//  Slider-controlled receipt unrolling. Clean version.
// ============================================================

(function () {

  var LINES = [
    { text: '================================', cls: 'r-border' },
    { text: '      WELCOME TO MILAN          ', cls: 'r-title' },
    { text: '      A City for Everyone?      ', cls: 'r-title' },
    { text: '      Est. forever. For now.    ', cls: 'r-sub' },
    { text: '================================', cls: 'r-border' },
    { text: '', cls: 'r-gap' },
    { text: '           [ 2018 ]             ', cls: 'r-year' },
    { text: '', cls: 'r-gap' },
    { text: 'HOUSING MARKET                  ', cls: 'r-section' },
    { text: '  Avg. rent (city median) 10.57 \u20ac/m\u00b2', cls: 'r-line' },
    { text: '  Avg. rent (Brera)...... 24.72 \u20ac/m\u00b2', cls: 'r-line' },
    { text: '  Avg. rent (Duomo)...... 30.27 \u20ac/m\u00b2', cls: 'r-line' },
    { text: '  Avg. rent (periphery)..  6.50 \u20ac/m\u00b2', cls: 'r-line' },
    { text: '', cls: 'r-gap' },
    { text: 'SHORT-TERM RENTALS              ', cls: 'r-section' },
    { text: '  Active listings (city)......  36', cls: 'r-line' },
    { text: '  Reviews (city)......... 40,507', cls: 'r-line' },
    { text: '  Nightly price (Brera)...... 89\u20ac', cls: 'r-line' },
    { text: '  Entire homes............... 87%', cls: 'r-line' },
    { text: '', cls: 'r-gap' },
    { text: '--------------------------------', cls: 'r-divider' },
    { text: '       * TWO YEARS LATER *      ', cls: 'r-interlude' },
    { text: '--------------------------------', cls: 'r-divider' },
    { text: '', cls: 'r-gap' },
    { text: '           [ 2020 ]             ', cls: 'r-year' },
    { text: '', cls: 'r-gap' },
    { text: '   !! COVID-19 SURCHARGE !!     ', cls: 'r-alert' },
    { text: '', cls: 'r-gap' },
    { text: 'SHORT-TERM RENTALS              ', cls: 'r-section' },
    { text: '  Listings collapsed....... -67%', cls: 'r-down' },
    { text: '  Reviews dropped to.... 18,486 ', cls: 'r-down' },
    { text: '  Platforms held prices up +1.9%', cls: 'r-line' },
    { text: '', cls: 'r-gap' },
    { text: 'HOUSING MARKET                  ', cls: 'r-section' },
    { text: '  Rents kept rising......... +1.9%', cls: 'r-up' },
    { text: '  Residents stayed \u2014 for now.  ', cls: 'r-note' },
    { text: '', cls: 'r-gap' },
    { text: '  Note: the city breathed.      ', cls: 'r-note' },
    { text: '  Locals reclaimed their streets', cls: 'r-note' },
    { text: '  It did not last.              ', cls: 'r-note' },
    { text: '', cls: 'r-gap' },
    { text: '--------------------------------', cls: 'r-divider' },
    { text: '       * TWO YEARS LATER *      ', cls: 'r-interlude' },
    { text: '--------------------------------', cls: 'r-divider' },
    { text: '', cls: 'r-gap' },
    { text: '           [ 2022 ]             ', cls: 'r-year' },
    { text: '', cls: 'r-gap' },
    { text: 'SHORT-TERM RENTALS              ', cls: 'r-section' },
    { text: '  Active listings (city)... 385 ', cls: 'r-up' },
    { text: '  Reviews (city)...... 110,657  ', cls: 'r-up' },
    { text: '  Avg. rent (Brera).. 24.57 \u20ac/m\u00b2', cls: 'r-line' },
    { text: '', cls: 'r-gap' },
    { text: 'HOUSING MARKET                  ', cls: 'r-section' },
    { text: '  Avg. rent (city median) 12.04 \u20ac/m\u00b2', cls: 'r-line' },
    { text: '  Rent growth since 2018.. +13.9%', cls: 'r-up' },
    { text: '', cls: 'r-gap' },
    { text: 'PROFESSIONALISATION             ', cls: 'r-section' },
    { text: '  Entire homes........... 87.9% ', cls: 'r-line' },
    { text: '  Professional hosts (5+). 45.1%', cls: 'r-line' },
    { text: '  Licensed listings (CIN)... low', cls: 'r-line' },
    { text: '', cls: 'r-gap' },
    { text: '--------------------------------', cls: 'r-divider' },
    { text: '       * TWO YEARS LATER *      ', cls: 'r-interlude' },
    { text: '--------------------------------', cls: 'r-divider' },
    { text: '', cls: 'r-gap' },
    { text: '           [ 2024 ]             ', cls: 'r-year' },
    { text: '', cls: 'r-gap' },
    { text: 'SHORT-TERM RENTALS              ', cls: 'r-section' },
    { text: '  Active listings (city).. 2,018', cls: 'r-up' },
    { text: '  Growth since 2018...... \u21915506%', cls: 'r-up' },
    { text: '  Reviews (city)...... 244,309  ', cls: 'r-up' },
    { text: '  Growth since 2018....  \u2191503%   ', cls: 'r-up' },
    { text: '  Avg. rent (Brera).. 29.59 \u20ac/m\u00b2', cls: 'r-up' },
    { text: '  Growth since 2018......  \u219120%  ', cls: 'r-up' },
    { text: '  Avg. rent (Duomo).. 33.73 \u20ac/m\u00b2', cls: 'r-up' },
    { text: '', cls: 'r-gap' },
    { text: 'HOUSING MARKET                  ', cls: 'r-section' },
    { text: '  Avg. rent (city median) 14.37 \u20ac/m\u00b2', cls: 'r-line' },
    { text: '  Rent growth since 2018.. \u219135.9%', cls: 'r-up' },
    { text: '  Wage growth since 2018...  ~10%', cls: 'r-line' },
    { text: '', cls: 'r-gap' },
    { text: 'SATURATION                      ', cls: 'r-section' },
    { text: '  Listings per 1k residents. 1.5', cls: 'r-line' },
    { text: '  Neighbourhoods under pressure  ', cls: 'r-line' },
    { text: '    by 2024.................. 12 ', cls: 'r-line' },
    { text: '  Residents near centre...... \u2193  ', cls: 'r-up' },
    { text: '', cls: 'r-gap' },
    { text: '================================', cls: 'r-border' },
    { text: '', cls: 'r-gap' },
    { text: 'SUBTOTAL (tourism revenue).. +++', cls: 'r-line' },
    { text: 'SUBTOTAL (resident costs)... +++', cls: 'r-line' },
    { text: 'DISPLACEMENT TAX.........  ?????', cls: 'r-line' },
    { text: 'AFFORDABILITY......  not found  ', cls: 'r-line' },
    { text: '', cls: 'r-gap' },
    { text: '--------------------------------', cls: 'r-divider' },
    { text: 'TOTAL: GENTRIFICATION           ', cls: 'r-total' },
    { text: '       ...still computing       ', cls: 'r-cursor' },
    { text: '--------------------------------', cls: 'r-divider' },
    { text: '', cls: 'r-gap' },
    { text: '  Keep this receipt.            ', cls: 'r-note' },
    { text: '  Your neighbours may not       ', cls: 'r-note' },
    { text: '  be here next time.            ', cls: 'r-note' },
    { text: '', cls: 'r-gap' },
    { text: '================================', cls: 'r-border' },
  ];

  var TOTAL = LINES.length;

  // Which line index marks each year block (for the year indicator)
  var YEAR_MARKERS = [
    { idx: 6,  label: '2018', color: '#D4C4A8' },
    { idx: 24, label: '2020', color: '#2980B9' },
    { idx: 44, label: '2022', color: '#E8B4A0' },
    { idx: 63, label: '2024', color: '#C0392B' },
    { idx: 84, label: 'The bill', color: '#E8B4B8' },
  ];

  // ── CSS ────────────────────────────────────────────────────
  function injectStyles() {
    var css = `
      #receipt {
        background: #111;
        padding: 60px 0 80px;
      }
      #receipt > .container {
        max-width: 960px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        gap: 40px;
        align-items: flex-start;
      }

      /* ── Left explainer ── */
      .receipt-explainer {
        flex: 0 0 210px;
        position: sticky;
        top: 80px;
        color: #D4C4A8;
      }
      .receipt-explainer h2 {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.9rem;
        color: #E8B4B8;
        line-height: 1.2;
        margin-bottom: 16px;
      }
      .receipt-explainer p {
        font-size: 0.86rem;
        line-height: 1.75;
        opacity: 0.72;
        margin-bottom: 12px;
      }

      /* Year indicator */
      .receipt-year-badge {
        margin-top: 28px;
        display: inline-block;
        font-family: 'Courier New', monospace;
        font-size: 1.1rem;
        font-weight: bold;
        padding: 6px 14px;
        border-radius: 4px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        transition: color 0.4s, border-color 0.4s;
        color: #D4C4A8;
      }
      .receipt-hint {
        margin-top: 14px;
        font-family: 'Courier New', monospace;
        font-size: 0.72rem;
        color: #E8B4B8;
        opacity: 0.5;
        line-height: 1.6;
      }

      /* ── Center receipt ── */
      .receipt-center {
        flex: 1;
        min-width: 0;
        position: sticky;
        top: 40px;
      }
      .receipt-paper {
        background: #fff;
        box-shadow: 6px 8px 32px rgba(0,0,0,0.5), -2px 0 12px rgba(0,0,0,0.2);
        position: relative;
      }
      .receipt-inner {
        padding: 10px 22px 16px;
        max-height: calc(100vh - 150px);
        overflow: hidden;
        position: relative;
      }
      /* Fade at bottom — looks like paper still rolling */
      .receipt-inner::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 55px;
        background: linear-gradient(transparent, #fff);
        pointer-events: none;
      }
      /* Jagged top edge (CSS-only zigzag) */
      .receipt-edge-top {
        height: 18px;
        background:
          linear-gradient(135deg, #111 25%, transparent 25%) -10px 0,
          linear-gradient(225deg, #111 25%, transparent 25%) -10px 0,
          linear-gradient(315deg, #111 25%, transparent 25%),
          linear-gradient(45deg,  #111 25%, transparent 25%);
        background-size: 20px 20px;
        background-color: #fff;
      }
      .receipt-edge-bottom {
        height: 18px;
        background:
          linear-gradient(315deg, #111 25%, transparent 25%) -10px 0,
          linear-gradient(45deg,  #111 25%, transparent 25%) -10px 0,
          linear-gradient(135deg, #111 25%, transparent 25%),
          linear-gradient(225deg, #111 25%, transparent 25%);
        background-size: 20px 20px;
        background-color: #fff;
      }

      /* ── Lines ── */
      .r-line-wrap {
        display: block;
        overflow: hidden;
        max-height: 0;
        opacity: 0;
        transition: max-height 0.08s ease, opacity 0.10s ease;
      }
      .r-line-wrap.visible {
        max-height: 2.2em;
        opacity: 1;
      }
      .receipt-line {
        font-family: 'Courier New', monospace;
        font-size: 0.79rem;
        line-height: 1.58;
        white-space: pre;
        display: block;
        min-height: 1.1em;
      }
      .r-border    { color: #AAA; }
      .r-divider   { color: #CCC; }
      .r-title     { color: #111; font-weight: bold; text-align: center; }
      .r-sub       { color: #666; text-align: center; }
      .r-year      { color: #111; font-weight: bold; font-size: 0.9rem; text-align: center; }
      .r-section   { color: #222; font-weight: bold; }
      .r-line      { color: #444; }
      .r-up        { color: #C0392B; }
      .r-down      { color: #2980B9; }
      .r-alert     { color: #2980B9; font-weight: bold; text-align: center; }
      .r-interlude { color: #999; font-style: italic; text-align: center; }
      .r-note      { color: #888; font-style: italic; }
      .r-gap       { min-height: 0.4em; }
      .r-total     { color: #C0392B; font-weight: bold; font-size: 0.9rem; }
      .r-total.shake { animation: rshake 0.45s ease-in-out; }
      .r-cursor::after {
        content: '\u258c';
        animation: rblink 1s step-end infinite;
        color: #C0392B;
      }
      @keyframes rshake {
        0%,100%{ transform:translateX(0); }
        20%    { transform:translateX(-5px); }
        40%    { transform:translateX(5px); }
        60%    { transform:translateX(-4px); }
        80%    { transform:translateX(3px); }
      }
      @keyframes rblink {
        0%,100%{ opacity:1; } 50%{ opacity:0; }
      }

      /* ── Right slider ── */
      .receipt-slider-col {
        flex: 0 0 44px;
        position: sticky;
        top: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        height: calc(100vh - 80px);
      }
      .r-slbl {
        font-family: 'Courier New', monospace;
        font-size: 0.60rem;
        color: #E8B4B8;
        opacity: 0.5;
        writing-mode: vertical-rl;
        letter-spacing: 0.1em;
        user-select: none;
      }
      .r-slbl.btm { transform: rotate(180deg); }
      #receipt-slider {
        -webkit-appearance: slider-vertical;
        appearance: slider-vertical;
        writing-mode: vertical-lr;
        direction: rtl;
        flex: 1;
        width: 6px;
        cursor: ns-resize;
        accent-color: #E8B4B8;
      }
      #receipt-slider::-webkit-slider-runnable-track {
        width: 4px; background: #2a2a2a; border-radius: 2px;
      }
      #receipt-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px; height: 20px; border-radius: 50%;
        background: #E8B4B8; border: 3px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.6);
        margin-left: -8px; cursor: ns-resize;
      }
      #receipt-slider::-moz-range-track {
        width: 4px; background: #2a2a2a; border-radius: 2px;
      }
      #receipt-slider::-moz-range-thumb {
        width: 18px; height: 18px; border-radius: 50%;
        background: #E8B4B8; border: 3px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.6); cursor: ns-resize;
      }
    `;
    var el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ── Build DOM ─────────────────────────────────────────────
  var lineWraps = [];
  var shookTotal = false;

  function buildDOM() {
    var hats = document.getElementById('hats');
    if (!hats) return;

    var section = document.createElement('section');
    section.id = 'receipt';
    section.className = 'section';

    var linesHTML = LINES.map(function(l, i) {
      return '<span class="r-line-wrap" data-idx="' + i + '">'
        + '<span class="receipt-line ' + l.cls + '">'
        + (l.text || '\u00a0')
        + '</span></span>';
    }).join('');

    section.innerHTML = [
      '<div class="container">',

      // ── Left explainer ──
      '<div class="receipt-explainer">',
      '  <h2>The Receipt</h2>',

      '  <p>Between 2018 and 2024, Milan\'s',
      '  short-term rental market grew by',
      '  <strong style="color:#E8B4B8">5,506%</strong>.</p>',

      '  <p>This receipt itemises what that',
      '  growth cost — in rents, in listings,',
      '  and in the neighbourhoods that',
      '  changed beyond recognition.</p>',

      '  <p>Each section covers two years.',
      '  Red figures are rising costs.',
      '  Blue figures mark the COVID pause',
      '  — the only moment the city slowed.</p>',

      '  <p>Pull the slider down to read',
      '  the full bill.</p>',

      '  <div class="receipt-year-badge" id="receipt-year-badge">2018</div>',
      '  <div class="receipt-hint" id="receipt-hint">\u25bc drag to reveal \u25bc</div>',
      '</div>',

      // ── Center receipt ──
      '<div class="receipt-center">',
      '  <div class="receipt-edge-top"></div>',
      '  <div class="receipt-paper">',
      '    <div class="receipt-inner" id="receipt-inner">',
      linesHTML,
      '    </div>',
      '  </div>',
      '  <div class="receipt-edge-bottom"></div>',
      '</div>',

      // ── Right slider ──
      '<div class="receipt-slider-col">',
      '  <span class="r-slbl">TOP</span>',
      '  <input type="range" id="receipt-slider"',
      '    min="0" max="' + TOTAL + '" value="0" step="1"',
      '    orient="vertical" />',
      '  <span class="r-slbl btm">BOTTOM</span>',
      '</div>',

      '</div>',
    ].join('\n');

    hats.parentNode.insertBefore(section, hats);

    lineWraps = Array.prototype.slice.call(
      document.querySelectorAll('.r-line-wrap')
    );

    // Navbar
    var navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="#receipt">The Receipt</a>';
      var hatsLink = navLinks.querySelector('a[href="#hats"]');
      if (hatsLink) navLinks.insertBefore(li, hatsLink.parentElement);
      else navLinks.appendChild(li);
    }
  }

  // ── Render lines ──────────────────────────────────────────
  function renderTo(count) {
    var badge = document.getElementById('receipt-year-badge');
    var hint  = document.getElementById('receipt-hint');

    // Update year badge
    var currentYear = '2018';
    var currentColor = '#D4C4A8';
    YEAR_MARKERS.forEach(function(m) {
      if (count >= m.idx) { currentYear = m.label; currentColor = m.color; }
    });
    if (badge) { badge.textContent = currentYear; badge.style.color = currentColor; badge.style.borderColor = currentColor; }

    // Hide hint once user starts dragging
    if (count > 3 && hint) hint.style.opacity = '0';

    lineWraps.forEach(function(wrap, i) {
      if (i < count) {
        if (!wrap.classList.contains('visible')) {
          wrap.classList.add('visible');
          // Shake the TOTAL line
          if (LINES[i] && LINES[i].cls === 'r-total' && !shookTotal) {
            shookTotal = true;
            var inner = wrap.querySelector('.receipt-line');
            if (inner) {
              inner.classList.add('shake');
              setTimeout(function() { inner.classList.remove('shake'); }, 500);
            }
          }
        }
      } else {
        wrap.classList.remove('visible');
        if (LINES[i] && LINES[i].cls === 'r-total') shookTotal = false;
      }
    });

    // Scroll to latest line
    var inner = document.getElementById('receipt-inner');
    if (inner) {
      var vis = inner.querySelectorAll('.r-line-wrap.visible');
      if (vis.length) vis[vis.length - 1].scrollIntoView({ block: 'nearest' });
    }
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    injectStyles();
    buildDOM();

    var slider = document.getElementById('receipt-slider');
    if (!slider) return;

    slider.addEventListener('input', function() {
      renderTo(parseInt(slider.value, 10));
    });

    // Show first 5 lines as preview
    setTimeout(function() { slider.value = 5; renderTo(5); }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();