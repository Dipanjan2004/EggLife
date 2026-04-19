document.addEventListener('DOMContentLoaded', () => {
    // Scroll-in animation
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Mobile drawer
    const drawer = document.getElementById('drawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const menuToggle = document.getElementById('menuToggle');
    const drawerClose = document.getElementById('drawerClose');

    const openDrawer = () => {
        drawer.classList.add('is-open');
        backdrop.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
        drawer.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };
    menuToggle.addEventListener('click', openDrawer);
    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(); }
    });
    drawerClose.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    // Product filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#productsGrid .card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach(b => {
                b.classList.toggle('is-active', b === btn);
                b.setAttribute('aria-selected', b === btn);
            });
            cards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !show);
            });
        });
    });

    // Modals
    const productModal = document.getElementById('productModal');
    const wtbModal = document.getElementById('wtbModal');
    const openModal = (m) => {
        m.classList.add('is-open');
        m.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    const closeModal = (m) => {
        m.classList.remove('is-open');
        m.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
    });
    [productModal, wtbModal].forEach(m => {
        m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            [productModal, wtbModal].forEach(m => closeModal(m));
            closeDrawer();
        }
    });

    // Product card → details modal
    cards.forEach(card => {
        card.addEventListener('click', () => {
            document.getElementById('pmImg').src = card.dataset.img;
            document.getElementById('pmImg').alt = card.dataset.name;
            document.getElementById('pmName').textContent = card.dataset.name;
            document.getElementById('pmCalories').textContent = card.dataset.calories;
            document.getElementById('pmProtein').textContent = card.dataset.protein;
            document.getElementById('pmCarbs').textContent = card.dataset.carbs;
            document.getElementById('pmIngredients').textContent = card.dataset.ingredients;
            openModal(productModal);
        });
    });

    // Where-to-buy triggers
    document.querySelectorAll('[data-open-where-to-buy]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // If in product modal, close it first
            if (productModal.classList.contains('is-open')) closeModal(productModal);
            openModal(wtbModal);
        });
    });

    // Where-to-buy form (stub retailer lookup)
    const wtbForm = document.getElementById('wtbForm');
    const wtbZip = document.getElementById('wtbZip');
    const wtbResults = document.getElementById('wtbResults');
    const retailers = [
        { name: 'Whole Foods Market', distance: '0.8 mi', address: '123 Main St' },
        { name: 'Target', distance: '1.2 mi', address: '500 Market Ave' },
        { name: 'Kroger', distance: '2.1 mi', address: '88 Elm Rd' },
        { name: 'Sprouts Farmers Market', distance: '3.4 mi', address: '742 Oak Blvd' },
        { name: 'Publix', distance: '4.0 mi', address: '15 Pine Way' },
    ];
    wtbForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const zip = wtbZip.value.trim();
        if (!/^\d{5}$/.test(zip)) {
            wtbResults.innerHTML = '<li class="wtb-error">Please enter a valid 5-digit zip code.</li>';
            return;
        }
        wtbResults.innerHTML = retailers.map(r =>
            `<li><strong>${r.name}</strong><span>${r.address} &middot; ${r.distance}</span></li>`
        ).join('');
    });

    // Sticky CTA + back-to-top reveal
    const stickyCta = document.getElementById('stickyCta');
    const backToTop = document.getElementById('backToTop');
    const heroEl = document.querySelector('.view1');
    const view2El = document.querySelector('.view2');
    const onScroll = () => {
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        const view2Bottom = view2El.getBoundingClientRect().bottom;
        stickyCta.classList.toggle('is-visible', heroBottom < 0);
        backToTop.classList.toggle('is-visible', view2Bottom < 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMsg = document.getElementById('newsletterMsg');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterEmail.value.trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!valid) {
            newsletterMsg.textContent = 'Please enter a valid email.';
            newsletterMsg.className = 'newsletter-msg is-error';
            return;
        }
        newsletterMsg.textContent = 'Thanks for subscribing!';
        newsletterMsg.className = 'newsletter-msg is-success';
        newsletterEmail.value = '';
    });

    // Recipes carousel
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const slides = track.children;
    let current = 0;

    const cardsPerView = () => {
        if (window.innerWidth >= 1081) return 3;
        if (window.innerWidth >= 600) return 2;
        return 1;
    };

    const buildDots = () => {
        const totalPages = Math.max(1, slides.length - cardsPerView() + 1);
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
        updateDots();
    };

    const updateDots = () => {
        [...dotsContainer.children].forEach((d, i) => d.classList.toggle('is-active', i === current));
    };

    const goTo = (i) => {
        const max = slides.length - cardsPerView();
        current = Math.max(0, Math.min(i, max));
        const slideWidth = slides[0].getBoundingClientRect().width + 16; // gap
        track.style.transform = `translateX(${-current * slideWidth}px)`;
        updateDots();
    };

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
    buildDots();
    goTo(0);
});
