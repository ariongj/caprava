(function () {
  "use strict";
  var D = JSON.parse(document.getElementById("store-data").textContent);
  var STORE_KEY = "caprava-cart";
  var lang = null;
  var key = null;
  var cart = loadCart();

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fill(tpl, values) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return values[k] == null ? "" : values[k]; });
  }
  function price(n) {
    return new Intl.NumberFormat(lang === "sq" ? "de-DE" : "en-IE", {
      style: "currency", currency: "EUR",
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2,
    }).format(n);
  }
  function product(slug) { return D.products.find(function (p) { return p.slug === slug; }); }
  function priceFor(ml) { var s = D.sizes.find(function (s) { return s.ml === ml; }); return s ? s.price : 0; }
  function t() { return D.t[lang]; }
  function loadCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(raw) ? raw.filter(function (l) { var p = product(l.slug); return p && p.available && priceFor(l.ml) && l.qty > 0; }) : [];
    } catch (e) { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
    updateCount();
  }
  function count() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function subtotal() { return cart.reduce(function (s, l) { return s + priceFor(l.ml) * l.qty; }, 0); }

  // ---------- routes ----------
  function keyFromHref(href) {
    return href.replace(/^\//, "").replace("?for=", "/for-").split("/").filter(Boolean).join("~");
  }
  var special = { cart: renderCart, checkout: renderCheckout, "checkout~success": renderSuccess };
  function exists(k) {
    if (D.pages[k]) return true;
    var parts = k.split("~");
    return (parts[0] === "sq" || parts[0] === "en") && Boolean(special[parts.slice(1).join("~")]);
  }

  function go(k, push) {
    if (!exists(k)) k = (lang || "sq");
    var newLang = k.split("~")[0];
    if (newLang !== lang) {
      lang = newLang;
      document.documentElement.lang = lang;
      document.getElementById("chrome-top").innerHTML = D.chrome[lang].header;
      document.getElementById("chrome-foot").innerHTML = D.chrome[lang].footer;
      document.getElementById("preview-bar").textContent = D.preview[lang].bar;
    }
    key = k;
    var main = document.getElementById("main");
    var rest = k.split("~").slice(1).join("~");
    if (special[rest]) main.innerHTML = special[rest]();
    else main.innerHTML = D.pages[k];
    fillImages(main);
    closeMenu();
    renderLangSwitch();
    updateCount();
    if (push !== false) {
      try { history.pushState(null, "", "#" + k); } catch (e) { location.hash = k; }
    }
    window.scrollTo(0, 0);
    renderDrawer();
  }

  window.addEventListener("hashchange", function () {
    var k = location.hash.slice(1);
    if (k && k !== key) go(k, false);
  });
  window.addEventListener("popstate", function () {
    var k = location.hash.slice(1) || "sq";
    if (k !== key) go(k, false);
  });

  function renderLangSwitch() {
    var el = document.querySelector(".lang-switch");
    if (!el) return;
    var rest = key.split("~").slice(1).join("~");
    el.innerHTML = ["sq", "en"].map(function (l) {
      var target = l + (rest ? "~" + rest : "");
      return '<a href="#' + target + '" data-key="' + target + '"' + (l === lang ? ' class="is-active" aria-current="true"' : "") + ">" + l.toUpperCase() + "</a>";
    }).join("");
  }

  function updateCount() {
    var btn = document.querySelector(".cart-button");
    if (!btn) return;
    var badge = btn.querySelector(".cart-count");
    var n = count();
    if (n > 0) {
      if (!badge) { badge = document.createElement("span"); badge.className = "cart-count"; btn.appendChild(badge); }
      badge.textContent = n;
    } else if (badge) badge.remove();
  }

  // ---------- header ----------
  function closeMenu() {
    var m = document.querySelector(".mobile-menu");
    var b = document.querySelector(".burger");
    if (m) m.classList.remove("is-open");
    if (b) b.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  window.addEventListener("scroll", function () {
    var h = document.querySelector(".site-header");
    if (h) h.classList.toggle("is-scrolled", window.scrollY > 24);
  }, { passive: true });

  // ---------- bottle photo (same as components/Bottle.tsx) ----------
  function bottle(p, ml) {
    return '<img src="' + D.images[p.slug] + '" alt="CAPRAVA ' + esc(p.name.en) + " " + ml + ' ML" width="441" height="675" class="bottle-photo' + (ml <= 15 ? " is-small" : "") + '">';
  }
  function fillImages(root) {
    root.querySelectorAll("img[data-img]").forEach(function (img) {
      img.src = D.images[img.dataset.img];
      img.removeAttribute("data-img");
    });
  }

  // ---------- cart ----------
  function add(slug, ml) {
    var line = cart.find(function (l) { return l.slug === slug && l.ml === ml; });
    if (line) line.qty = Math.min(D.maxQty, line.qty + 1);
    else cart.push({ slug: slug, ml: ml, qty: 1 });
    saveCart();
    openDrawer();
  }
  function setQty(slug, ml, qty) {
    if (qty < 1) cart = cart.filter(function (l) { return !(l.slug === slug && l.ml === ml); });
    else cart.forEach(function (l) { if (l.slug === slug && l.ml === ml) l.qty = Math.min(D.maxQty, qty); });
    saveCart();
    renderDrawer();
    var rest = key.split("~").slice(1).join("~");
    if (rest === "cart" || rest === "checkout") document.getElementById("main").innerHTML = special[rest]();
  }

  function lines(compact, readOnly) {
    var T = t();
    return '<ul class="cart-lines' + (compact ? " is-compact" : "") + '">' + cart.map(function (l) {
      var p = product(l.slug);
      var controls = readOnly
        ? '<p class="muted small">' + esc(T.common.quantity) + ": " + l.qty + "</p>"
        : '<div class="cart-line-controls"><div class="qty">' +
          '<button type="button" data-act="qty" data-slug="' + p.slug + '" data-ml="' + l.ml + '" data-qty="' + (l.qty - 1) + '" aria-label="−">−</button>' +
          "<span>" + l.qty + "</span>" +
          '<button type="button" data-act="qty" data-slug="' + p.slug + '" data-ml="' + l.ml + '" data-qty="' + (l.qty + 1) + '"' + (l.qty >= D.maxQty ? " disabled" : "") + ' aria-label="+">+</button>' +
          '</div><button type="button" class="text-link small" data-act="qty" data-slug="' + p.slug + '" data-ml="' + l.ml + '" data-qty="0">' + esc(T.common.remove) + "</button></div>";
      return '<li class="cart-line"><a href="/' + lang + "/shop/" + p.slug + '" class="cart-line-media">' + bottle(p, l.ml) + "</a>" +
        '<div class="cart-line-info"><p class="cart-line-name">' + esc(p.name[lang]) + '</p><p class="muted small">' + l.ml + " ML · " + esc(p.character[lang]) + "</p>" + controls + "</div>" +
        '<p class="cart-line-price">' + price(priceFor(l.ml) * l.qty) + "</p></li>";
    }).join("") + "</ul>";
  }

  function emptyState(text) {
    return '<div class="empty-state"><p>' + esc(text) + '</p><a href="/' + lang + '/shop" class="button">' + esc(t().common.shopNow) + "</a></div>";
  }

  function renderDrawer() {
    var T = t();
    var panel = document.getElementById("drawer-panel");
    panel.setAttribute("aria-label", T.cart.title);
    var head = '<div class="drawer-head"><h2>' + esc(T.cart.title) + '</h2><button type="button" class="icon-button" data-act="close-drawer" aria-label="' + esc(T.nav.close) + '">✕</button></div>';
    if (!cart.length) {
      panel.innerHTML = head + '<div class="drawer-empty"><p>' + esc(T.cart.empty) + '</p><a href="/' + lang + '/shop" class="button">' + esc(T.common.shopNow) + "</a></div>";
      return;
    }
    var sub = subtotal();
    var left = D.shipping.freeFrom - sub;
    panel.innerHTML = head +
      '<div class="free-ship"><p>' + esc(left > 0 ? fill(T.cart.freeShippingLeft, { amount: price(left) }) : T.cart.freeShippingReached) + '</p><div class="free-ship-bar"><span style="width:' + Math.min(100, (sub / D.shipping.freeFrom) * 100) + '%"></span></div></div>' +
      '<div class="drawer-lines">' + lines(true, false) + "</div>" +
      '<div class="drawer-foot"><div class="summary-row"><span>' + esc(T.cart.subtotal) + "</span><strong>" + price(sub) + "</strong></div>" +
      '<p class="muted small">' + esc(T.common.vatIncluded) + " " + esc(T.cart.shipping) + ": " + esc(T.cart.shippingAtCheckout.toLowerCase()) + ".</p>" +
      '<a href="/' + lang + '/checkout" class="button button-full">' + esc(T.cart.checkout) + "</a>" +
      '<a href="/' + lang + '/cart" class="text-link center">' + esc(T.cart.title) + "</a></div>";
  }
  function openDrawer() {
    renderDrawer();
    var d = document.getElementById("drawer");
    d.classList.add("is-open");
    d.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    var d = document.getElementById("drawer");
    d.classList.remove("is-open");
    d.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function title(text) {
    return '<header class="section-title"><h1>' + esc(text) + '</h1><span class="title-rule" aria-hidden="true"></span></header>';
  }

  function renderCart() {
    var T = t();
    var body = !cart.length ? emptyState(T.cart.empty) :
      '<div class="cart-page">' + lines(false, false) + '<div class="cart-page-summary">' +
      '<div class="summary-row"><span>' + esc(T.cart.subtotal) + "</span><strong>" + price(subtotal()) + "</strong></div>" +
      '<div class="summary-row muted"><span>' + esc(T.cart.shipping) + "</span><span>" + esc(T.cart.shippingAtCheckout) + "</span></div>" +
      '<p class="muted small">' + esc(T.common.vatIncluded) + "</p>" +
      '<a href="/' + lang + '/checkout" class="button button-full">' + esc(T.cart.checkout) + "</a>" +
      '<a href="/' + lang + '/shop" class="text-link center">' + esc(T.cart.continue) + "</a></div></div>";
    return '<div class="container page page-narrow">' + title(T.cart.title) + body + "</div>";
  }

  var checkoutCountry = D.shipping.countries[0].code;
  function shipCost(sub) {
    var c = D.shipping.countries.find(function (x) { return x.code === checkoutCountry; });
    return sub >= D.shipping.freeFrom ? 0 : c.cost;
  }
  function field(name, label, attrs) {
    return '<label class="field"><span>' + esc(label) + '</span><input id="co-' + name + '" name="' + name + '" ' + (attrs || "") + "></label>";
  }
  function checkoutSummary() {
    var T = t();
    var sub = subtotal();
    var ship = shipCost(sub);
    return "<h2>" + esc(T.checkout.summary) + "</h2>" + lines(true, true) +
      '<div class="summary-row"><span>' + esc(T.cart.subtotal) + "</span><span>" + price(sub) + "</span></div>" +
      '<div class="summary-row"><span>' + esc(T.cart.shipping) + "</span><span>" + (ship === 0 ? esc(T.cart.free) : price(ship)) + "</span></div>" +
      (ship > 0 ? '<p class="muted small">' + esc(fill(T.cart.freeShippingLeft, { amount: price(D.shipping.freeFrom - sub) })) + "</p>" : "") +
      '<div class="summary-row summary-total"><span>' + esc(T.cart.total) + "</span><strong>" + price(sub + ship) + "</strong></div>" +
      '<p class="muted small">' + esc(T.common.vatIncluded) + "</p>" +
      '<button class="button button-full button-large" type="submit">' + esc(T.checkout.placeOrder) + "</button>";
  }
  function renderCheckout() {
    var T = t();
    if (!cart.length) return '<div class="container page">' + title(T.checkout.title) + emptyState(T.checkout.emptyCart) + "</div>";
    var parts = T.checkout.terms.split(/\{terms\}|\{privacy\}/);
    var options = D.shipping.countries.map(function (c) {
      return '<option value="' + c.code + '"' + (c.code === checkoutCountry ? " selected" : "") + ">" + esc(c.name[lang]) + "</option>";
    }).join("");
    return '<div class="container page">' + title(T.checkout.title) +
      '<form class="checkout" id="checkout-form" data-form="checkout"><div class="checkout-main">' +
      "<fieldset><legend>" + esc(T.checkout.contact) + '</legend><div class="form-row">' +
      field("email", T.checkout.email, 'type="email" required autocomplete="email"') +
      field("phone", T.checkout.phone, 'type="tel" required autocomplete="tel" placeholder="+383 …"') + "</div></fieldset>" +
      "<fieldset><legend>" + esc(T.checkout.delivery) + '</legend><div class="form-row">' +
      field("firstName", T.checkout.firstName, 'required autocomplete="given-name"') +
      field("lastName", T.checkout.lastName, 'required autocomplete="family-name"') + "</div>" +
      field("address", T.checkout.address, 'required autocomplete="street-address"') +
      '<div class="form-row form-row-3">' + field("city", T.checkout.city, 'required autocomplete="address-level2"') +
      field("postalCode", T.checkout.postalCode, 'autocomplete="postal-code"') +
      '<label class="field"><span>' + esc(T.checkout.country) + '</span><select id="co-country" name="country" data-act="country">' + options + "</select></label></div>" +
      '<label class="field"><span>' + esc(T.checkout.note) + '</span><textarea id="co-note" name="note" rows="3"></textarea></label></fieldset>' +
      "<fieldset><legend>" + esc(T.checkout.payment) + '</legend><div class="payment-options">' +
      '<label class="payment-option is-selected"><input type="radio" id="co-pay-cod" name="payment" value="cod" checked><span><strong>' + esc(T.checkout.cod) + '</strong><span class="muted small">' + esc(T.checkout.codText) + "</span></span></label>" +
      '<label class="payment-option"><input type="radio" id="co-pay-card" name="payment" value="card"><span><strong>' + esc(T.checkout.card) + '</strong><span class="muted small">' + esc(T.checkout.cardText) + "</span></span></label>" +
      "</div></fieldset>" +
      '<label class="checkbox"><input type="checkbox" id="co-terms" required><span>' + esc(parts[0]) +
      '<a href="/' + lang + '/legal/terms">' + esc(T.checkout.termsLink) + "</a>" + esc(parts[1]) +
      '<a href="/' + lang + '/legal/privacy">' + esc(T.checkout.privacyLink) + "</a>" + esc(parts[2] || "") + "</span></label>" +
      '</div><aside class="checkout-summary" id="checkout-summary">' + checkoutSummary() + "</aside></form></div>";
  }
  var lastOrder = "";
  function renderSuccess() {
    var T = t();
    return '<div class="container page page-narrow success"><h1>' + esc(T.success.title) + "</h1>" +
      '<p class="preview-note">' + esc(D.preview[lang].order) + "</p>" +
      (lastOrder ? '<p class="order-id">' + esc(T.success.order) + ": <strong>" + esc(lastOrder) + "</strong></p>" : "") +
      '<a href="/' + lang + '" class="button">' + esc(T.success.back) + "</a></div>";
  }

  // ---------- events ----------
  document.addEventListener("click", function (e) {
    var el = e.target.closest("a, button, .size-option");
    if (!el) {
      if (e.target.closest("[data-act=close-drawer]")) closeDrawer();
      return;
    }
    if (el.matches("[data-act=close-drawer]")) { closeDrawer(); return; }
    if (el.matches("[data-act=qty]")) { setQty(el.dataset.slug, Number(el.dataset.ml), Number(el.dataset.qty)); return; }
    if (el.matches(".menu-toggle")) {
      var m = document.querySelector(".mobile-menu");
      var open = !m.classList.contains("is-open");
      m.classList.toggle("is-open", open);
      el.querySelector(".burger").classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      return;
    }
    if (el.matches(".cart-button")) { openDrawer(); return; }
    if (el.matches(".size-option")) {
      var group = el.parentElement;
      group.querySelectorAll(".size-option").forEach(function (o) {
        o.classList.toggle("is-selected", o === el);
        o.setAttribute("aria-checked", o === el ? "true" : "false");
      });
      var ml = parseInt(el.querySelector(".size-ml").textContent, 10);
      var btn = group.parentElement.querySelector(".button");
      btn.textContent = t().common.addToCart + " — " + price(priceFor(ml));
      return;
    }
    if (el.matches(".add-to-cart .button")) {
      var sel = el.parentElement.querySelector(".size-option.is-selected .size-ml");
      add(key.split("~").pop(), parseInt(sel.textContent, 10));
      return;
    }
    if (el.tagName === "A") {
      var href = el.getAttribute("href") || "";
      if (el.dataset.key) { e.preventDefault(); closeDrawer(); go(el.dataset.key); return; }
      if (href.charAt(0) === "/") { e.preventDefault(); closeDrawer(); go(keyFromHref(href)); }
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target.matches("[data-act=country]")) {
      checkoutCountry = e.target.value;
      document.getElementById("checkout-summary").innerHTML = checkoutSummary();
    }
    if (e.target.name === "payment") {
      document.querySelectorAll(".payment-option").forEach(function (o) {
        o.classList.toggle("is-selected", o.contains(e.target));
      });
    }
  });

  document.addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target;
    if (form.dataset.form === "checkout") {
      lastOrder = "PREVIEW-" + Math.random().toString(36).slice(2, 6).toUpperCase();
      cart = [];
      saveCart();
      go(lang + "~checkout~success");
      return;
    }
    var note = document.createElement("p");
    note.className = "preview-note";
    note.textContent = D.preview[lang].form;
    form.replaceWith(note);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  var start = location.hash.slice(1);
  go(exists(start) ? start : "sq", false);
})();
