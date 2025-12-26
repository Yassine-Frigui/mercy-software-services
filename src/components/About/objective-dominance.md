# Objectives Hovering Effect Refactoring

This document contains the code snippets for the hovering/dominance effect in the objectives section.

## CSS Styles (Hovering/Dominance Effect)

```css
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 10;
}
.zone {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    opacity: 0;
    transform: scale(0);
    transition: opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s;
    z-index: 15;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    font-size: 1.2rem;
    color: #333;
}
.zone.active {
    opacity: 1;
    transform: scale(1);
}
.zone.top {
    top: 0;
    left: 0;
    transform-origin: bottom right;
    width: 15.5vw;
    height: 12.5vh;
    transform: scale(0);
}
.zone.top.active {
    transform: scale(1);
}
.zone.right {
    top: 0;
    right: 0;
    transform-origin: bottom left;
    width: 50.5vw;
    height: 12.5vh;
    transform: scale(0);
}
.zone.right.active {
    transform: scale(1);
}
.zone.bottom {
    bottom: 0;
    left: 0;
    transform-origin: top right;
    width: 12.5vw;
    height: 12.5vh;
    transform: scale(0);
}
.zone.bottom.active {
    transform: scale(1);
}
.zone.left {
    bottom: 0;
    right: 0;
    transform-origin: top left;
    width: 12.5vw;
    height: 12.5vh;
    transform: scale(0);
}
.zone.left.active {
    transform: scale(1);
}
.zone.center {
    top: 50%;
    left: 50%;
    transform-origin: center;
    width: 12.5vw;
    height: 12.5vh;
    transform: translate(-50%, -50%) scale(0);
}
.zone.center.active {
    transform: translate(-50%, -50%) scale(1);
}
```

## JavaScript Logic (Hovering Effect)

```js
const cards = document.querySelectorAll('.objective-card');
const overlay = document.querySelector('.overlay');
const zones = document.querySelectorAll('.zone');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const zoneClass = card.dataset.zone;
        overlay.style.opacity = '1';
        zones.forEach(zone => {
            if (zone.classList.contains(zoneClass)) {
                zone.classList.add('active');
            }
        });
    });
    card.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
        zones.forEach(zone => {
            zone.classList.remove('active');
        });
    });
});
```

## Notes for Refactoring

- On hover, overlay dims the page, and the corresponding zone expands with text.
- Animation sequence: overlay fades in first, then zone scales up with delay.
- Zones are positioned directionally and sized small (approx. 12.5% of viewport).