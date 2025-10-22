// Scroll reveal using IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
    // logo animation on load
    const logo = document.getElementById('logo');
    if (logo) requestAnimationFrame(() => setTimeout(() => logo.classList.add('animate'), 120));

    // ripple click handling (for elements with .ripple)
    document.addEventListener('pointerdown', (ev) => {
        const el = ev.target.closest('.ripple');
        if (!el) return;
        // remove any inline after element to restart
        const rect = el.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        // create a CSS variable to control the pseudo-element position
        el.style.setProperty('--ripple-x', x + 'px');
        el.style.setProperty('--ripple-y', y + 'px');
        // force reflow then add active class by toggling a data attribute
        el.dataset.ripple = 'on';
        setTimeout(() => { delete el.dataset.ripple }, 400);
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        })
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .media-card, .tiles .tile, .feature').forEach(el => io.observe(el));

    // WhatsApp booking flow
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');

    function openModal() { modal.setAttribute('aria-hidden', 'false'); }
    function closeModal() { modal.setAttribute('aria-hidden', 'true'); }

    // Helper to open WhatsApp with a message
    function openWhatsApp(phone, message) {
        const text = encodeURIComponent(message);
        const url = `https://wa.me/${phone}?text=${text}`;
        window.open(url, '_blank');
    }

    // Create a small dropdown menu when main CTA is clicked
    function showBookingMenu(target) {
        // remove existing menu
        const existing = document.getElementById('wappMenu');
        if (existing) existing.remove();

        const menu = document.createElement('div');
        menu.id = 'wappMenu';
        menu.className = 'wapp-menu';
        menu.innerHTML = `
          <button class="wapp-item" data-phone="7357181811" data-pkg="Standard">Standard — ₹1,500</button>
          <button class="wapp-item" data-phone="7357181811" data-pkg="Premium">Premium — ₹4,500</button>
          <button class="wapp-item" data-phone="7357181811" data-pkg="On-Site">On‑Site — Contact</button>
          <div class="wapp-note">We'll continue on WhatsApp to confirm date/time.</div>
        `;
        document.body.appendChild(menu);
        const rect = target.getBoundingClientRect();
        menu.style.left = (rect.left) + 'px';
        menu.style.top = (rect.bottom + 10) + 'px';

        menu.addEventListener('click', (e) => {
            const btn = e.target.closest('.wapp-item');
            if (!btn) return;
            const phone = btn.dataset.phone;
            const pkg = btn.dataset.pkg;
            const msg = `Hi, I'd like to book the ${pkg} consultation with Earth Vastu.`;
            openWhatsApp(phone, msg);
            menu.remove();
        });

        // click outside to close
        const onDoc = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('pointerdown', onDoc); } };
        setTimeout(() => document.addEventListener('pointerdown', onDoc), 20);
    }

    // nav CTA opens booking menu
    document.querySelectorAll('[data-book]').forEach(el => el.addEventListener('click', (ev) => {
        ev.preventDefault();
        showBookingMenu(ev.currentTarget);
    }));

    // tier buttons open WhatsApp directly
    document.querySelectorAll('[data-wapp]').forEach(btn => {
        btn.addEventListener('click', (ev) => {
            const phone = btn.dataset.wapp;
            const pkg = btn.dataset.package || 'Consultation';
            const msg = `Hi, I'd like to book the ${pkg} consultation with Earth Vastu.`;
            openWhatsApp(phone, msg);
        });
    });

    // modal controls
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[c]); }
});
