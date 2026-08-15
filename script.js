// Rok w stopce
document.getElementById('year').textContent = new Date().getFullYear();

// Menu mobilne
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Animacja "zapalenia" schematu w hero — długość każdej kreski (stroke-dasharray)
// jest wyliczana z rzeczywistej geometrii SVG (getTotalLength), a opóźnienia
// odzwierciedlają kolejność, w jakiej "prąd" faktycznie płynie: przełącznik ->
// rozgałęzienie -> dwie równoległe gałęzie -> żarówka. Odpala się raz, przy
// pierwszym załadowaniu strony (nie przy przewijaniu).
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const circuit = document.getElementById('circuit-hero');
if (circuit) {
  const SPEED = 340; // jednostek długości ścieżki / sekundę — stała prędkość rysowania

  const setupCircuitTiming = () => {
    const lines = {
      l1: circuit.querySelector('.line-1'),
      l2: circuit.querySelector('.line-2'),
      l3: circuit.querySelector('.line-3'),
      l4: circuit.querySelector('.line-4'),
      l5: circuit.querySelector('.line-5'),
    };
    const nodes = {
      n1: circuit.querySelector('.node-1'),
      n2: circuit.querySelector('.node-2'),
      n3: circuit.querySelector('.node-3'),
    };
    const bulbGroup = circuit.querySelector('.bulb-group');

    const dur = {};
    const start = { l1: 0 };

    Object.entries(lines).forEach(([key, el]) => {
      const length = el.getTotalLength();
      dur[key] = length / SPEED;
      el.style.setProperty('--len', length);
      el.style.setProperty('--dur', `${dur[key]}s`);
    });

    // l2 i l3 startują razem, gdy prąd dotrze do pierwszego węzła (koniec l1);
    // l4 startuje po l2, l5 po l3 — zgodnie z faktycznym przepływem prądu.
    start.l2 = start.l1 + dur.l1;
    start.l3 = start.l1 + dur.l1;
    start.l4 = start.l2 + dur.l2;
    start.l5 = start.l3 + dur.l3;

    Object.entries(lines).forEach(([key, el]) => {
      el.style.setProperty('--delay', `${start[key]}s`);
    });

    nodes.n1.style.setProperty('--delay', `${start.l2}s`);
    nodes.n2.style.setProperty('--delay', `${start.l4}s`);
    nodes.n3.style.setProperty('--delay', `${start.l5}s`);

    if (bulbGroup) {
      const bulbDelay = Math.max(start.l4 + dur.l4, start.l5 + dur.l5);
      bulbGroup.style.setProperty('--bulb-delay', `${bulbDelay}s`);
    }
  };

  setupCircuitTiming();

  if (prefersReducedMotion) {
    circuit.classList.add('energize');
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => circuit.classList.add('energize'), 300);
    });
  }
}

// Scroll reveal
const revealEls = document.querySelectorAll('[data-reveal]');
if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('in-view'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));
}
