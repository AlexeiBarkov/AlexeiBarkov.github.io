// iOS height set
function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setScreenSize();
window.addEventListener('resize', setScreenSize);

// body class
window.addEventListener('load', function () {
    setTimeout(function () {
        document.body.classList.add('on');

        const indexWrap = document.querySelector('.index_wrap');
        if (indexWrap) {
            indexWrap.classList.add('on');
        }
    }, 300);
});


// nav wrap class
document.querySelectorAll('.menu_nav button').forEach(button => {
    button.addEventListener('click', () => {
        const modals = document.querySelectorAll('.info_modal_default');
        modals.forEach(modal => {
            modal.classList.remove('on');
            setTimeout(() => {
                if (!modal.classList.contains('on')) {
                    modal.style.left = '';
                    modal.style.top = '';
                    modal.style.zIndex = '';
                }
            }, 500);
        });

        const scrollWraps = document.querySelectorAll('.scroll_wrap');
        if (scrollWraps) {
            scrollWraps.scrollTop = 0;
        }

        const hamburgerWrap = document.querySelector('.hambuger_wrap');
        const hamburgerModal = document.querySelector('.hambuger_modal');
        if (hamburgerWrap) hamburgerWrap.classList.remove('on');
        if (hamburgerModal) hamburgerModal.classList.remove('on');

        const text = button.textContent.trim().toLowerCase();
        const wrapMap = {
            home: '.index_wrap',
            info: '.info_wrap',
            world: '.world_wrap',
            greeting: '.greeting_wrap',
        };

        const targetSelector = wrapMap[text];
        if (!targetSelector) return;

        Object.values(wrapMap).forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.classList.remove('on');
        });

        document.querySelectorAll('.menu_nav li').forEach(li => {
            li.classList.remove('on');
        });

        const parentLi = button.closest('li');
        if (parentLi) parentLi.classList.add('on');

        const targetWrap = document.querySelector(targetSelector);
        if (targetWrap) targetWrap.classList.add('on');

        const body = document.body;
        if (text === 'greeting') {
            body.classList.add('greeting');
        } else {
            body.classList.remove('greeting');
        }
    });
});


// snow effect
function createSnowflake() {
    const snow = document.createElement('div');
    snow.classList.add('snowflake');

    const size = 5 + Math.random() * 7;
    snow.style.width = `${size}px`;
    snow.style.height = `${size}px`;

    const startX = Math.random() * window.innerWidth;
    const startY = -30;
    snow.style.left = `${startX}px`;
    snow.style.top = `${startY}px`;

    const duration = 5 + Math.random() * 5;
    snow.style.animationDuration = `${duration}s`;

    document.body.appendChild(snow);

    setTimeout(() => {
        if (snow.parentNode === document.body) {
            snow.remove();
        }
    }, duration * 1000);
}

function shouldDisableSnowflakes() {
    if ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) {
        return true;
    }
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
        return true;
    }

    if (window.innerWidth <= 800) {
        return true;
    }

    return false;
}

window.addEventListener('DOMContentLoaded', () => {
    if (!shouldDisableSnowflakes()) {
        console.log("Snowflakes enabled (Likely Desktop, width > 800px).");
        setInterval(createSnowflake, 100);
    } else {
        console.log("Snowflakes disabled (Likely Mobile or width <= 800px).");
    }

    // hambuger
    const hamburger = document.querySelector('header .hambuger_wrap');
    const hamburgerModal = document.querySelector('.hambuger_modal');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('on');

            if (hamburgerModal) {
                hamburgerModal.classList.toggle('on');
            }
        });
    }
});


// home img mousemove effect
let isMouseMoving = false;
let offsetX = 0;
let offsetY = 0;

document.addEventListener('mousemove', (e) => {
    const img = document.querySelector('.index_wrap .bg_black .img_wrap img');
    if (!img) return;

    const { innerWidth, innerHeight } = window;
    offsetX = (e.clientX / innerWidth - 0.5) * 30;
    offsetY = (e.clientY / innerHeight - 0.5) * 30;

    if (!isMouseMoving) {
        isMouseMoving = true;
        requestAnimationFrame(() => {
            img.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
            isMouseMoving = false;
        });
    }
});


// resize script (except responsive css)

