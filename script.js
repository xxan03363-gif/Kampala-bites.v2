document.addEventListener('DOMContentLoaded', function () {

  /* --- Populate config-driven contact links/text everywhere --- */
  document.querySelectorAll('[data-wa-link]').forEach(function (el) {
    var msg = el.getAttribute('data-wa-message') || '';
    el.href = 'https://wa.me/' + KB_CONFIG.whatsappNumber + (msg ? ('?text=' + encodeURIComponent(msg)) : '');
  });
  document.querySelectorAll('[data-tel-link]').forEach(function (el) {
    el.href = 'tel:' + KB_CONFIG.phoneHref;
  });
  document.querySelectorAll('[data-mail-link]').forEach(function (el) {
    el.href = 'mailto:' + KB_CONFIG.email;
  });
  document.querySelectorAll('[data-phone-text]').forEach(function (el) { el.textContent = KB_CONFIG.phoneDisplay; });
  document.querySelectorAll('[data-email-text]').forEach(function (el) { el.textContent = KB_CONFIG.email; });

  /* --- Mobile nav --- */
  var burger = document.querySelector('.burger-btn');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  /* --- Category filters (menu.html) --- */
  var filterBtns = document.querySelectorAll('.cat-tab');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.cat;
        document.querySelectorAll('.menu-category').forEach(function (section) {
          section.style.display = (cat === 'all' || section.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

  /* --- Order cart (WhatsApp message builder) --- */
  var cart = {}; // { mealName: {qty, price} }

  function renderCartBar() {
    var bar = document.getElementById('cartBar');
    if (!bar) return;
    var keys = Object.keys(cart).filter(function (k) { return cart[k].qty > 0; });
    if (keys.length === 0) { bar.classList.remove('show'); return; }
    bar.classList.add('show');
    var count = keys.reduce(function (sum, k) { return sum + cart[k].qty; }, 0);
    document.getElementById('cartCount').textContent = count;
  }

  function buildWhatsAppMessage() {
    var loc = document.getElementById('deliveryLocationInput');
    var locText = loc && loc.value.trim() ? loc.value.trim() : '[not provided]';
    var lines = ['Hello Kampala Bites, I would like to order:'];
    Object.keys(cart).forEach(function (name) {
      if (cart[name].qty > 0) {
        lines.push('- ' + name + ' x' + cart[name].qty);
      }
    });
    lines.push('Delivery location: ' + locText);
    return lines.join('\n');
  }

  document.querySelectorAll('.meal-card').forEach(function (card) {
    var name = card.dataset.name;
    var price = card.dataset.price;
    var qtyEl = card.querySelector('.qty-value');
    var addBtn = card.querySelector('.add-btn');
    var qty = 0;
    cart[name] = { qty: 0, price: price };

    card.querySelector('.qty-plus').addEventListener('click', function () {
      qty++; qtyEl.textContent = qty;
    });
    card.querySelector('.qty-minus').addEventListener('click', function () {
      if (qty > 0) qty--; qtyEl.textContent = qty;
    });
    addBtn.addEventListener('click', function () {
      if (qty === 0) qty = 1;
      cart[name].qty += qty;
      qtyEl.textContent = 0;
      qty = 0;
      renderCartBar();
    });
  });

  var waOrderBtn = document.getElementById('cartWhatsAppBtn');
  if (waOrderBtn) {
    waOrderBtn.addEventListener('click', function () {
      var msg = buildWhatsAppMessage();
      window.open('https://wa.me/' + KB_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  /* --- Enquiry / booking forms: show success message, no real backend --- */
  document.querySelectorAll('.demo-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        success.textContent = 'Thanks! This form is a demo and does not send data yet — please confirm your enquiry on WhatsApp so we actually receive it.';
      }
    });
  });

});