// info resize
window.addEventListener('DOMContentLoaded', () => {
    const charWrap = document.querySelector('.info_wrap .contents_wrap .char_wrap');
    if (!charWrap) { console.error('.char_wrap not found.'); return; }
    const img = charWrap.querySelector('img');
    if (!img) { console.error('img not found.'); return; }

    const buttons = [
        { selector: '.surface_p', top: 58, left: 350 },
        { selector: '.inner_p', top: 320, left: 200 },
        { selector: '.dislikes', top: 540, left: 140 },
        { selector: '.speech_s', top: 200, left: 360 },
        { selector: '.special', top: 310, right: 225 },
        { selector: '.weakness', top: 460, right: 340 },
        { selector: '.secret', top: 640, right: 240 }
    ];
    const baseWidth = 650;

    function updateButtonPositions() {
        const imgRect = img.getBoundingClientRect();
        if (imgRect.width === 0 || imgRect.height === 0) {
            return;
        }

        const computedStyle = window.getComputedStyle(charWrap);
        const transformValue = computedStyle.transform;
        let cssScaleFactor = 1;

        if (transformValue && transformValue !== 'none') {
            try {
                if (typeof DOMMatrix === 'function') {
                    const matrix = new DOMMatrix(transformValue);
                    cssScaleFactor = matrix.a;
                } else if (typeof WebKitCSSMatrix === 'function') {
                    const matrix = new WebKitCSSMatrix(transformValue);
                    cssScaleFactor = matrix.a;
                } else {

                    console.warn("DOMMatrix/WebKitCSSMatrix not supported, cannot accurately determine CSS scale. Assuming scale is 1.");
                }
            } catch (e) {
                console.error("Error parsing transform matrix: ", e);
                cssScaleFactor = 1;
            }
        }
        if (cssScaleFactor === 0) cssScaleFactor = 1;


        const preTransformWidth = imgRect.width / cssScaleFactor;

        const layoutScale = preTransformWidth / baseWidth;

        const charWrapPaddingLeft = parseFloat(computedStyle.paddingLeft) || 0;

        buttons.forEach(({ selector, top, left, right }) => {
            const btn = charWrap.querySelector(`.info_button${selector}`);
            if (!btn) return;

            const baseTop = top * layoutScale;
            btn.style.top = `${baseTop}px`;

            if (left !== undefined) {
                const baseLeft = left * layoutScale;
                btn.style.left = `${baseLeft + charWrapPaddingLeft}px`;
                btn.style.right = '';
            } else if (right !== undefined) {
                const equivalentLeft = preTransformWidth - (right * layoutScale);
                btn.style.left = `${equivalentLeft + charWrapPaddingLeft}px`;
                btn.style.right = '';
            }
        });
    }

    if (img.complete && typeof img.naturalWidth !== "undefined" && img.naturalWidth > 0) {
        updateButtonPositions();
    } else {
        img.addEventListener('load', updateButtonPositions);
    }
    img.addEventListener('error', () => { console.error('Image failed to load.'); });

    window.addEventListener('resize', updateButtonPositions);

});

// info modal event
document.addEventListener('DOMContentLoaded', () => {
    const infoButtons = document.querySelectorAll('.info_button');
    const modals = document.querySelectorAll('.info_modal_default');
    const closeButtons = document.querySelectorAll('.behind');

    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetClass = button.classList[1];
            if (!targetClass) return;

            const targetModal = document.querySelector(`.info_modal_default.${targetClass}`);
            if (!targetModal) return;

            modals.forEach(modal => {
                modal.style.zIndex = 9999;
            });

            targetModal.classList.add('on');
            targetModal.style.zIndex = 10000;
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', () => {
            modals.forEach(m => m.style.zIndex = 9999);
            modal.style.zIndex = 10000;
        });
    });

    closeButtons.forEach(closeButton => {
        closeButton.addEventListener('click', (e) => {
            const modal = e.target.closest('.info_modal_default');
            if (modal) {
                modal.classList.remove('on');
                setTimeout(() => {
                    if (!modal.classList.contains('on')) {
                        modal.style.left = '';
                        modal.style.top = '';
                        modal.style.zIndex = '';
                    }
                }, 500);
            }
        });
    });

    modals.forEach(modal => {
        const dragHandle = modal.querySelector('.top');
        if (!dragHandle) return;

        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        dragHandle.addEventListener('mousedown', (e) => {
            if (!modal.classList.contains('on')) return;

            isDragging = true;
            const rect = modal.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            modal.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            e.preventDefault();

            modals.forEach(m => m.style.zIndex = 9999);
            modal.style.zIndex = 10000;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newX = e.clientX - dragOffsetX;
                let newY = e.clientY - dragOffsetY;
                modal.style.left = `${newX}px`;
                modal.style.top = `${newY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                modal.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    });
});