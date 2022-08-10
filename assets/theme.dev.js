
/*
* @license
* Pipeline Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies.  Modified versions of the theme 
* code are not supported by Shopify or Groupthought.
*
* In order to use this file you will need to change 
* theme.js to theme.dev.js in /layout/theme.liquid
*
*/

(function (FlickityFade, bodyScrollLock, MicroModal, Rellax, Flickity, themeCurrency, Sqrl, axios, themeAddresses, ellipsed, FlickitySync, AOS) {
  'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var Sqrl__namespace = /*#__PURE__*/_interopNamespaceDefault(Sqrl);

  window.theme = window.theme || {};

  window.theme.sizes = {
    small: 480,
    medium: 768,
    large: 990,
    widescreen: 1400,
  };

  window.theme.keyboardKeys = {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    LEFTARROW: 37,
    RIGHTARROW: 39,
  };

  function moveModals(container) {
    const modals = container.querySelectorAll('[data-modal]');
    const modalBin = document.querySelector('[data-modal-container]');
    modals.forEach((element) => {
      const alreadyAdded = modalBin.querySelector(`[id="${element.id}"]`);
      if (!alreadyAdded) {
        modalBin.appendChild(element);
      }
    });
  }

  const classes$q = ['neighbor--white', 'neighbor--light', 'neighbor--dark', 'neighbor--black'];

  function moveTags(container) {
    container.querySelectorAll('shopify-section').forEach((element) => {
      element.classList.remove(classes$q);
    });
    container.querySelectorAll('.bg--neutral').forEach((element) => {
      element.parentElement.classList.add('neighbor--white');
    });
    container.querySelectorAll('.bg--accent').forEach((element) => {
      element.parentElement.classList.add('neighbor--light');
    });
    container.querySelectorAll('.bg--invert').forEach((element) => {
      element.parentElement.classList.add('neighbor--dark');
    });
    container.querySelectorAll('.bg--invert--accent').forEach((element) => {
      element.parentElement.classList.add('neighbor--black');
    });
  }

  function floatLabels(container) {
    const floats = container.querySelectorAll('.float__wrapper');
    floats.forEach((element) => {
      const label = element.querySelector('label');
      const input = element.querySelector('input, textarea');
      if (label) {
        input.addEventListener('keyup', (event) => {
          if (event.target.value !== '') {
            label.classList.add('label--float');
          } else {
            label.classList.remove('label--float');
          }
        });
      }
      if (input && input.value && input.value.length) {
        label.classList.add('label--float');
      }
    });
  }

  function errorTabIndex(container) {
    const errata = container.querySelectorAll('.errors');
    errata.forEach((element) => {
      element.setAttribute('tabindex', '0');
      element.setAttribute('aria-live', 'assertive');
      element.setAttribute('role', 'alert');
    });
  }

  function lazyPostLoad(container) {
    document.addEventListener('theme:resize', loadDesktop.bind(null, container));
    loadDesktop(container);
  }

  function loadDesktop(container) {
    if (window.innerWidth > window.theme.sizes.small) {
      setTimeout(() => {
        const elements = container.querySelectorAll('.lazypostload-desktop');
        elements.forEach((element) => {
          element.style.visibility = 'visible';
        });
      }, 2000);
    }
  }

  function readHeights() {
    const h = {};
    h.windowHeight = window.innerHeight;
    h.announcementHeight = getHeight('#shopify-section-announcement');
    h.footerHeight = getHeight('[data-section-type*="footer"]');
    h.menuHeight = getHeight('[data-header-height]');
    h.headerHeight = h.menuHeight + h.announcementHeight;
    h.logoHeight = getFooterLogoWithPadding();
    return h;
  }

  function setVarsOnResize() {
    document.addEventListener('theme:resize', resizeVars);
    setVars();
  }

  function setVars() {
    const {windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight} = readHeights();

    document.documentElement.style.setProperty('--footer-logo', `${logoHeight}px`);
    document.documentElement.style.setProperty('--full-screen', `${windowHeight}px`);
    document.documentElement.style.setProperty('--three-quarters', `${windowHeight * 0.75}px`);
    document.documentElement.style.setProperty('--two-thirds', `${windowHeight * 0.66}px`);
    document.documentElement.style.setProperty('--one-half', `${windowHeight * 0.5}px`);
    document.documentElement.style.setProperty('--one-third', `${windowHeight * 0.33}px`);
    document.documentElement.style.setProperty('--one-fifth', `${windowHeight * 0.2}px`);
    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);
    document.documentElement.style.setProperty('--content-min', `${windowHeight - headerHeight - footerHeight}px`);

    document.documentElement.style.setProperty('--scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
  }

  function resizeVars() {
    // restrict the heights that are changed on resize to avoid iOS jump when URL bar is shown and hidden
    const {windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight} = readHeights();
    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);
    document.documentElement.style.setProperty('--content-min', `${windowHeight - headerHeight - footerHeight}px`);
  }

  function getHeight(selector) {
    const el = document.querySelector(selector);
    if (el) {
      return el.clientHeight;
    } else {
      return 0;
    }
  }

  function getFooterLogoWithPadding() {
    const height = getHeight('[data-footer-logo]');
    if (height > 0) {
      return height + 20;
    } else {
      return 0;
    }
  }

  function singles(frame, wrappers) {
    // sets the height of any frame passed in with the
    // tallest js-overflow-content as well as any image in that frame
    let padding = 64;
    let tallest = 0;

    wrappers.forEach((wrap) => {
      if (wrap.offsetHeight > tallest) {
        const getMarginTop = parseInt(window.getComputedStyle(wrap).marginTop);
        const getMarginBottom = parseInt(window.getComputedStyle(wrap).marginBottom);
        const getMargin = getMarginTop + getMarginBottom;
        if (getMargin > padding) {
          padding = getMargin;
        }

        tallest = wrap.offsetHeight;
      }
    });
    const images = frame.querySelectorAll('[data-overflow-background]');
    const frames = [frame, ...images];
    frames.forEach((el) => {
      el.style.setProperty('min-height', `calc(${tallest + padding}px + var(--menu-height))`);
    });
  }

  function doubles(section) {
    let footerLogoH = document.querySelector('[data-footer-logo]') ? document.querySelector('[data-footer-logo]').clientHeight + 20 : 0;
    const lastSection = document.querySelector('#MainContent .shopify-section:last-child [data-section-id]');
    const lastSectionAttrID = lastSection ? lastSection.getAttribute('data-section-id') : null;

    if ((lastSectionAttrID !== null && section.getAttribute('data-section-id') !== lastSectionAttrID) || !lastSection) {
      footerLogoH = 0;
    }

    if (window.innerWidth < window.theme.sizes.medium) {
      // if we are below the small breakpoint, the double section acts like two independent
      // single frames
      let singleFrames = section.querySelectorAll('[data-overflow-frame]');
      singleFrames.forEach((singleframe) => {
        const wrappers = singleframe.querySelectorAll('[data-overflow-content]');
        singles(singleframe, wrappers);
      });
      return;
    }

    const padding = parseInt(getComputedStyle(section).getPropertyValue('--outer')) * 2;
    let tallest = 0;

    const frames = section.querySelectorAll('[data-overflow-frame]');
    const contentWrappers = section.querySelectorAll('[data-overflow-content]');
    contentWrappers.forEach((content) => {
      if (content.offsetHeight > tallest) {
        tallest = content.offsetHeight;
      }
    });
    const images = section.querySelectorAll('[data-overflow-background]');
    let applySizes = [...frames, ...images];
    applySizes.forEach((el) => {
      el.style.setProperty('min-height', `${tallest + padding}px`);
    });
    section.style.setProperty('min-height', `${tallest + padding + 2 + footerLogoH}px`);
  }

  function preventOverflow(container) {
    const singleFrames = container.querySelectorAll('.js-overflow-container');
    if (singleFrames) {
      singleFrames.forEach((frame) => {
        const wrappers = frame.querySelectorAll('.js-overflow-content');
        singles(frame, wrappers);
        document.addEventListener('theme:resize', () => {
          singles(frame, wrappers);
        });
      });

      // Reload slides if container has slideshow
      const slideshows = container.querySelectorAll('[data-slideshow-wrapper]');

      if (slideshows.length) {
        slideshows.forEach((slideshow) => {
          const slideshowInstance = FlickityFade.data(slideshow);
          if (typeof slideshowInstance !== 'undefined') {
            slideshow.dispatchEvent(
              new CustomEvent('theme:slideshow:reload', {
                bubbles: true,
              })
            );
          }
        });
      }
    }

    const doubleSections = container.querySelectorAll('[data-overflow-wrapper]');
    if (doubleSections) {
      doubleSections.forEach((section) => {
        doubles(section);
        document.addEventListener('theme:resize', () => {
          doubles(section);
        });
      });
    }
  }

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  let lastWindowWidth = window.innerWidth;
  let lastWindowHeight = window.innerHeight;

  function dispatch$1() {
    document.dispatchEvent(
      new CustomEvent('theme:resize', {
        bubbles: true,
      })
    );

    if (lastWindowWidth !== window.innerWidth) {
      document.dispatchEvent(
        new CustomEvent('theme:resize:width', {
          bubbles: true,
        })
      );

      lastWindowWidth = window.innerWidth;
    }

    if (lastWindowHeight !== window.innerHeight) {
      document.dispatchEvent(
        new CustomEvent('theme:resize:height', {
          bubbles: true,
        })
      );

      lastWindowHeight = window.innerHeight;
    }
  }

  function resizeListener() {
    window.addEventListener(
      'resize',
      debounce(function () {
        dispatch$1();
      }, 50)
    );
  }

  let prev = window.pageYOffset;
  let up = null;
  let down = null;
  let wasUp = null;
  let wasDown = null;
  let scrollLockTimeout = 0;

  function dispatch() {
    const position = window.pageYOffset;
    if (position > prev) {
      down = true;
      up = false;
    } else if (position < prev) {
      down = false;
      up = true;
    } else {
      up = null;
      down = null;
    }
    prev = position;
    document.dispatchEvent(
      new CustomEvent('theme:scroll', {
        detail: {
          up,
          down,
          position,
        },
        bubbles: false,
      })
    );
    if (up && !wasUp) {
      document.dispatchEvent(
        new CustomEvent('theme:scroll:up', {
          detail: {position},
          bubbles: false,
        })
      );
    }
    if (down && !wasDown) {
      document.dispatchEvent(
        new CustomEvent('theme:scroll:down', {
          detail: {position},
          bubbles: false,
        })
      );
    }
    wasDown = down;
    wasUp = up;
  }

  function lock(e) {
    let element = e.target;
    if (e.detail && e.detail instanceof Element) {
      element = e.detail;
    }
    bodyScrollLock.disableBodyScroll(element);
    document.documentElement.setAttribute('data-scroll-locked', '');
  }

  function unlock() {
    // Prevent body scroll lock race conditions
    scrollLockTimeout = setTimeout(() => {
      document.body.removeAttribute('data-drawer-closing');
    }, 20);

    if (document.body.hasAttribute('data-drawer-closing')) {
      document.body.removeAttribute('data-drawer-closing');

      if (scrollLockTimeout) {
        clearTimeout(scrollLockTimeout);
      }

      return;
    } else {
      document.body.setAttribute('data-drawer-closing', '');
    }

    document.documentElement.removeAttribute('data-scroll-locked');
    bodyScrollLock.clearAllBodyScrollLocks();
  }

  function scrollListener() {
    let timeout;
    window.addEventListener(
      'scroll',
      function () {
        if (timeout) {
          window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(function () {
          dispatch();
        });
      },
      {passive: true}
    );

    window.addEventListener('theme:scroll:lock', lock);
    window.addEventListener('theme:scroll:unlock', unlock);
  }

  resizeListener();
  scrollListener();

  window.addEventListener('load', () => {
    setVarsOnResize();
    floatLabels(document);
    errorTabIndex(document);
    moveTags(document);
    moveModals(document);
    preventOverflow(document);
    lazyPostLoad(document);
  });

  document.addEventListener('shopify:section:load', (e) => {
    const container = e.target;
    floatLabels(container);
    errorTabIndex(container);
    moveModals(container);
    moveTags(container);
    preventOverflow(container);
    lazyPostLoad(container);
  });

  document.addEventListener('shopify:section:reorder', () => {
    document.dispatchEvent(new CustomEvent('header:check', {bubbles: false}));
  });

  const showElement = (elem, removeProp = false, prop = 'block') => {
    if (elem) {
      if (removeProp) {
        elem.style.removeProperty('display');
      } else {
        elem.style.display = prop;
      }
    }
  };

  function FetchError(object) {
    this.status = object.status || null;
    this.headers = object.headers || null;
    this.json = object.json || null;
    this.body = object.body || null;
  }
  FetchError.prototype = Error.prototype;

  const selectors$T = {
    elements: {
      scrollbar: 'data-scrollbar-slider',
      scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
      scrollbarArrowNext: '[data-scrollbar-arrow-next]',
    },
    classes: {
      hide: 'is-hidden',
      siblingLinks: 'siblings__link ',
    },
    times: {
      delay: 200,
    },
  };

  class NativeScrollbar {
    constructor(scrollbar) {
      this.scrollbar = scrollbar;

      this.arrowNext = this.scrollbar.parentNode.querySelector(selectors$T.elements.scrollbarArrowNext);
      this.arrowPrev = this.scrollbar.parentNode.querySelector(selectors$T.elements.scrollbarArrowPrev);

      this.init();
      this.resize();

      if (this.scrollbar.hasAttribute(selectors$T.elements.scrollbar)) {
        this.scrollToVisibleElement();
      }
    }

    init() {
      if (this.arrowNext && this.arrowPrev) {
        if (window.isRTL) {
          this.togglePrevArrow();
        } else {
          this.toggleNextArrow();
        }

        this.events();
      }
    }

    resize() {
      document.addEventListener('theme:resize', () => {
        if (window.isRTL) {
          this.togglePrevArrow();
        } else {
          this.toggleNextArrow();
        }
      });
    }

    events() {
      this.arrowNext.addEventListener('click', (event) => {
        event.preventDefault();

        this.goToNext();
      });

      this.arrowPrev.addEventListener('click', (event) => {
        event.preventDefault();

        this.goToPrev();
      });

      this.scrollbar.addEventListener('scroll', () => {
        this.togglePrevArrow();
        this.toggleNextArrow();
      });
    }

    goToNext() {
      const position = this.scrollbar.getBoundingClientRect().width / 2 + this.scrollbar.scrollLeft;

      this.move(position);

      this.arrowPrev.classList.remove(selectors$T.classes.hide);

      this.toggleNextArrow();
    }

    goToPrev() {
      const position = this.scrollbar.scrollLeft - this.scrollbar.getBoundingClientRect().width / 2;

      this.move(position);

      this.arrowNext.classList.remove(selectors$T.classes.hide);

      this.togglePrevArrow();
    }

    toggleNextArrow() {
      setTimeout(() => {
        if (window.isRTL) {
          this.arrowNext.classList.toggle(selectors$T.classes.hide, this.scrollbar.scrollLeft === 0);
        } else {
          this.arrowNext.classList.toggle(selectors$T.classes.hide, Math.round(this.scrollbar.scrollLeft + this.scrollbar.getBoundingClientRect().width + 1) >= this.scrollbar.scrollWidth);
        }
      }, selectors$T.times.delay);
    }

    togglePrevArrow() {
      setTimeout(() => {
        if (window.isRTL) {
          this.arrowPrev.classList.toggle(selectors$T.classes.hide, Math.abs(this.scrollbar.scrollLeft) + this.scrollbar.getBoundingClientRect().width + 1 >= this.scrollbar.scrollWidth);
        } else {
          this.arrowPrev.classList.toggle(selectors$T.classes.hide, this.scrollbar.scrollLeft <= 0);
        }
      }, selectors$T.times.delay);
    }

    scrollToVisibleElement() {
      [].forEach.call(this.scrollbar.children, (element) => {
        element.addEventListener('click', (event) => {
          if (!event.target.classList.contains(selectors$T.classes.siblingLinks) && !event.target.closest(`.${selectors$T.classes.siblingLinks}`)) {
            event.preventDefault();
          }

          this.move(element.offsetLeft - element.clientWidth);
        });
      });
    }

    move(offsetLeft) {
      this.scrollbar.scrollTo({
        top: 0,
        left: offsetLeft,
        behavior: 'smooth',
      });
    }
  }

  const selectors$S = {
    siblingsInnerHolder: '[data-sibling-inner]',
  };

  class Siblings {
    constructor(holder) {
      this.siblings = holder.querySelectorAll(selectors$S.siblingsInnerHolder);

      this.init();
    }

    init() {
      this.siblings.forEach((sibling) => {
        new NativeScrollbar(sibling);
      });
    }
  }

  const siblings = {
    onLoad() {
      new Siblings(this.container);
    },
  };

  const cookieDefaultValues = {
    expires: 7,
    path: '/',
    domain: window.location.hostname,
  };

  class Cookies {
    constructor(options = {}) {
      this.options = {
        ...cookieDefaultValues,
        ...options,
      };
    }

    /**
     * Write cookie
     * @param value - String
     */
    write(value) {
      document.cookie = `${this.options.name}=${value}; expires=${this.options.expires}; path=${this.options.path}; domain=${this.options.domain}`;
    }

    /**
     * Read cookies and returns an array of values
     * @returns Array
     */
    read() {
      let cookieValuesArr = [];
      const hasCookieWithThisName = document.cookie.split('; ').find((row) => row.startsWith(this.options.name));

      if (document.cookie.indexOf('; ') !== -1 && hasCookieWithThisName) {
        const cookieValue = document.cookie
          .split('; ')
          .find((row) => row.startsWith(this.options.name))
          .split('=')[1];

        if (cookieValue !== null) {
          cookieValuesArr = cookieValue.split(',');
        }
      }

      return cookieValuesArr;
    }

    destroy() {
      document.cookie = `${this.options.name}=null; expires=${this.options.expires}; path=${this.options.path}; domain=${this.options.domain}`;
    }

    remove(removedValue) {
      const cookieValue = this.read();
      const position = cookieValue.indexOf(removedValue);

      if (position !== -1) {
        cookieValue.splice(position, 1);
        this.write(cookieValue);
      }
    }
  }

  const config = {
    howManyToShow: 4,
    howManyToStoreInMemory: 10,
    wrapper: '[data-recently-viewed-products]',
    limit: 'data-limit',
    recentTabLink: '[data-recent-link-tab]',
    recentWrapper: '[data-recent-wrapper]',
    recentViewedTab: '[data-recently-viewed-tab]',
    tabsHolderScroll: '[data-tabs-holder-scroll]',
    apiContent: '[data-api-content]',
    dataMinimum: 'data-minimum',
  };

  const cookieConfig = {
    expires: 90,
    name: 'shopify_recently_viewed',
  };

  const sections$n = [];
  const excludedHandles = [];

  class RecentProducts {
    constructor(section) {
      this.container = section.container;
      this.cookie = new Cookies(cookieConfig);
      this.wrapper = this.container.querySelector(config.wrapper);

      if (this.wrapper === null) {
        return;
      }

      this.howManyToShow = parseInt(this.container.querySelector(config.recentWrapper).getAttribute(config.limit)) || config.howManyToShow;
      this.minimum = parseInt(this.container.querySelector(config.recentWrapper).getAttribute(config.dataMinimum));

      this.recentViewedTab = this.container.querySelector(config.recentViewedTab);
      this.recentViewedLink = this.container.querySelector(config.recentTabLink);
      this.tabsHolderScroll = this.container.querySelector(config.tabsHolderScroll);

      this.renderProducts();
    }

    renderProducts() {
      const recentlyViewedHandlesArray = this.cookie.read();
      const arrayURLs = [];
      let counter = 0;

      if (recentlyViewedHandlesArray.length > 0) {
        for (let index = 0; index < recentlyViewedHandlesArray.length; index++) {
          const handle = recentlyViewedHandlesArray[index];

          if (excludedHandles.includes(handle)) {
            continue;
          }

          const url = `${window.theme.routes.root_url}products/${handle}?section_id=api-product-grid-item`;

          arrayURLs.push(url);

          counter++;

          if (counter === this.howManyToShow || counter === recentlyViewedHandlesArray.length - 1) {
            break;
          }
        }

        if (arrayURLs.length > 0 && arrayURLs.length >= this.minimum) {
          this.container.classList.remove('hide');

          if (this.recentViewedLink && this.recentViewedLink.previousElementSibling) {
            this.tabsHolderScroll.classList.remove('hide');
          }

          const fecthRequests = arrayURLs.map((url) => fetch(url, {mode: 'no-cors'}).then(this.handleErrors));
          const productMarkups = [];

          Promise.allSettled(fecthRequests)
            .then((responses) => {
              return Promise.all(
                responses.map(async (response) => {
                  if (response.status === 'fulfilled') {
                    productMarkups.push(await response.value.text());
                  }
                })
              );
            })
            .then(() => {
              productMarkups.forEach((markup) => {
                const buffer = document.createElement('div');
                const slide = document.createElement('div');
                buffer.innerHTML = markup;

                slide.classList.add('product-grid-slide');
                slide.innerHTML = buffer.querySelector(config.apiContent).innerHTML;

                this.wrapper.appendChild(slide);
              });

              new Siblings(this.container);
            })
            .then(() => {
              showElement(this.wrapper, true);

              this.container.dispatchEvent(new CustomEvent('recent-products:added', {bubbles: true}));
            });
        } else if (this.recentViewedTab) {
          const hasSiblingTabs =
            Array.prototype.filter.call(this.recentViewedTab.parentNode.children, (child) => {
              return child !== this.recentViewedTab;
            }).length > 1;

          if (this.recentViewedLink && this.recentViewedLink.previousElementSibling) {
            this.tabsHolderScroll.classList.add('hide');
          }

          if (!hasSiblingTabs) {
            this.container.classList.add('hide');
          }
        } else {
          this.container.classList.add('hide');
        }
      }
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.text().then(function (text) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            text: text,
          });
          throw e;
        });
      }
      return response;
    }
  }

  class RecordRecentlyViewed {
    constructor(handle) {
      this.handle = handle;
      this.cookie = new Cookies(cookieConfig);

      if (typeof this.handle === 'undefined') {
        return;
      }

      excludedHandles.push(this.handle);

      this.updateCookie();
    }

    updateCookie() {
      let recentlyViewed = this.cookie.read();

      // In what position is that product in memory.
      const position = recentlyViewed.indexOf(this.handle);

      // If not in memory.
      if (position === -1) {
        // Add product at the start of the list.
        recentlyViewed.unshift(this.handle);
        // Only keep what we need.
        recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
      } else {
        // Remove the product and place it at start of list.
        recentlyViewed.splice(position, 1);
        recentlyViewed.unshift(this.handle);
      }

      // Update cookie.
      this.cookie.write(recentlyViewed);
    }
  }

  const recentProducts = {
    onLoad() {
      sections$n[this.id] = new RecentProducts(this);
    },
  };

  const selectors$R = {
    templateAddresses: '[data-address-wrapper]',
    addressNewForm: '[data-new-address-form]',
    addressNewFormInner: '[new-address-form-inner]',
    btnNew: '.address-new-toggle',
    btnEdit: '.address-edit-toggle',
    btnDelete: '.address-delete',
    classHide: 'hide',
    dataFormId: 'data-form-id',
    dataConfirmMessage: 'data-confirm-message',
    defaultConfirmMessage: 'Are you sure you wish to delete this address?',
    editAddress: '#EditAddress',
    addressCountryNew: 'AddressCountryNew',
    addressProvinceNew: 'AddressProvinceNew',
    addressProvinceContainerNew: 'AddressProvinceContainerNew',
    addressCountryOption: '.address-country-option',
    addressCountry: 'AddressCountry',
    addressProvince: 'AddressProvince',
    addressProvinceContainer: 'AddressProvinceContainer',
  };

  class Addresses {
    constructor(section) {
      this.section = section;
      this.addressNewForm = this.section.querySelector(selectors$R.addressNewForm);
      this.init();
    }

    init() {
      if (this.addressNewForm) {
        const section = this.section;
        const newAddressFormInner = this.addressNewForm.querySelector(selectors$R.addressNewFormInner);
        this.customerAddresses();

        const newButtons = section.querySelectorAll(selectors$R.btnNew);
        if (newButtons.length) {
          newButtons.forEach((element) => {
            element.addEventListener('click', function () {
              newAddressFormInner.classList.toggle(selectors$R.classHide);
            });
          });
        }

        const editButtons = section.querySelectorAll(selectors$R.btnEdit);
        if (editButtons.length) {
          editButtons.forEach((element) => {
            element.addEventListener('click', function () {
              const formId = this.getAttribute(selectors$R.dataFormId);
              section.querySelector(`${selectors$R.editAddress}_${formId}`).classList.toggle(selectors$R.classHide);
            });
          });
        }

        const deleteButtons = section.querySelectorAll(selectors$R.btnDelete);
        if (deleteButtons.length) {
          deleteButtons.forEach((element) => {
            element.addEventListener('click', function () {
              const formId = this.getAttribute(selectors$R.dataFormId);
              const confirmMessage = this.getAttribute(selectors$R.dataConfirmMessage);
              if (confirm(confirmMessage || selectors$R.defaultConfirmMessage)) {
                Shopify.postLink(window.theme.routes.account_addresses_url + '/' + formId, {parameters: {_method: 'delete'}});
              }
            });
          });
        }
      }
    }

    customerAddresses() {
      // Initialize observers on address selectors, defined in shopify_common.js
      if (Shopify.CountryProvinceSelector) {
        new Shopify.CountryProvinceSelector(selectors$R.addressCountryNew, selectors$R.addressProvinceNew, {
          hideElement: selectors$R.addressProvinceContainerNew,
        });
      }

      // Initialize each edit form's country/province selector
      const countryOptions = this.section.querySelectorAll(selectors$R.addressCountryOption);
      countryOptions.forEach((element) => {
        const formId = element.getAttribute(selectors$R.dataFormId);
        const countrySelector = `${selectors$R.addressCountry}_${formId}`;
        const provinceSelector = `${selectors$R.addressProvince}_${formId}`;
        const containerSelector = `${selectors$R.addressProvinceContainer}_${formId}`;

        new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
          hideElement: containerSelector,
        });
      });
    }
  }

  const template = document.querySelector(selectors$R.templateAddresses);
  if (template) {
    new Addresses(template);
  }

  /**
   * Password Template Script
   * ------------------------------------------------------------------------------
   * A file that contains code for the Password template.
   *
   * @namespace password
   */

  (function () {
    var recoverPasswordForm = document.querySelector('#RecoverPassword');
    if (recoverPasswordForm) {
      customerLogin();
    }

    function customerLogin() {
      var config = {
        recoverPasswordForm: '#RecoverPassword',
        hideRecoverPasswordLink: '#HideRecoverPasswordLink',
      };

      checkUrlHash();
      resetPasswordSuccess();

      document.querySelector(config.recoverPasswordForm).addEventListener('click', onShowHidePasswordForm);
      document.querySelector(config.hideRecoverPasswordLink).addEventListener('click', onShowHidePasswordForm);

      function onShowHidePasswordForm(evt) {
        evt.preventDefault();
        toggleRecoverPasswordForm();
      }

      function checkUrlHash() {
        var hash = window.location.hash;

        // Allow deep linking to recover password form
        if (hash === '#recover') {
          toggleRecoverPasswordForm();
        }
      }

      /**
       *  Show/Hide recover password form
       */
      function toggleRecoverPasswordForm() {
        var emailValue = document.querySelector('#CustomerEmail').value;
        document.querySelector('#RecoverEmail').value = emailValue;
        document.querySelector('#RecoverPasswordForm').classList.toggle('display-none');
        document.querySelector('#CustomerLoginForm').classList.toggle('display-none');
      }

      /**
       *  Show reset password success message
       */
      function resetPasswordSuccess() {
        var formSuccess = document.querySelector('.reset-password-success');
        // check if reset password form was successfully submited.
        if (formSuccess) {
          document.querySelector('#ResetSuccess').classList.remove('display-none');
        }
      }
    }
  })();

  window.Shopify = window.Shopify || {};
  window.Shopify.theme = window.Shopify.theme || {};
  window.Shopify.theme.sections = window.Shopify.theme.sections || {};

  window.Shopify.theme.sections.registered = window.Shopify.theme.sections.registered || {};
  window.Shopify.theme.sections.instances = window.Shopify.theme.sections.instances || [];
  const registered = window.Shopify.theme.sections.registered;
  const instances = window.Shopify.theme.sections.instances;

  const selectors$Q = {
    id: 'data-section-id',
    type: 'data-section-type',
  };

  class Registration {
    constructor(type = null, components = []) {
      this.type = type;
      this.components = validateComponentsArray(components);
      this.callStack = {
        onLoad: [],
        onUnload: [],
        onSelect: [],
        onDeselect: [],
        onBlockSelect: [],
        onBlockDeselect: [],
        onReorder: [],
      };
      components.forEach((comp) => {
        for (const [key, value] of Object.entries(comp)) {
          const arr = this.callStack[key];
          if (Array.isArray(arr) && typeof value === 'function') {
            arr.push(value);
          } else {
            console.warn(`Unregisted function: '${key}' in component: '${this.type}'`);
            console.warn(value);
          }
        }
      });
    }

    getStack() {
      return this.callStack;
    }
  }

  class Section {
    constructor(container, registration) {
      this.container = validateContainerElement(container);
      this.id = container.getAttribute(selectors$Q.id);
      this.type = registration.type;
      this.callStack = registration.getStack();

      try {
        this.onLoad();
      } catch (e) {
        console.warn(`Error in section: ${this.id}`);
        console.warn(this);
        console.warn(e);
      }
    }

    callFunctions(key, e = null) {
      this.callStack[key].forEach((func) => {
        const props = {
          id: this.id,
          type: this.type,
          container: this.container,
        };
        if (e) {
          func.call(props, e);
        } else {
          func.call(props);
        }
      });
    }

    onLoad() {
      this.callFunctions('onLoad');
    }

    onUnload() {
      this.callFunctions('onUnload');
    }

    onSelect(e) {
      this.callFunctions('onSelect', e);
    }

    onDeselect(e) {
      this.callFunctions('onDeselect', e);
    }

    onBlockSelect(e) {
      this.callFunctions('onBlockSelect', e);
    }

    onBlockDeselect(e) {
      this.callFunctions('onBlockDeselect', e);
    }

    onReorder(e) {
      this.callFunctions('onReorder', e);
    }
  }

  function validateContainerElement(container) {
    if (!(container instanceof Element)) {
      throw new TypeError('Theme Sections: Attempted to load section. The section container provided is not a DOM element.');
    }
    if (container.getAttribute(selectors$Q.id) === null) {
      throw new Error('Theme Sections: The section container provided does not have an id assigned to the ' + selectors$Q.id + ' attribute.');
    }

    return container;
  }

  function validateComponentsArray(value) {
    if ((typeof value !== 'undefined' && typeof value !== 'object') || value === null) {
      throw new TypeError('Theme Sections: The components object provided is not a valid');
    }

    return value;
  }

  /*
   * @shopify/theme-sections
   * -----------------------------------------------------------------------------
   *
   * A framework to provide structure to your Shopify sections and a load and unload
   * lifecycle. The lifecycle is automatically connected to theme editor events so
   * that your sections load and unload as the editor changes the content and
   * settings of your sections.
   */

  function register(type, components) {
    if (typeof type !== 'string') {
      throw new TypeError('Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered');
    }

    if (typeof registered[type] !== 'undefined') {
      throw new Error('Theme Sections: A section of type "' + type + '" has already been registered. You cannot register the same section type twice');
    }

    if (!Array.isArray(components)) {
      components = [components];
    }

    const section = new Registration(type, components);
    registered[type] = section;

    return registered;
  }

  function load(types, containers) {
    types = normalizeType(types);

    if (typeof containers === 'undefined') {
      containers = document.querySelectorAll('[' + selectors$Q.type + ']');
    }

    containers = normalizeContainers(containers);

    types.forEach(function (type) {
      const registration = registered[type];

      if (typeof registration === 'undefined') {
        return;
      }

      containers = containers.filter(function (container) {
        // Filter from list of containers because container already has an instance loaded
        if (isInstance(container)) {
          return false;
        }

        // Filter from list of containers because container doesn't have data-section-type attribute
        if (container.getAttribute(selectors$Q.type) === null) {
          return false;
        }

        // Keep in list of containers because current type doesn't match
        if (container.getAttribute(selectors$Q.type) !== type) {
          return true;
        }

        instances.push(new Section(container, registration));

        // Filter from list of containers because container now has an instance loaded
        return false;
      });
    });
  }

  function unload(selector) {
    var instancesToUnload = getInstances(selector);

    instancesToUnload.forEach(function (instance) {
      var index = instances
        .map(function (e) {
          return e.id;
        })
        .indexOf(instance.id);
      instances.splice(index, 1);
      instance.onUnload();
    });
  }

  function reorder(selector) {
    var instancesToReorder = getInstances(selector);

    instancesToReorder.forEach(function (instance) {
      instance.onReorder();
    });
  }

  function getInstances(selector) {
    var filteredInstances = [];

    // Fetch first element if its an array
    if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
      var firstElement = selector[0];
    }

    // If selector element is DOM element
    if (selector instanceof Element || firstElement instanceof Element) {
      var containers = normalizeContainers(selector);

      containers.forEach(function (container) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function (instance) {
            return instance.container === container;
          })
        );
      });

      // If select is type string
    } else if (typeof selector === 'string' || typeof firstElement === 'string') {
      var types = normalizeType(selector);

      types.forEach(function (type) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function (instance) {
            return instance.type === type;
          })
        );
      });
    }

    return filteredInstances;
  }

  function getInstanceById(id) {
    var instance;

    for (var i = 0; i < instances.length; i++) {
      if (instances[i].id === id) {
        instance = instances[i];
        break;
      }
    }
    return instance;
  }

  function isInstance(selector) {
    return getInstances(selector).length > 0;
  }

  function normalizeType(types) {
    // If '*' then fetch all registered section types
    if (types === '*') {
      types = Object.keys(registered);

      // If a single section type string is passed, put it in an array
    } else if (typeof types === 'string') {
      types = [types];

      // If single section constructor is passed, transform to array with section
      // type string
    } else if (types.constructor === Section) {
      types = [types.prototype.type];

      // If array of typed section constructors is passed, transform the array to
      // type strings
    } else if (Array.isArray(types) && types[0].constructor === Section) {
      types = types.map(function (Section) {
        return Section.type;
      });
    }

    types = types.map(function (type) {
      return type.toLowerCase();
    });

    return types;
  }

  function normalizeContainers(containers) {
    // Nodelist with entries
    if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
      containers = Array.prototype.slice.call(containers);

      // Empty Nodelist
    } else if (NodeList.prototype.isPrototypeOf(containers) && containers.length === 0) {
      containers = [];

      // Handle null (document.querySelector() returns null with no match)
    } else if (containers === null) {
      containers = [];

      // Single DOM element
    } else if (!Array.isArray(containers) && containers instanceof Element) {
      containers = [containers];
    }

    return containers;
  }

  if (window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$Q.id + '="' + id + '"]');

      if (container !== null) {
        load(container.getAttribute(selectors$Q.type), container);
      }
    });

    document.addEventListener('shopify:section:reorder', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$Q.id + '="' + id + '"]');
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        reorder(container);
      }
    });

    document.addEventListener('shopify:section:unload', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$Q.id + '="' + id + '"]');
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        unload(container);
      }
    });

    document.addEventListener('shopify:section:select', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onSelect(event);
      }
    });

    document.addEventListener('shopify:section:deselect', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onDeselect(event);
      }
    });

    document.addEventListener('shopify:block:select', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockSelect(event);
      }
    });

    document.addEventListener('shopify:block:deselect', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockDeselect(event);
      }
    });
  }

  /**
   * A11y Helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions that help make your theme more accessible
   */

  /**
   * Moves focus to an HTML element
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects. Used in bindInPageLinks()
   * eg move focus to a modal that is opened. Used in trapFocus()
   *
   * @param {Element} container - Container DOM element to trap focus inside of
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   */
  function forceFocus(element, options) {
    options = options || {};

    element.focus();
    if (typeof options.className !== 'undefined') {
      element.classList.add(options.className);
    }
    element.addEventListener('blur', callback);

    function callback(event) {
      event.target.removeEventListener(event.type, callback);

      if (typeof options.className !== 'undefined') {
        element.classList.remove(options.className);
      }
    }
  }

  /**
   * If there's a hash in the url, focus the appropriate element
   * This compensates for older browsers that do not move keyboard focus to anchor links.
   * Recommendation: To be called once the page in loaded.
   *
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   * @param {string} options.ignore - Selector for elements to not include.
   */

  function focusHash(options) {
    options = options || {};
    var hash = window.location.hash;
    var element = document.getElementById(hash.slice(1));

    // if we are to ignore this element, early return
    if (element && options.ignore && element.matches(options.ignore)) {
      return false;
    }

    if (hash && element) {
      forceFocus(element, options);
    }
  }

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   * This compensates for older browsers that do not move keyboard focus to anchor links.
   * Recommendation: To be called once the page in loaded.
   *
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   * @param {string} options.ignore - CSS selector for elements to not include.
   */

  function bindInPageLinks(options) {
    options = options || {};
    var links = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));

    function queryCheck(selector) {
      return document.getElementById(selector) !== null;
    }

    return links.filter(function (link) {
      if (link.hash === '#' || link.hash === '') {
        return false;
      }

      if (options.ignore && link.matches(options.ignore)) {
        return false;
      }

      if (!queryCheck(link.hash.substr(1))) {
        return false;
      }

      var element = document.querySelector(link.hash);

      if (!element) {
        return false;
      }

      link.addEventListener('click', function () {
        forceFocus(element, options);
      });

      return true;
    });
  }

  function focusable(container) {
    var elements = Array.prototype.slice.call(
      container.querySelectorAll('[tabindex],' + '[draggable],' + 'a[href],' + 'area,' + 'button:enabled,' + 'input:not([type=hidden]):enabled,' + 'object,' + 'select:enabled,' + 'textarea:enabled' + '[data-focus-element]')
    );

    // Filter out elements that are not visible.
    // Copied from jQuery https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/css/hiddenVisibleSelectors.js
    return elements.filter(function (element) {
      return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    });
  }

  /**
   * Traps the focus in a particular container
   *
   * @param {Element} container - Container DOM element to trap focus inside of
   * @param {Element} elementToFocus - Element to be focused on first
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   */

  var trapFocusHandlers = {};

  function trapFocus(container, options) {
    options = options || {};
    var elements = focusable(container);
    var elementToFocus = options.elementToFocus || container;
    var first = elements[0];
    var last = elements[elements.length - 1];

    removeTrapFocus();

    trapFocusHandlers.focusin = function (event) {
      if (container !== event.target && !container.contains(event.target) && first && first === event.target) {
        first.focus();
      }

      if (event.target !== container && event.target !== last && event.target !== first) return;
      document.addEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.focusout = function () {
      document.removeEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.keydown = function (event) {
      if (event.keyCode !== 9) return; // If not TAB key

      // On the last focusable element and tab forward, focus the first element.
      if (event.target === last && !event.shiftKey) {
        event.preventDefault();
        first.focus();
      }

      //  On the first focusable element and tab backward, focus the last element.
      if ((event.target === container || event.target === first) && event.shiftKey) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('focusout', trapFocusHandlers.focusout);
    document.addEventListener('focusin', trapFocusHandlers.focusin);

    forceFocus(elementToFocus, options);
  }

  /**
   * Removes the trap of focus from the page
   */
  function removeTrapFocus() {
    document.removeEventListener('focusin', trapFocusHandlers.focusin);
    document.removeEventListener('focusout', trapFocusHandlers.focusout);
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  }

  const selectors$P = {
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  function modal(unique) {
    const uniqueID = `data-popup-${unique}`;
    MicroModal.init({
      openTrigger: uniqueID,
      disableScroll: true,
      onShow: (modal, el, event) => {
        event.preventDefault();
        const firstFocus = modal.querySelector(selectors$P.focusable);
        trapFocus(modal, {elementToFocus: firstFocus});
      },
      onClose: (modal, el, event) => {
        event.preventDefault();
        removeTrapFocus();
        el.focus();
      },
    });
  }

  const selectors$O = {
    trigger: '[data-toggle-password-modal]',
    errors: '.storefront-password-form .errors',
  };

  const sections$m = {};

  class PasswordPage {
    constructor(section) {
      this.container = section.container;

      this.trigger = this.container.querySelector(selectors$O.trigger);
      this.errors = this.container.querySelector(selectors$O.errors);

      this.init();
    }

    init() {
      modal('password');
      if (this.errors) {
        this.trigger.click();
      }
    }
  }

  const passwordSection = {
    onLoad() {
      sections$m[this.id] = new PasswordPage(this);
    },
  };

  register('password', passwordSection);

  /**
   * Gift Card Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Gift Card template.
   */

  (function () {
    var config = {
      qrCode: '#QrCode',
      giftCardCode: '.giftcard__code',
    };

    // init QR code
    const qrCode = document.querySelector(config.qrCode);
    if (qrCode) {
      function loadGiftCard() {
        const qrCodeText = qrCode.getAttribute('data-identifier');
        new QRCode(qrCode, {
          text: qrCodeText,
          width: 120,
          height: 120,
        });
      }
      window.addEventListener('load', loadGiftCard);
    }

    const giftCardCode = document.querySelector(config.giftCardCode);
    if (giftCardCode) {
      // Auto-select gift card code on click, based on ID passed to the function
      function selectText() {
        var text = document.querySelector('#GiftCardDigits');
        var range = '';

        if (document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(text);
          range.select();
        } else if (window.getSelection) {
          var selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents(text);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      giftCardCode.addEventListener('click', selectText());
    }
  })();

  var sections$l = {};

  const parallaxImage = {
    onLoad() {
      sections$l[this.id] = [];
      const frames = this.container.querySelectorAll('[data-parallax-wrapper]');
      frames.forEach((frame) => {
        const inner = frame.querySelector('[data-parallax-img]');
        sections$l[this.id].push(
          new Rellax(inner, {
            center: true,
            round: true,
            frame: frame,
          })
        );
      });
    },
    onUnload: function () {
      sections$l[this.id].forEach((image) => {
        if (typeof image.destroy === 'function') {
          image.destroy();
        }
      });
    },
  };

  register('article', parallaxImage);

  const selectors$N = {
    frame: '[data-ticker-frame]',
    scale: '[data-ticker-scale]',
    text: '[data-ticker-text]',
    clone: 'data-clone',
    animationClass: 'ticker--animated',
    unloadedClass: 'ticker--unloaded',
    comparitorClass: 'ticker__comparitor',
    moveTime: 1.63, // 100px going to move for 1.63s
    space: 100, // 100px
  };

  class Ticker {
    constructor(el, stopClone = false) {
      this.frame = el;
      this.stopClone = stopClone;
      this.scale = this.frame.querySelector(selectors$N.scale);
      this.text = this.frame.querySelector(selectors$N.text);

      this.comparitor = this.text.cloneNode(true);
      this.comparitor.classList.add(selectors$N.comparitorClass);
      this.frame.appendChild(this.comparitor);
      this.scale.classList.remove(selectors$N.unloadedClass);
      this.resizeEvent = debounce(() => this.checkWidth(), 300);
      this.listen();
    }

    unload() {
      document.removeEventListener('theme:resize', this.resizeEvent);
    }

    listen() {
      document.addEventListener('theme:resize', this.resizeEvent);
      this.checkWidth();
    }

    checkWidth() {
      const padding = window.getComputedStyle(this.frame).paddingLeft.replace('px', '') * 2;

      if (this.frame.clientWidth - padding < this.comparitor.clientWidth || this.stopClone) {
        this.text.classList.add(selectors$N.animationClass);
        if (this.scale.childElementCount === 1) {
          this.clone = this.text.cloneNode(true);
          this.clone.setAttribute('aria-hidden', true);
          this.clone.setAttribute(selectors$N.clone, '');
          this.scale.appendChild(this.clone);

          if (this.stopClone) {
            for (let index = 0; index < 10; index++) {
              const cloneSecond = this.text.cloneNode(true);
              cloneSecond.setAttribute('aria-hidden', true);
              cloneSecond.setAttribute(selectors$N.clone, '');
              this.scale.appendChild(cloneSecond);
            }
          }
        }

        const animationTimeFrame = (this.text.clientWidth / selectors$N.space) * selectors$N.moveTime;

        this.scale.style.setProperty('--animation-time', `${animationTimeFrame}s`);
      } else {
        this.text.classList.add(selectors$N.animationClass);
        let clone = this.scale.querySelector(`[${selectors$N.clone}]`);
        if (clone) {
          this.scale.removeChild(clone);
        }
        this.text.classList.remove(selectors$N.animationClass);
      }
    }
  }

  const selectors$M = {
    slide: '[data-slide]',
    speed: 'data-slider-speed',
    slideAttribute: 'data-slide',
    dataSlideIndex: 'data-slide-index',
  };

  class AnnouncementSlider {
    constructor(container, el) {
      this.container = container;
      this.slideshow = el;
      const speedElement = this.slideshow.getAttribute(selectors$M.speed);
      this.speed = speedElement ? parseInt(speedElement) : false;

      if (!this.slideshow) return;

      this.flkty = null;

      this.init();
    }

    init() {
      const sliderOptions = {
        initialIndex: 0,
        autoPlay: this.speed,
        contain: true,
        pageDots: false,
        adaptiveHeight: true,
        wrapAround: true,
        groupCells: false,
        cellAlign: 'left',
        freeScroll: false,
        prevNextButtons: true,
        draggable: true,
        rightToLeft: window.isRTL,
        on: {
          ready: () => {
            setTimeout(() => {
              this.slideshow.dispatchEvent(
                new CustomEvent('theme:announcement:loaded', {
                  bubbles: true,
                  detail: {
                    slider: this,
                  },
                })
              );
            }, 50);
          },
        },
      };

      this.flkty = new Flickity(this.slideshow, sliderOptions);

      document.addEventListener('theme:resize', () => {
        this.flkty.resize();
      });
    }

    onUnload() {
      if (this.slideshow && this.flkty) {
        this.flkty.options.watchCSS = false;
        this.flkty.destroy();
      }
    }

    onBlockSelect(evt) {
      if (!this.slideshow) return;
      // Ignore the cloned version
      const slide = this.slideshow.querySelector(`[${selectors$M.slideAttribute}="${evt.detail.blockId}"]`);

      if (!slide) return;
      const slideIndex = parseInt(slide.getAttribute(selectors$M.dataSlideIndex));

      // Go to selected slide, pause autoplay
      this.flkty.selectCell(slideIndex);
      this.flkty.stopPlayer();
    }

    onBlockDeselect() {
      this.flkty.playPlayer();
    }
  }

  const selectors$L = {
    cartMessage: '[data-cart-message]',
    cartMessageValue: 'data-cart-message',
    leftToSpend: '[data-left-to-spend]',
    cartProgress: '[data-cart-progress]',
  };

  const classes$p = {
    isHidden: 'is-hidden',
    isSuccess: 'is-success',
  };

  class CartShippingMessage {
    constructor(section) {
      this.container = section;
      this.cartMessage = this.container.querySelectorAll(selectors$L.cartMessage);
      if (this.cartMessage.length > 0) {
        this.init();
      }
    }

    init() {
      this.cartFreeLimitShipping = Number(this.cartMessage[0].getAttribute('data-limit')) * 100;
      this.shippingAmount = 0;
      this.circumference = 28 * Math.PI; // radius - stroke * 4 * PI

      this.cartBarProgress();
      this.listen();
    }

    listen() {
      document.addEventListener(
        'theme:cart:change',
        function (event) {
          this.cart = event.detail.cart;
          this.render();
        }.bind(this)
      );
    }

    render() {
      if (this.cart && this.cart.total_price) {
        const totalPrice = this.cart.total_price;
        this.freeShippingMessageHandle(totalPrice);

        // Build cart again if the quantity of the changed product is 0 or cart discounts are changed
        if (this.cartMessage.length > 0) {
          this.shippingAmount = totalPrice;
          this.updateProgress();
        }
      }
    }

    freeShippingMessageHandle(total) {
      if (this.cartMessage.length > 0) {
        this.container.querySelectorAll(selectors$L.cartMessage).forEach((message) => {
          const hasFreeShipping = message.hasAttribute(selectors$L.cartMessageValue) && message.getAttribute(selectors$L.cartMessageValue) === 'true' && total !== 0;
          const cartMessageClass = hasFreeShipping ? classes$p.isSuccess : classes$p.isHidden;

          message.classList.toggle(cartMessageClass, total >= this.cartFreeLimitShipping);
        });
      }
    }

    cartBarProgress(progress = null) {
      this.container.querySelectorAll(selectors$L.cartProgress).forEach((element) => {
        this.setProgress(element, progress === null ? element.getAttribute('data-percent') : progress);
      });
    }

    setProgress(holder, percent) {
      const offset = this.circumference - ((percent / 100) * this.circumference) / 2;

      holder.style.strokeDashoffset = offset;
    }

    updateProgress() {
      const newPercentValue = (this.shippingAmount / this.cartFreeLimitShipping) * 100;
      const leftToSpend = themeCurrency.formatMoney(this.cartFreeLimitShipping - this.shippingAmount, theme.moneyFormat);

      this.container.querySelectorAll(selectors$L.leftToSpend).forEach((element) => {
        element.innerHTML = leftToSpend.replace('.00', '');
      });

      this.cartBarProgress(newPercentValue > 100 ? 100 : newPercentValue);
    }
  }

  const selectors$K = {
    bar: '[data-bar]',
    barSlide: '[data-slide]',
    frame: '[data-ticker-frame]',
    header: '[data-header-wrapper]',
    slider: '[data-announcement-slider]',
    slideValue: 'data-slide',
    tickerScale: '[data-ticker-scale]',
    tickerText: '[data-ticker-text]',
    dataTargetReferrer: 'data-target-referrer',
    slideAttribute: 'data-slide',
  };

  const classes$o = {
    mobileClass: 'mobile',
    desktopClass: 'desktop',
  };

  const sections$k = {};

  class Bar {
    constructor(section) {
      this.container = section.container;
      this.barHolder = this.container.querySelector(selectors$K.bar);
      this.locationPath = location.href;

      this.slides = this.barHolder.querySelectorAll(selectors$K.barSlide);
      this.slider = this.barHolder.querySelector(selectors$K.slider);
      this.hasDeviceClass = '';

      new CartShippingMessage(this.container);

      this.init();
    }

    init() {
      this.removeAnnouncement();

      if (!this.slider) {
        this.initTickers(true);
      } else if (this.slider && this.slides && this.slides.length > 1) {
        this.initSliders();
      } else {
        this.initTickers();
      }
    }

    /**
     * Delete announcement which has a target referrer attribute and it is not contained in page URL
     */
    removeAnnouncement() {
      for (let index = 0; index < this.slides.length; index++) {
        const element = this.slides[index];

        if (!element.hasAttribute(selectors$K.dataTargetReferrer)) {
          continue;
        }

        if (this.locationPath.indexOf(element.getAttribute(selectors$K.dataTargetReferrer)) === -1 && !window.Shopify.designMode) {
          element.parentNode.removeChild(element);
        }
      }
    }

    /**
     * Init slider
     */
    initSliders() {
      this.slider = new AnnouncementSlider(this.container, this.slider);
      this.slider.flkty.reposition();

      this.barHolder.addEventListener('theme:announcement:loaded', () => {
        this.initTickers();
      });
    }

    /**
     * Init tickers in sliders
     */
    initTickers(stopClone = false) {
      const frame = this.barHolder.querySelector(selectors$K.frame);

      if (frame) {
        new Ticker(frame, stopClone);
      }
    }

    toggleTicker(e, isStoped) {
      const tickerScale = document.querySelector(selectors$K.tickerScale);
      const element = document.querySelector(`[${selectors$K.slideValue}="${e.detail.blockId}"]`);

      if (isStoped && element) {
        tickerScale.setAttribute('data-stop', '');
        tickerScale.querySelectorAll(selectors$K.tickerText).forEach((textHolder) => {
          textHolder.classList.remove('ticker--animated');
          textHolder.style.transform = `translate3d(${-(element.offsetLeft - element.clientWidth)}px, 0, 0)`;
        });
      }

      if (!isStoped && element) {
        tickerScale.querySelectorAll(selectors$K.tickerText).forEach((textHolder) => {
          textHolder.classList.add('ticker--animated');
          textHolder.removeAttribute('style');
        });
        tickerScale.removeAttribute('data-stop');
      }
    }

    onBlockSelect(e) {
      if (this.slider && typeof this.slider.onBlockSelect === 'function') {
        this.slider.onBlockSelect(e);
      } else {
        const slides = document.querySelectorAll(`[${selectors$K.slideAttribute}="${e.detail.blockId}"]`);

        slides.forEach((slide) => {
          if (slide.classList.contains(classes$o.mobileClass)) {
            this.hasDeviceClass = classes$o.mobileClass;
          }

          if (slide.classList.contains(classes$o.desktopClass)) {
            this.hasDeviceClass = classes$o.desktopClass;
          }

          if (this.hasDeviceClass !== '') {
            slide.classList.remove(this.hasDeviceClass);
          }
        });

        this.toggleTicker(e, true);
      }
    }

    onBlockDeselect(e) {
      if (this.slider && typeof this.slider.onBlockDeselect === 'function') {
        this.slider.onBlockDeselect(e);
      } else {
        if (this.hasDeviceClass !== '') {
          const slides = document.querySelectorAll(`[${selectors$K.slideAttribute}="${e.detail.blockId}"]`);

          slides.forEach((slide) => {
            slide.classList.add(this.hasDeviceClass);
          });
        }

        this.toggleTicker(e, false);
      }
    }
  }

  const bar = {
    onLoad() {
      sections$k[this.id] = [];
      sections$k[this.id].push(new Bar(this));
    },
    onBlockSelect(e) {
      sections$k[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(e);
        }
      });
    },
    onBlockDeselect(e) {
      sections$k[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockDeselect(e);
        }
      });
    },
  };

  register('announcement', [bar]);

  register('blog', parallaxImage);

  var selectors$J = {
    drawerWrappper: '[data-drawer]',
    drawerScrolls: '[data-drawer-scrolls]',
    underlay: '[data-drawer-underlay]',
    stagger: '[data-stagger-animation]',
    drawerToggle: 'data-drawer-toggle',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  var classes$n = {
    isVisible: 'drawer--visible',
    displayNone: 'display-none',
  };

  var sections$j = {};

  class Drawer {
    constructor(el) {
      this.drawer = el;
      this.drawerScrolls = this.drawer.querySelector(selectors$J.drawerScrolls);
      this.underlay = this.drawer.querySelector(selectors$J.underlay);
      this.key = this.drawer.dataset.drawer;
      const btnSelector = `[${selectors$J.drawerToggle}='${this.key}']`;
      this.buttons = document.querySelectorAll(btnSelector);
      this.staggers = this.drawer.querySelectorAll(selectors$J.stagger);

      this.connectToggle();
      this.connectDrawer();
      this.closers();
      this.staggerChildAnimations();
    }

    unload() {
      // wipe listeners
    }

    connectToggle() {
      this.buttons.forEach((btn) => {
        btn.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:toggle', {
                bubbles: false,
              })
            );
          }.bind(this)
        );
      });
    }

    connectDrawer() {
      this.drawer.addEventListener(
        'theme:drawer:toggle',
        function () {
          if (this.drawer.classList.contains(classes$n.isVisible)) {
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:close', {
                bubbles: false,
              })
            );
          } else {
            this.drawer.dispatchEvent(
              new CustomEvent('theme:drawer:open', {
                bubbles: false,
              })
            );
          }
        }.bind(this)
      );
      this.drawer.addEventListener('theme:drawer:close', this.hideDrawer.bind(this));
      this.drawer.addEventListener('theme:drawer:open', this.showDrawer.bind(this));
    }

    staggerChildAnimations() {
      this.staggers.forEach((el) => {
        const children = el.querySelectorAll(':scope > * > [data-animates]');
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 50 + 10}ms`;
        });
      });
    }

    closers() {
      this.drawer.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideDrawer();
          this.buttons[0].focus();
        }.bind(this)
      );

      this.underlay.addEventListener(
        'click',
        function () {
          this.hideDrawer();
        }.bind(this)
      );
    }

    showDrawer() {
      this.drawer.classList.remove(classes$n.displayNone);
      // animates after display none is removed
      setTimeout(() => {
        this.buttons.forEach((el) => el.setAttribute('aria-expanded', true));
        this.drawer.classList.add(classes$n.isVisible);
        this.drawerScrolls.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
        const firstFocus = this.drawer.querySelector(selectors$J.focusable);
        trapFocus(this.drawer, {elementToFocus: firstFocus});
      }, 1);
    }

    hideDrawer() {
      this.buttons.forEach((el) => el.setAttribute('aria-expanded', true));
      this.drawer.classList.remove(classes$n.isVisible);
      this.drawerScrolls.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));

      document.dispatchEvent(new CustomEvent('theme:sliderule:close', {bubbles: false}));
      removeTrapFocus();

      // adds display none after animations
      setTimeout(() => {
        if (!this.drawer.classList.contains(classes$n.isVisible)) {
          this.drawer.classList.add(classes$n.displayNone);
        }
      }, 800);
    }
  }

  const drawer = {
    onLoad() {
      sections$j[this.id] = [];
      const els = this.container.querySelectorAll(selectors$J.drawerWrappper);
      els.forEach((el) => {
        sections$j[this.id].push(new Drawer(el));
      });
    },
    onUnload: function () {
      sections$j[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$I = {
    announcement: '#shopify-section-announcement',
    transparent: 'data-header-transparent',
    header: '[data-header-wrapper] header',
  };

  const classes$m = {
    stuck: 'js__header__stuck',
    stuckAnimated: 'js__header__stuck--animated',
    triggerAnimation: 'js__header__stuck--trigger-animation',
    stuckBackdrop: 'js__header__stuck__backdrop',
  };

  let sections$i = {};

  class Sticky {
    constructor(el) {
      this.wrapper = el;
      this.type = this.wrapper.dataset.headerSticky;
      this.transparent = this.wrapper.dataset.headerTransparent;
      this.sticks = this.type === 'sticky';
      this.animated = this.type === 'directional';
      this.currentlyStuck = false;
      this.cls = this.wrapper.classList;
      const announcementEl = document.querySelector(selectors$I.announcement);
      const announcementHeight = announcementEl ? announcementEl.clientHeight : 0;
      const headerHeight = document.querySelector(selectors$I.header).clientHeight;
      this.blur = headerHeight + announcementHeight;
      this.stickDown = headerHeight + announcementHeight;
      this.stickUp = announcementHeight;
      if (this.wrapper.getAttribute(selectors$I.transparent) !== 'false') {
        this.blur = announcementHeight;
      }
      if (this.sticks) {
        this.stickDown = announcementHeight;
        this.scrollDownInit();
      }
      this.listen();
    }

    unload() {
      document.removeEventListener('theme:scroll', this.listen);
      document.removeEventListener('theme:scroll:up', this.scrollUpDirectional);
      document.removeEventListener('theme:scroll:down', this.scrollDownDirectional);
    }

    listen() {
      if (this.sticks || this.animated) {
        document.addEventListener('theme:scroll', (e) => {
          if (e.detail.down) {
            if (!this.currentlyStuck && e.detail.position > this.stickDown) {
              this.stickSimple();
            }
            if (!this.currentlyBlurred && e.detail.position > this.blur) {
              this.addBlur();
            }
          } else {
            if (e.detail.position <= this.stickUp) {
              this.unstickSimple();
            }
            if (e.detail.position <= this.blur) {
              this.removeBlur();
            }
          }
        });
      }
      if (this.animated) {
        document.addEventListener('theme:scroll:up', this.scrollUpDirectional.bind(this));
        document.addEventListener('theme:scroll:down', this.scrollDownDirectional.bind(this));
      }
    }

    stickSimple() {
      if (this.animated) {
        this.cls.add(classes$m.stuckAnimated);
      }
      this.cls.add(classes$m.stuck);
      this.wrapper.setAttribute(selectors$I.transparent, false);
      this.currentlyStuck = true;
    }

    unstickSimple() {
      this.cls.remove(classes$m.stuck);
      this.wrapper.setAttribute(selectors$I.transparent, this.transparent);
      if (this.animated) {
        this.cls.remove(classes$m.stuckAnimated);
      }
      this.currentlyStuck = false;
    }

    scrollDownInit() {
      if (window.scrollY > this.stickDown) {
        this.stickSimple();
      }
      if (window.scrollY > this.blur) {
        this.addBlur();
      }
    }

    stickDirectional() {
      this.cls.add(classes$m.triggerAnimation);
    }

    unstickDirectional() {
      this.cls.remove(classes$m.triggerAnimation);
    }

    scrollDownDirectional() {
      this.unstickDirectional();
    }

    scrollUpDirectional() {
      if (window.scrollY <= this.stickDown) {
        this.unstickDirectional();
      } else {
        this.stickDirectional();
      }
    }

    addBlur() {
      this.cls.add(classes$m.stuckBackdrop);
      this.currentlyBlurred = true;
    }

    removeBlur() {
      this.cls.remove(classes$m.stuckBackdrop);
      this.currentlyBlurred = false;
    }
  }

  const stickyHeader = {
    onLoad() {
      sections$i = new Sticky(this.container);
    },
    onUnload: function () {
      if (typeof sections$i.unload === 'function') {
        sections$i.unload();
      }
    },
  };

  const selectors$H = {
    disclosureToggle: 'data-hover-disclosure-toggle',
    disclosureWrappper: '[data-hover-disclosure]',
    link: '[data-top-link]',
    wrapper: '[data-header-wrapper]',
    stagger: '[data-stagger]',
    staggerPair: '[data-stagger-first]',
    staggerAfter: '[data-stagger-second]',
    staggerImage: '[data-grid-item], [data-header-image]',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  const classes$l = {
    isVisible: 'is-visible',
    meganavVisible: 'meganav--visible',
  };

  let sections$h = {};
  let disclosures = {};

  class HoverDisclosure {
    constructor(el) {
      this.disclosure = el;
      this.wrapper = el.closest(selectors$H.wrapper);
      this.key = this.disclosure.id;
      const btnSelector = `[${selectors$H.disclosureToggle}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.link = this.trigger.querySelector(selectors$H.link);
      this.grandparent = this.trigger.classList.contains('grandparent');

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.connectHoverToggle();
      this.handleTablets();
      this.staggerChildAnimations();
    }

    onBlockSelect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.showDisclosure();
      }
    }

    onBlockDeselect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.hideDisclosure();
      }
    }

    showDisclosure() {
      if (this.grandparent) {
        this.wrapper.classList.add(classes$l.meganavVisible);
      } else {
        this.wrapper.classList.remove(classes$l.meganavVisible);
      }
      this.trigger.setAttribute('aria-expanded', true);
      this.trigger.classList.add(classes$l.isVisible);
      this.disclosure.classList.add(classes$l.isVisible);
    }

    hideDisclosure() {
      this.disclosure.classList.remove(classes$l.isVisible);
      this.trigger.classList.remove(classes$l.isVisible);
      this.trigger.setAttribute('aria-expanded', false);
      this.wrapper.classList.remove(classes$l.meganavVisible);
    }

    staggerChildAnimations() {
      const simple = this.disclosure.querySelectorAll(selectors$H.stagger);
      simple.forEach((el, index) => {
        el.style.transitionDelay = `${index * 50 + 10}ms`;
      });

      const pairs = this.disclosure.querySelectorAll(selectors$H.staggerPair);
      pairs.forEach((child, i) => {
        const d1 = i * 150;
        child.style.transitionDelay = `${d1}ms`;
        child.parentElement.querySelectorAll(selectors$H.staggerAfter).forEach((grandchild, i2) => {
          const di1 = i2 + 1;
          const d2 = di1 * 20;
          grandchild.style.transitionDelay = `${d1 + d2}ms`;
        });
      });

      const images = this.disclosure.querySelectorAll(selectors$H.staggerImage);
      images.forEach((el, index) => {
        el.style.transitionDelay = `${(index + 1) * 80}ms`;
      });
    }

    handleTablets() {
      // first click opens the popup, second click opens the link
      this.trigger.addEventListener(
        'touchstart',
        function (e) {
          const isOpen = this.disclosure.classList.contains(classes$l.isVisible);
          if (!isOpen) {
            e.preventDefault();
            this.showDisclosure();
          }
        }.bind(this),
        {passive: true}
      );
    }

    connectHoverToggle() {
      this.trigger.addEventListener('mouseenter', this.showDisclosure.bind(this));
      this.link.addEventListener('focus', this.showDisclosure.bind(this));

      this.trigger.addEventListener('mouseleave', this.hideDisclosure.bind(this));
      this.trigger.addEventListener(
        'focusout',
        function (e) {
          const inMenu = this.trigger.contains(e.relatedTarget);
          if (!inMenu) {
            this.hideDisclosure();
          }
        }.bind(this)
      );
      this.disclosure.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideDisclosure();
        }.bind(this)
      );
    }
  }

  const hoverDisclosure = {
    onLoad() {
      sections$h[this.id] = [];
      disclosures = this.container.querySelectorAll(selectors$H.disclosureWrappper);
      disclosures.forEach((el) => {
        sections$h[this.id].push(new HoverDisclosure(el));
      });
    },
    onBlockSelect(evt) {
      sections$h[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$h[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
    onUnload: function () {
      sections$h[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$G = {
    item: '[data-main-menu-text-item]',
    wrapper: '[data-text-items-wrapper]',
    text: '.navtext',
    isActive: 'data-menu-active',
    sectionOuter: '[data-header-wrapper]',
    underlineCurrent: 'data-underline-current',
    defaultItem: '.menu__item.main-menu--active .navtext, .header__desktop__button.main-menu--active .navtext',
  };

  let sections$g = {};
  let defaultPositions = null;

  class HoverLine {
    constructor(el) {
      this.wrapper = el;
      this.itemList = this.wrapper.querySelectorAll(selectors$G.item);
      this.sectionOuter = document.querySelector(selectors$G.sectionOuter);
      this.underlineCurrent = this.sectionOuter.getAttribute(selectors$G.underlineCurrent) === 'true';
      this.defaultItem = null;
      if (this.underlineCurrent) {
        this.defaultItem = this.wrapper.querySelector(selectors$G.defaultItem);
      }
      this.setDefault();
      document.fonts.ready.then(() => {
        this.init();
      });
    }

    init() {
      if (this.itemList.length) {
        this.listen();
        this.listenResize();

        this.textBottom = null;
        this.setHeight();

        if (defaultPositions) {
          if (this.defaultItem) {
            const startingLeft = this.defaultItem.offsetLeft || 0;
            this.sectionOuter.style.setProperty('--bar-left', `${startingLeft}px`);
          }

          this.reset();
        } else {
          // initialize at left edge of first item im menu
          const startingLeft = this.sectionOuter.querySelector(selectors$G.item).offsetLeft;
          this.sectionOuter.style.setProperty('--bar-left', `${startingLeft}px`);
          this.sectionOuter.style.setProperty('--bar-width', '0px');
        }
        this.sectionOuter.style.setProperty('--bar-opacity', '1');
      }
    }

    unload() {
      document.removeEventListener('theme:resize', this.reset);
      defaultPositions = null;
    }

    listenResize() {
      document.addEventListener('theme:resize', this.reset.bind(this));
    }

    setDefault() {
      if (this.defaultItem) {
        defaultPositions = {
          left: this.defaultItem.offsetLeft || null,
          width: this.defaultItem.clientWidth || null,
        };
      }
    }

    setHeight() {
      const height = this.wrapper.clientHeight;
      const text = this.itemList[0].querySelector(selectors$G.text);
      const textHeight = text.clientHeight;
      const textBottom = Math.floor(height / 2 - textHeight / 2) - 4;
      if (this.textBottom !== textBottom) {
        this.sectionOuter.style.setProperty('--bar-text', `${textHeight}px`);
        this.sectionOuter.style.setProperty('--bar-bottom', `${textBottom}px`);
        this.textBottom = textBottom;
      }
    }

    listen() {
      this.itemList.forEach((element) => {
        element.addEventListener('mouseenter', (evt) => {
          const item = evt.target.querySelector(selectors$G.text);
          this.startBar(item);
        });
      });
      this.wrapper.addEventListener('mouseleave', this.clearBar.bind(this));
    }

    startBar(item) {
      this.setHeight();
      let active = this.sectionOuter.getAttribute(selectors$G.isActive) !== 'false';
      let left = item.offsetLeft;
      let width = item.clientWidth;
      if (active) {
        this.render(width, left);
      } else {
        this.sectionOuter.setAttribute(selectors$G.isActive, true);
        this.render(0, left);
        setTimeout(() => {
          this.render(width, left);
        }, 10);
      }
    }

    render(width, left) {
      this.sectionOuter.style.setProperty('--bar-left', `${left}px`);
      this.sectionOuter.style.setProperty('--bar-width', `${width}px`);
    }

    reset() {
      this.setDefault();
      if (defaultPositions && defaultPositions.left && defaultPositions.width) {
        this.sectionOuter.style.setProperty('--bar-left', `${defaultPositions.left}px`);
        this.sectionOuter.style.setProperty('--bar-width', `${defaultPositions.width}px`);
      } else {
        this.sectionOuter.style.setProperty('--bar-width', '0px');
      }
    }

    clearBar() {
      // allow the bar to jump between text sections for cart and main menu
      this.sectionOuter.setAttribute(selectors$G.isActive, false);
      setTimeout(() => {
        let active = this.sectionOuter.getAttribute(selectors$G.isActive) !== 'false';
        if (!active) {
          this.reset();
        }
      }, 150);
    }
  }

  const hoverUnderline = {
    onLoad() {
      sections$g[this.id] = [];
      const els = this.container.querySelectorAll(selectors$G.wrapper);
      els.forEach((el) => {
        sections$g[this.id].push(new HoverLine(el));
      });
    },
    onUnload: function () {
      sections$g[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
      delete sections$g[this.id];
    },
  };

  const selectors$F = {
    price: 'data-header-cart-price',
    count: 'data-header-cart-count',
    dot: 'data-header-cart-full',
  };

  class Totals {
    constructor(el) {
      this.section = el;
      this.counts = this.section.querySelectorAll(`[${selectors$F.count}]`);
      this.prices = this.section.querySelectorAll(`[${selectors$F.price}]`);
      this.dots = this.section.querySelectorAll(`[${selectors$F.dot}]`);
      this.cart = null;
      this.listen();
    }

    listen() {
      document.addEventListener(
        'theme:cart:change',
        function (event) {
          this.cart = event.detail.cart;
          this.update();
        }.bind(this)
      );
    }

    update() {
      if (this.cart) {
        this.prices.forEach((price) => {
          price.setAttribute(selectors$F.price, this.cart.total_price);
          const newTotal = themeCurrency.formatMoney(this.cart.total_price, theme.moneyFormat);
          price.innerHTML = newTotal;
        });
        this.counts.forEach((count) => {
          count.setAttribute(selectors$F.count, this.cart.item_count);
          count.innerHTML = `(${this.cart.item_count})`;
        });
        this.dots.forEach((dot) => {
          const full = this.cart.item_count > 0;
          dot.setAttribute(selectors$F.dot, full);
        });
      }
    }
  }
  const headerTotals = {
    onLoad() {
      new Totals(this.container);
    },
  };

  const selectors$E = {
    wrapper: '[data-search-popdown-wrap]',
    popdownTrigger: 'data-popdown-toggle',
    close: '[data-close-popdown]',
    input: '[data-predictive-search-input]',
    underlay: '[data-search-underlay]',
  };

  const classes$k = {
    underlayVisible: 'underlay--visible',
    isVisible: 'is-visible',
  };

  let sections$f = {};

  class SearchPopdownTriggers {
    constructor(trigger) {
      this.trigger = trigger;
      this.key = this.trigger.getAttribute(selectors$E.popdownTrigger);

      const popdownSelector = `[id='${this.key}']`;
      this.popdown = document.querySelector(popdownSelector);
      this.input = this.popdown.querySelector(selectors$E.input);
      this.close = this.popdown.querySelector(selectors$E.close);
      this.wrapper = this.popdown.closest(selectors$E.wrapper);
      this.underlay = this.wrapper.querySelector(selectors$E.underlay);

      this.initTriggerEvents();
      this.initPopdownEvents();
    }

    initTriggerEvents() {
      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);
      this.trigger.addEventListener(
        'click',
        function (evt) {
          evt.preventDefault();
          this.showPopdown();
        }.bind(this)
      );
      this.trigger.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.SPACE) {
            return;
          }
          this.showPopdown();
        }.bind(this)
      );
    }

    initPopdownEvents() {
      this.popdown.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hidePopdown();
        }.bind(this)
      );
      this.close.addEventListener(
        'click',
        function () {
          this.hidePopdown();
        }.bind(this)
      );
      this.underlay.addEventListener(
        'click',
        function () {
          this.hidePopdown();
        }.bind(this)
      );
    }

    hidePopdown() {
      this.popdown.classList.remove(classes$k.isVisible);
      this.underlay.classList.remove(classes$k.underlayVisible);
      this.trigger.focus();
      this.input.value = '';
      removeTrapFocus();
      this.input.dispatchEvent(new CustomEvent('clear', {bubbles: false}));
      this.popdown.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }

    showPopdown() {
      this.input.value = '';
      this.popdown.classList.add(classes$k.isVisible);
      this.underlay.classList.add(classes$k.underlayVisible);
      trapFocus(this.popdown, {elementToFocus: this.input});
      this.popdown.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
    }
  }

  const searchPopdown = {
    onLoad() {
      sections$f[this.id] = {};
      const trigger = this.container.querySelector(`[${selectors$E.popdownTrigger}]`);
      if (trigger) {
        sections$f[this.id] = new SearchPopdownTriggers(trigger);
      }
    },
    onUnload: function () {
      if (typeof sections$f[this.id].unload === 'function') {
        sections$f[this.id].unload();
      }
    },
  };

  /**
   * Image Helper Functions
   * -----------------------------------------------------------------------------
   * https://github.com/Shopify/slate.git.
   *
   */

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (typeof src === 'undefined' || src === null) {
      src = window.theme.assets.noImage;
    }

    if (size === 'master') {
      return removeProtocol(src);
    }

    const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      const prefix = src.split(match[0]);
      const suffix = match[0];

      return removeProtocol(`${prefix[0]}_${size}${suffix}`);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  function Listeners() {
    this.entries = [];
  }

  Listeners.prototype.add = function (element, event, fn) {
    this.entries.push({element: element, event: event, fn: fn});
    element.addEventListener(event, fn);
  };

  Listeners.prototype.removeAll = function () {
    this.entries = this.entries.filter(function (listener) {
      listener.element.removeEventListener(listener.event, listener.fn);
      return false;
    });
  };

  /**
   * Find a match in the project JSON (using a ID number) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Number} value Accepts Number (e.g. 6908023078973)
   * @returns {Object} The variant object once a match has been successful. Otherwise null will be return
   */

  /**
   * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromSerializedArray(product, collection) {
    _validateProductStructure(product);

    // If value is an array of options
    var optionArray = _createOptionArrayFromOptionCollection(product, collection);
    return getVariantFromOptionArray(product, optionArray);
  }

  /**
   * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromOptionArray(product, options) {
    _validateProductStructure(product);
    _validateOptionsArray(options);

    var result = product.variants.filter(function (variant) {
      return options.every(function (option, index) {
        return variant.options[index] === option;
      });
    });

    return result[0] || null;
  }

  /**
   * Creates an array of selected options from the object
   * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
   * @param {Object} product Product JSON object
   * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
   */
  function _createOptionArrayFromOptionCollection(product, collection) {
    _validateProductStructure(product);
    _validateSerializedArray(collection);

    var optionArray = [];

    collection.forEach(function (option) {
      for (var i = 0; i < product.options.length; i++) {
        var name = product.options[i].name || product.options[i];
        if (name.toLowerCase() === option.name.toLowerCase()) {
          optionArray[i] = option.value;
          break;
        }
      }
    });

    return optionArray;
  }

  /**
   * Check if the product data is a valid JS object
   * Error will be thrown if type is invalid
   * @param {object} product Product JSON object
   */
  function _validateProductStructure(product) {
    if (typeof product !== 'object') {
      throw new TypeError(product + ' is not an object.');
    }

    if (Object.keys(product).length === 0 && product.constructor === Object) {
      throw new Error(product + ' is empty.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted like jQuery's serializeArray()
   * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
   */
  function _validateSerializedArray(collection) {
    if (!Array.isArray(collection)) {
      throw new TypeError(collection + ' is not an array.');
    }

    if (collection.length === 0) {
      throw new Error(collection + ' is empty.');
    }

    if (collection[0].hasOwnProperty('name')) {
      if (typeof collection[0].name !== 'string') {
        throw new TypeError('Invalid value type passed for name of option ' + collection[0].name + '. Value should be string.');
      }
    } else {
      throw new Error(collection[0] + 'does not contain name key.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted as list of values
   * @param {Array} collection Array of object (e.g. ['36', 'Black'])
   */
  function _validateOptionsArray(options) {
    if (Array.isArray(options) && typeof options[0] === 'object') {
      throw new Error(options + 'is not a valid array of options.');
    }
  }

  var selectors$D = {
    idInput: '[name="id"]',
    planInput: '[name="selling_plan"]',
    optionInput: '[name^="options"]',
    quantityInput: '[name="quantity"]',
    propertyInput: '[name^="properties"]',
  };

  // Public Methods
  // -----------------------------------------------------------------------------

  /**
   * Returns a URL with a variant ID query parameter. Useful for updating window.history
   * with a new URL based on the currently select product variant.
   * @param {string} url - The URL you wish to append the variant ID to
   * @param {number} id  - The variant ID you wish to append to the URL
   * @returns {string} - The new url which includes the variant ID query parameter
   */

  function getUrlWithVariant(url, id) {
    if (/variant=/.test(url)) {
      return url.replace(/(variant=)[^&]+/, '$1' + id);
    } else if (/\?/.test(url)) {
      return url.concat('&variant=').concat(id);
    }

    return url.concat('?variant=').concat(id);
  }

  /**
   * Constructor class that creates a new instance of a product form controller.
   *
   * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
   * @param {Object} product - A product object
   * @param {Object} options - Optional options object
   * @param {Function} options.onOptionChange - Callback for whenever an option input changes
   * @param {Function} options.onPlanChange - Callback for changes to name=selling_plan
   * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
   * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
   * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
   */
  class ProductFormReader {
    constructor(element, product, options) {
      this.element = element;
      this.form = this.element.tagName == 'FORM' ? this.element : this.element.querySelector('form');
      this.product = this._validateProductObject(product);
      this.variantElement = this.element.querySelector(selectors$D.idInput);

      options = options || {};
      this.clickedElement = null;

      this._listeners = new Listeners();
      this._listeners.add(this.element, 'submit', this._onSubmit.bind(this, options));

      this.optionInputs = this._initInputs(selectors$D.optionInput, options.onOptionChange);

      this.planInputs = this._initInputs(selectors$D.planInput, options.onPlanChange);

      this.quantityInputs = this._initInputs(selectors$D.quantityInput, options.onQuantityChange);

      this.propertyInputs = this._initInputs(selectors$D.propertyInput, options.onPropertyChange);
    }

    /**
     * Cleans up all event handlers that were assigned when the Product Form was constructed.
     * Useful for use when a section needs to be reloaded in the theme editor.
     */
    destroy() {
      this._listeners.removeAll();
    }

    /**
     * Getter method which returns the array of currently selected option values
     *
     * @returns {Array} An array of option values
     */
    options() {
      return this._serializeInputValues(this.optionInputs, function (item) {
        var regex = /(?:^(options\[))(.*?)(?:\])/;
        item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'
        return item;
      });
    }

    /**
     * Getter method which returns the currently selected variant, or `null` if variant
     * doesn't exist.
     *
     * @returns {Object|null} Variant object
     */
    variant() {
      const opts = this.options();
      if (opts.length) {
        return getVariantFromSerializedArray(this.product, opts);
      } else {
        return this.product.variants[0];
      }
    }

    /**
     * Getter method which returns the current selling plan, or `null` if plan
     * doesn't exist.
     *
     * @returns {Object|null} Variant object
     */
    plan(variant) {
      let plan = {
        allocation: null,
        group: null,
        detail: null,
      };
      const formData = new FormData(this.form);
      const id = formData.get('selling_plan');

      if (id && variant) {
        plan.allocation = variant.selling_plan_allocations.find(function (item) {
          return item.selling_plan_id.toString() === id.toString();
        });
      }
      if (plan.allocation) {
        plan.group = this.product.selling_plan_groups.find(function (item) {
          return item.id.toString() === plan.allocation.selling_plan_group_id.toString();
        });
      }
      if (plan.group) {
        plan.detail = plan.group.selling_plans.find(function (item) {
          return item.id.toString() === id.toString();
        });
      }

      if (plan && plan.allocation && plan.detail && plan.allocation) {
        return plan;
      } else return null;
    }

    /**
     * Getter method which returns a collection of objects containing name and values
     * of property inputs
     *
     * @returns {Array} Collection of objects with name and value keys
     */
    properties() {
      return this._serializeInputValues(this.propertyInputs, function (item) {
        var regex = /(?:^(properties\[))(.*?)(?:\])/;
        item.name = regex.exec(item.name)[2]; // Use just the value between 'properties[' and ']'
        return item;
      });
    }

    /**
     * Getter method which returns the current quantity or 1 if no quantity input is
     * included in the form
     *
     * @returns {Array} Collection of objects with name and value keys
     */
    quantity() {
      return this.quantityInputs[0] ? Number.parseInt(this.quantityInputs[0].value, 10) : 1;
    }

    getFormState() {
      const variant = this.variant();
      return {
        options: this.options(),
        variant: variant,
        properties: this.properties(),
        quantity: this.quantity(),
        plan: this.plan(variant),
      };
    }

    // Private Methods
    // -----------------------------------------------------------------------------
    _setIdInputValue(variant) {
      if (variant && variant.id) {
        this.variantElement.value = variant.id.toString();
      } else {
        this.variantElement.value = '';
      }
      this.variantElement.dispatchEvent(new Event('change'));
    }

    _onSubmit(options, event) {
      event.dataset = this.getFormState();
      if (options.onFormSubmit) {
        options.onFormSubmit(event);
      }
    }

    _onOptionChange(event) {
      this._setIdInputValue(event.dataset.variant);
    }

    _onFormEvent(cb) {
      if (typeof cb === 'undefined') {
        return Function.prototype;
      }

      return function (event) {
        event.dataset = this.getFormState();
        this._setIdInputValue(event.dataset.variant);
        cb(event);
      }.bind(this);
    }

    _initInputs(selector, cb) {
      var elements = Array.prototype.slice.call(this.element.querySelectorAll(selector));

      return elements.map(
        function (element) {
          this._listeners.add(element, 'change', this._onFormEvent(cb));
          return element;
        }.bind(this)
      );
    }

    _serializeInputValues(inputs, transform) {
      return inputs.reduce(function (options, input) {
        if (
          input.checked || // If input is a checked (means type radio or checkbox)
          (input.type !== 'radio' && input.type !== 'checkbox') // Or if its any other type of input
        ) {
          options.push(transform({name: input.name, value: input.value}));
        }

        return options;
      }, []);
    }

    _validateProductObject(product) {
      if (typeof product !== 'object') {
        throw new TypeError(product + ' is not an object.');
      }

      if (typeof product.variants[0].options === 'undefined') {
        throw new TypeError('Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route');
      }
      return product;
    }
  }

  function getProductJson(handle) {
    const requestRoute = `${window.theme.routes.root_url}products/${handle}.js`;
    return window
      .fetch(requestRoute)
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function getScript(url, callback, callbackError) {
    let head = document.getElementsByTagName('head')[0];
    let done = false;
    let script = document.createElement('script');
    script.src = url;

    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        done = true;
        callback();
      } else {
        callbackError();
      }
    };

    head.appendChild(script);
  }

  const loaders = {};

  function loadScript(options = {}) {
    if (!options.type) {
      options.type = 'json';
    }

    if (options.url) {
      if (loaders[options.url]) {
        return loaders[options.url];
      } else {
        return getScriptWithPromise(options.url, options.type);
      }
    } else if (options.json) {
      if (loaders[options.json]) {
        return Promise.resolve(loaders[options.json]);
      } else {
        return window
          .fetch(options.json)
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            loaders[options.json] = response;
            return response;
          });
      }
    } else if (options.name) {
      const key = ''.concat(options.name, options.version);
      if (loaders[key]) {
        return loaders[key];
      } else {
        return loadShopifyWithPromise(options);
      }
    } else {
      return Promise.reject();
    }
  }

  function getScriptWithPromise(url, type) {
    const loader = new Promise((resolve, reject) => {
      if (type === 'text') {
        fetch(url)
          .then((response) => response.text())
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        getScript(
          url,
          function () {
            resolve();
          },
          function () {
            reject();
          }
        );
      }
    });

    loaders[url] = loader;
    return loader;
  }

  function loadShopifyWithPromise(options) {
    const key = ''.concat(options.name, options.version);
    const loader = new Promise((resolve, reject) => {
      try {
        window.Shopify.loadFeatures([
          {
            name: options.name,
            version: options.version,
            onLoad: (err) => {
              onLoadFromShopify(resolve, reject, err);
            },
          },
        ]);
      } catch (err) {
        reject(err);
      }
    });
    loaders[key] = loader;
    return loader;
  }

  function onLoadFromShopify(resolve, reject, err) {
    if (err) {
      return reject(err);
    } else {
      return resolve();
    }
  }

  const selectors$C = {
    wrapper: '[data-swapper-wrapper]',
    target: '[data-swapper-target]',
    hover: 'data-swapper-hover',
  };

  let sections$e = {};

  class Swapper {
    constructor(el) {
      this.container = el;
      this.target = this.container.querySelector(selectors$C.target);
      this.hovers = this.container.querySelectorAll(`[${selectors$C.hover}]`);

      if (this.target && this.hovers.length) {
        this.deafaultContent = this.target.innerHTML;
        this.init();
      }
    }

    init() {
      this.hovers.forEach((hover) => {
        hover.addEventListener(
          'mouseenter',
          function () {
            const newContent = hover.getAttribute(selectors$C.hover);
            this.target.innerHTML = `${newContent}`;
          }.bind(this)
        );
      });
      this.hovers.forEach((hover) => {
        hover.addEventListener(
          'mouseleave',
          function () {
            this.target.innerHTML = this.deafaultContent;
          }.bind(this)
        );
      });
      this.hovers.forEach((hover) => {
        hover.addEventListener(
          'click',
          function () {
            const clickedContent = hover.getAttribute(selectors$C.hover);
            this.deafaultContent = `${clickedContent}`;
          }.bind(this)
        );
      });
    }
  }

  function makeSwappers(instance) {
    sections$e[instance.id] = [];
    const els = instance.container.querySelectorAll(selectors$C.wrapper);
    els.forEach((el) => {
      sections$e[instance.id].push(new Swapper(el));
    });
  }

  const swapperSection = {
    onLoad() {
      makeSwappers(this);
    },
  };

  const defaults = {
    color: 'ash',
  };

  const selectors$B = {
    swatch: 'data-swatch',
    outerGrid: '[data-grid-item]',
    slide: '[data-grid-slide]',
    image: 'data-swatch-image',
    variant: 'data-swatch-variant',
    button: '[data-swatch-button]',
    link: '[data-grid-link]',
    wrapper: '[data-grid-swatches]',
    template: '[data-swatch-template]',
    handle: 'data-swatch-handle',
    label: 'data-swatch-label',
  };

  class ColorMatch {
    constructor(options = {}) {
      this.settings = {
        ...defaults,
        ...options,
      };

      this.match = this.init();
    }

    getColor() {
      return this.match;
    }

    init() {
      const getColors = loadScript({json: window.theme.assets.swatches});
      return getColors
        .then((colors) => {
          return this.matchColors(colors, this.settings.color);
        })
        .catch((e) => {
          console.log('failed to load swatch colors script');
          console.log(e);
        });
    }

    matchColors(colors, name) {
      let bg = '#E5E5E5';
      let img = null;
      const path = window.theme.assets.base || '/';
      const comparisonName = name.toLowerCase().replace(/\s/g, '');
      const array = colors.colors;
      if (array) {
        const variantNameMatch = (nameObject) => {
          const indexName = Object.keys(nameObject).toString();
          const neatName = indexName.toLowerCase().replace(/\s/g, '');
          return neatName === comparisonName;
        };
        const position = array.findIndex(variantNameMatch);
        if (position > -1) {
          const value = Object.values(array[position])[0];
          const valueLowerCase = value.toLowerCase();
          if (valueLowerCase.includes('.jpg') || valueLowerCase.includes('.jpeg') || valueLowerCase.includes('.png') || valueLowerCase.includes('.svg')) {
            img = `${path}${value}`;
            bg = '#888888';
          } else {
            bg = value;
          }
        }
      }
      return {
        color: this.settings.color,
        path: img,
        hex: bg,
      };
    }
  }

  class RadioSwatch extends HTMLElement {
    constructor() {
      super();

      this.element = this.querySelector(`[${selectors$B.swatch}]`);
      this.colorString = this.element.getAttribute(selectors$B.swatch);
      this.image = this.element.getAttribute(selectors$B.image);
      this.variant = this.element.getAttribute(selectors$B.variant);
      this.outer = this.element.closest(selectors$B.outerGrid);
      const matcher = new ColorMatch({color: this.colorString});
      matcher.getColor().then((result) => {
        this.colorMatch = result;
        this.init();
      });
    }

    init() {
      this.setStyles();
      if (this.variant && this.outer) {
        this.handleClicks();
      }
    }

    setStyles() {
      if (this.colorMatch.hex) {
        this.element.style.setProperty('--swatch', `${this.colorMatch.hex}`);
      }
      if (this.colorMatch.path) {
        this.element.style.setProperty('background-image', `url(${this.colorMatch.path})`);
        this.element.style.setProperty('background-size', 'cover');
      }
    }

    handleClicks() {
      this.slide = this.outer.querySelector(selectors$B.slide);
      this.linkElement = this.outer.querySelector(selectors$B.link);
      this.linkDestination = getUrlWithVariant(this.linkElement.getAttribute('href'), this.variant);
      this.button = this.element.closest(selectors$B.button);
      this.button.addEventListener(
        'click',
        function () {
          this.linkElement.setAttribute('href', this.linkDestination);
          this.slide.setAttribute('src', this.linkDestination);
          if (this.image) {
            // container width rounded to the nearest 180 pixels
            // increses likelihood that the image will be cached
            let ratio = window.devicePixelRatio || 1;
            let pixels = this.slide.offsetWidth * ratio;
            let widthRounded = Math.ceil(pixels / 180) * 180;
            let sizedImage = getSizedImageUrl(this.image, `${widthRounded}x`);
            window
              .fetch(sizedImage)
              .then((response) => {
                return response.blob();
              })
              .then((blob) => {
                var objectURL = URL.createObjectURL(blob);
                this.slide.style.setProperty('background-color', '#fff');
                this.slide.style.setProperty('background-image', `url("${objectURL}")`);
              })
              .catch((error) => {
                console.log(`Error: ${error}`);
              });
          }
        }.bind(this)
      );
    }
  }

  class GridSwatch {
    constructor(wrap) {
      this.template = document.querySelector(selectors$B.template).innerHTML;
      this.wrap = wrap;
      this.handle = wrap.getAttribute(selectors$B.handle);
      const label = wrap.getAttribute(selectors$B.label).trim().toLowerCase();
      getProductJson(this.handle).then((product) => {
        this.product = product;
        this.colorOption = product.options.find(function (element) {
          return element.name.toLowerCase() === label || null;
        });
        if (this.colorOption) {
          this.swatches = this.colorOption.values;
          this.init();
        }
      });
    }

    init() {
      this.wrap.innerHTML = '';
      this.swatches.forEach((swatch) => {
        let variant = this.product.variants.find((variant) => {
          return variant.options.includes(swatch);
        });
        const image = variant.featured_media ? variant.featured_media.preview_image.src : '';

        const rand = Math.floor(Math.random() * 9999);

        this.wrap.innerHTML += Sqrl__namespace.render(this.template, {
          color: swatch,
          uniq: `${this.product.id}-${variant.id}-${rand}`,
          variant: variant.id,
          image,
        });
      });

      new NativeScrollbar(this.wrap);
    }
  }

  function makeGridSwatches(container) {
    const gridSwatchWrappers = container.querySelectorAll(selectors$B.wrapper);
    gridSwatchWrappers.forEach((wrap) => {
      new GridSwatch(wrap);
    });
  }

  const swatchGridSection = {
    onLoad() {
      makeGridSwatches(this.container);
      makeSwappers(this);
    },
  };

  const selectors$A = {
    popoutWrapper: '[data-popout]',
    popoutList: '[data-popout-list]',
    popoutToggle: 'data-popout-toggle',
    popoutInput: '[data-popout-input]',
    popoutOptions: '[data-popout-option]',
    popoutPrevent: 'data-popout-prevent',
    popoutQuantity: 'data-quantity-field',
    dataValue: 'data-value',
    ariaExpanded: 'aria-expanded',
    ariaCurrent: 'aria-current',
  };

  const classes$j = {
    listVisible: 'popout-list--visible',
    currentSuffix: '--current',
  };

  class PopoutSelect extends HTMLElement {
    constructor() {
      super();

      this.container = this.querySelector(selectors$A.popoutWrapper);
      this.popoutList = this.container.querySelector(selectors$A.popoutList);
      this.popoutToggle = this.container.querySelector(`[${selectors$A.popoutToggle}]`);
      this.outsidePopupToggle = document.querySelector(`[${selectors$A.popoutToggle}="${this.popoutList.id}"]`);
      this.popoutInput = this.container.querySelector(selectors$A.popoutInput);
      this.popoutOptions = this.container.querySelectorAll(selectors$A.popoutOptions);
      this.popoutPrevent = this.container.getAttribute(selectors$A.popoutPrevent) === 'true';

      this._connectOptions();
      this._connectToggle();
      this._onFocusOut();
      this.popupListMaxWidth();

      if (this.popoutInput && this.popoutInput.hasAttribute(selectors$A.popoutQuantity)) {
        document.addEventListener('popout:updateValue', this.updatePopout.bind(this));
      }

      document.addEventListener('theme:resize', () => {
        this.popupListMaxWidth();
      });
    }

    unload() {
      if (this.popoutOptions.length) {
        this.popoutOptions.forEach((element) => {
          element.removeEventListener('clickDetails', this.popupOptionsClick.bind(this));
          element.removeEventListener('click', this._connectOptionsDispatch.bind(this));
        });
      }

      this.popoutToggle.removeEventListener('click', this.popupToggleClick.bind(this));

      this.popoutToggle.removeEventListener('focusout', this.popupToggleFocusout.bind(this));

      this.popoutList.removeEventListener('focusout', this.popupListFocusout.bind(this));

      this.container.removeEventListener('keyup', this.containerKeyup.bind(this));

      if (this.outsidePopupToggle) {
        this.outsidePopupToggle.removeEventListener('click', this.popupToggleClick.bind(this));

        this.outsidePopupToggle.removeEventListener('focusout', this.popupToggleFocusout.bind(this));
      }
    }

    popupToggleClick(evt) {
      const ariaExpanded = evt.currentTarget.getAttribute(selectors$A.ariaExpanded) === 'true';
      evt.currentTarget.setAttribute(selectors$A.ariaExpanded, !ariaExpanded);
      this.popoutList.classList.toggle(classes$j.listVisible);
      this.popupListMaxWidth();
    }

    popupToggleFocusout(evt) {
      const popoutLostFocus = this.container.contains(evt.relatedTarget);

      if (!popoutLostFocus) {
        this._hideList();
      }
    }

    popupListFocusout(evt) {
      const childInFocus = evt.currentTarget.contains(evt.relatedTarget);
      const isVisible = this.popoutList.classList.contains(classes$j.listVisible);

      if (isVisible && !childInFocus) {
        this._hideList();
      }
    }

    popupListMaxWidth() {
      this.popoutList.style.maxWidth = `${parseInt(document.body.clientWidth - this.popoutList.getBoundingClientRect().left)}px`;
    }

    popupOptionsClick(evt) {
      const link = evt.target.closest(selectors$A.popoutOptions);
      if (link.attributes.href.value === '#') {
        evt.preventDefault();

        let attrValue = '';

        if (evt.currentTarget.getAttribute(selectors$A.dataValue)) {
          attrValue = evt.currentTarget.getAttribute(selectors$A.dataValue);
        }

        this.popoutInput.value = attrValue;

        if (this.popoutPrevent) {
          this.popoutInput.dispatchEvent(new Event('change'));

          if (!evt.detail.preventTrigger && this.popoutInput.hasAttribute(selectors$A.popoutQuantity)) {
            this.popoutInput.dispatchEvent(new Event('input'));
          }

          const currentElement = this.popoutList.querySelector(`[class*="${classes$j.currentSuffix}"]`);
          let targetClass = classes$j.currentSuffix;

          if (currentElement && currentElement.classList.length) {
            for (const currentElementClass of currentElement.classList) {
              if (currentElementClass.includes(classes$j.currentSuffix)) {
                targetClass = currentElementClass;
                break;
              }
            }
          }

          const listTargetElement = this.popoutList.querySelector(`.${targetClass}`);

          if (listTargetElement) {
            listTargetElement.classList.remove(`${targetClass}`);
            evt.currentTarget.parentElement.classList.add(`${targetClass}`);
          }

          const targetAttribute = this.popoutList.querySelector(`[${selectors$A.ariaCurrent}]`);

          if (targetAttribute && targetAttribute.hasAttribute(`${selectors$A.ariaCurrent}`)) {
            targetAttribute.removeAttribute(`${selectors$A.ariaCurrent}`);
            evt.currentTarget.setAttribute(`${selectors$A.ariaCurrent}`, 'true');
          }

          if (attrValue !== '') {
            this.popoutToggle.textContent = attrValue;

            if (this.outsidePopupToggle) {
              this.outsidePopupToggle.textContent = attrValue;
            }
          }

          this.popupToggleFocusout(evt);
          this.popupListFocusout(evt);
        } else {
          this._submitForm(attrValue);
        }
      }
    }

    updatePopout(evt) {
      const targetElement = this.popoutList.querySelector(`[${selectors$A.dataValue}="${this.popoutInput.value}"]`);
      if (targetElement) {
        targetElement.dispatchEvent(
          new CustomEvent('clickDetails', {
            cancelable: true,
            bubbles: true,
            detail: {
              preventTrigger: true,
            },
          })
        );
      }
    }

    containerKeyup(evt) {
      if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
        return;
      }
      this._hideList();
      this.popoutToggle.focus();
    }

    bodyClick(evt) {
      const isOption = this.container.contains(evt.target);
      const isVisible = this.popoutList.classList.contains(classes$j.listVisible);
      this.outsidePopupToggle === evt.target;

      if (isVisible && !isOption) {
        this._hideList();
      }
    }

    _connectToggle() {
      this.popoutToggle.addEventListener('click', this.popupToggleClick.bind(this));

      if (this.outsidePopupToggle) {
        this.outsidePopupToggle.addEventListener('click', this.popupToggleClick.bind(this));
      }
    }

    _connectOptions() {
      if (this.popoutOptions.length) {
        this.popoutOptions.forEach((element) => {
          element.addEventListener('clickDetails', this.popupOptionsClick.bind(this));
          element.addEventListener('click', this._connectOptionsDispatch.bind(this));
        });
      }
    }

    _connectOptionsDispatch(evt) {
      const event = new CustomEvent('clickDetails', {
        cancelable: true,
        bubbles: true,
        detail: {
          preventTrigger: false,
        },
      });

      if (!evt.target.dispatchEvent(event)) {
        evt.preventDefault();
      }
    }

    _onFocusOut() {
      this.popoutToggle.addEventListener('focusout', this.popupToggleFocusout.bind(this));

      if (this.outsidePopupToggle) {
        this.outsidePopupToggle.addEventListener('focusout', this.popupToggleFocusout.bind(this));
      }

      this.popoutList.addEventListener('focusout', this.popupListFocusout.bind(this));

      this.container.addEventListener('keyup', this.containerKeyup.bind(this));

      document.body.addEventListener('click', this.bodyClick.bind(this));
    }

    _submitForm(value) {
      const form = this.container.closest('form');
      if (form) {
        form.submit();
      }
    }

    _hideList() {
      this.popoutList.classList.remove(classes$j.listVisible);
      this.popoutToggle.setAttribute(selectors$A.ariaExpanded, false);
      if (this.outsidePopupToggle) {
        this.outsidePopupToggle.setAttribute(selectors$A.ariaExpanded, false);
      }
    }
  }

  const slideDown = (target, duration = 500, checkHidden = true) => {
    let display = window.getComputedStyle(target).display;
    if (checkHidden && display !== 'none') {
      return;
    }
    target.style.removeProperty('display');
    if (display === 'none') display = 'block';
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionTimingFunction = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.style.removeProperty('transition-timing-function');
    }, duration);
  };

  const slideUp = (target, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionTimingFunction = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.style.removeProperty('transition-timing-function');
    }, duration);
  };

  let sections$d = {};

  const selectors$z = {
    wrapper: '[data-add-action-wrapper]',
    addButton: '[data-add-to-cart]',
    errors: '[data-add-action-errors]',
    addVariantDetached: 'data-add-to-cart-variant',
    popdown: '[data-product-add-popdown-wrapper]',
    disabledAjax: '[data-ajax-disable="true"]',
    upsellModal: '[data-upsell-modal]',
  };

  const classes$i = {
    loading: 'loading',
    success: 'has-success',
  };

  class ProductAddButton {
    constructor(wrapper, isCartItem) {
      this.wrapper = wrapper;
      this.isCartItem = isCartItem ? isCartItem : false;
      this.button = wrapper.querySelector(selectors$z.addButton);
      this.errors = wrapper.querySelector(selectors$z.errors);
      this.popdown = document.querySelector(selectors$z.popdown);
      this.disabledAjax = document.querySelector(selectors$z.disabledAjax);

      if (this.button) {
        const isDetached = this.button.hasAttribute(selectors$z.addVariantDetached);
        if (isDetached) {
          this.initDetached();
        } else {
          this.initWithForm();
        }
      }
    }

    initWithForm() {
      this.button.addEventListener(
        'click',
        function (evt) {
          const outerForm = evt.target.closest('form');
          if (outerForm.querySelector('[type="file"]')) {
            return;
          }
          if (!this.disabledAjax) {
            evt.preventDefault();
          }

          this.button.setAttribute('disabled', true);
          this.button.classList.add(classes$i.loading);

          const formData = new FormData(outerForm);
          const formString = new URLSearchParams(formData).toString();
          if (document.querySelector('.bundle_variants')) {
            let formData = { 'items': [] }, quantity = parseInt(formString.substr(formString.indexOf('quantity=') + 9, 1));
            console.log(quantity);
            document.querySelectorAll('.bundle_variants span').forEach((el) => {
              formData.items.push({
                id: el.dataset.id, 
                quantity: parseInt(el.dataset.quantity) * quantity
              });
            });           
            
            this.addToCartAction(formData)
          }
          else {
            this.addToCartAction(formString);
          }
        }.bind(this)
      );
    }

    initDetached() {
      this.button.addEventListener(
        'click',
        function (evt) {
          if (!this.disabledAjax) {
            evt.preventDefault();
          }

          this.button.setAttribute('disabled', true);
          this.button.classList.add(classes$i.loading);

          const variant = this.button.getAttribute(selectors$z.addVariantDetached);
          const formString = `form_type=product&id=${variant}`;

          if (document.querySelector('.bundle_variants')) {
            let formData = { 'items': [] }, quantity = parseInt(document.querySelector('[data-quantity-input]').value);
            document.querySelectorAll('.bundle_variants span').forEach((el) => {
              formData.items.push({
                id: el.dataset.id, 
                quantity: parseInt(el.dataset.quantity) * quantity
              });
            });           
            
            this.addToCartAction(formData)
          }
          else {
            this.addToCartAction(formString);
          }
        }.bind(this)
      );
    }

    addToCartAction(formData) {
      const url = `${window.theme.routes.cart}/add.js`;
      const instance = this;
      axios
        .post(url, formData, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then(function (response) {
          instance.onSuccess(response.data);
        })
        .catch(function (error) {
          console.warn(error);
          instance.onError(error.data);
        });
    }

    onSuccess(variant) {
      this.updateHeaderTotal();
      this.button.classList.remove(classes$i.loading);
      this.button.classList.add(classes$i.success);
      setTimeout(() => {
        this.button.classList.remove(classes$i.success);
        this.button.removeAttribute('disabled');
      }, 3500);

      if (this.button.closest(selectors$z.upsellModal)) {
        this.button.closest(selectors$z.upsellModal).dispatchEvent(new CustomEvent('theme:upsell:close'));
      }

      if (this.isCartItem) {
        document.dispatchEvent(new CustomEvent('theme:cart:reload', {bubbles: true}));
      } else {
        this.popdown.dispatchEvent(
          new CustomEvent('theme:cart:popdown', {
            detail: {
              variant: variant,
            },
            bubbles: true,
          })
        );
      }

      if (this.disabledAjax) {
        window.location.reload();
      }
    }

    onError(data) {
      let text = 'Network error: please try again';
      if (data && data.description) {
        text = data.description;
      }
      const errorsHTML = `<div class="errors">${text}</div>`;

      this.button.classList.remove(classes$i.loading);
      this.button.removeAttribute('disabled');
      this.errors.innerHTML = errorsHTML;
      slideDown(this.errors);
      setTimeout(() => {
        slideUp(this.errors);
      }, 5000);
    }

    updateHeaderTotal() {
      axios
        .get(`${window.theme.routes.cart}.js`)
        .then((response) => {
          document.dispatchEvent(
            new CustomEvent('theme:cart:change', {
              detail: {
                cart: response.data,
              },
              bubbles: true,
            })
          );
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  const productAddSection = {
    onLoad() {
      sections$d[this.id] = [];
      const els = this.container.querySelectorAll(selectors$z.wrapper);
      els.forEach((el) => {
        sections$d[this.id].push(new ProductAddButton(el));
      });
    },
    onUnload: function () {
      sections$d[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$y = {
    upsellHolder: 'data-upsell-holder',
    addButtonWrapper: '[data-add-action-wrapper]',
    modalContent: '[data-product-upsell-ajax]',
    upsellModal: '[data-upsell-modal]',
    upsellModalTemplate: '[data-upsell-modal-template]',
    media: '[data-media-slide]',
    cartLineItems: '[data-line-items]',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  class UpsellProduct extends HTMLElement {
    constructor() {
      super();

      this.upsellHolder = this.querySelector(`[${selectors$y.upsellHolder}]`);
      this.modalCloseEvent = () => this.modalClose();

      if (this.upsellHolder) {
        this.isCartItem = Boolean(this.upsellHolder.closest(selectors$y.cartLineItems));
        this.modalTemplate = this.upsellHolder.querySelector(selectors$y.upsellModalTemplate);
        this.modal = document.querySelector(selectors$y.upsellModal);
        this.modalID = this.upsellHolder.getAttribute(selectors$y.upsellHolder);
        this.modalContent = null;
        this.triggerButton = document.querySelector(`[data-popup-${this.modalID}]`);
        this.handle = this.triggerButton ? this.triggerButton.getAttribute(`data-popup-${this.modalID}`) : null;

        if (this.modalTemplate && !this.modal) {
          const modalTemplateInner = this.modalTemplate.innerHTML;
          const htmlObject = document.createElement('div');
          htmlObject.innerHTML = modalTemplateInner;
          this.modalHtml = htmlObject.querySelector(selectors$y.upsellModal);
          document.body.appendChild(this.modalHtml);
          this.modal = document.querySelector(selectors$y.upsellModal);
        }

        this.init();
      }
    }

    init() {
      if (this.modalTemplate && this.triggerButton) {
        this.triggerButton.addEventListener('click', (e) => {
          e.preventDefault();

          if (this.modal && this.modalID) {
            this.modal.id = this.modalID;
          }

          this.getUpsellHTML();
        });
      }

      if (this.isCartItem) {
        new ProductAddButton(this.upsellHolder, this.isCartItem);
      }
    }

    getUpsellHTML() {
      window
        .fetch(`${window.theme.routes.root_url}products/${this.handle}?section_id=api-product-upsell`)
        .then(this.handleErrors)
        .then((response) => {
          return response.text();
        })
        .then((response) => {
          const fresh = document.createElement('div');
          fresh.innerHTML = response;
          this.modalContent = document.querySelector(selectors$y.modalContent);
          this.modalContent.innerHTML = fresh.querySelector('[data-api-content]').innerHTML;
          this.modalCreate();
        });
    }

    modalCreate() {
      MicroModal.show(this.modalID, {
        onShow: (modal, el, event) => {
          const addButtonWrapper = modal.querySelector(selectors$y.addButtonWrapper);
          new ProductAddButton(addButtonWrapper, this.isCartItem);

          const firstFocus = modal.querySelector(selectors$y.focusable);
          trapFocus(modal, {elementToFocus: firstFocus});
          this.modal.addEventListener('theme:upsell:close', this.modalCloseEvent);

          this.modalContent.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        },
        onClose: (modal, el, event) => {
          const allMedia = modal.querySelectorAll(selectors$y.media);

          allMedia.forEach((media) => {
            media.dispatchEvent(new CustomEvent('pause'));
          });

          removeTrapFocus();
          el.focus();
          this.modal.removeEventListener('theme:upsell:close', this.modalCloseEvent);
        },
      });
    }

    modalClose() {
      MicroModal.close(this.modalID);
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  class CartNotes {
    constructor(element) {
      this.inputs = element.querySelectorAll('[data-cart-note]');
      this.initInputs();
    }

    initInputs() {
      this.inputs.forEach((input) => {
        input.addEventListener(
          'change',
          function (e) {
            const note = e.target.value.toString() || '';
            this.saveNotes(note);
          }.bind(this)
        );
      });
    }

    saveNotes(newNote) {
      window
        .fetch(`${window.theme.routes.cart}/update.js`, {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({note: newNote}),
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  const getUrlString = (params, keys = [], isArray = false) => {
    const p = Object.keys(params)
      .map((key) => {
        let val = params[key];

        if (Object.prototype.toString.call(val) === '[object Object]' || Array.isArray(val)) {
          if (Array.isArray(params)) {
            keys.push('');
          } else {
            keys.push(key);
          }
          return getUrlString(val, keys, Array.isArray(val));
        } else {
          let tKey = key;

          if (keys.length > 0) {
            const tKeys = isArray ? keys : [...keys, key];
            tKey = tKeys.reduce((str, k) => {
              return str === '' ? k : `${str}[${k}]`;
            }, '');
          }
          if (isArray) {
            return `${tKey}[]=${val}`;
          } else {
            return `${tKey}=${val}`;
          }
        }
      })
      .join('&');

    keys.pop();
    return p;
  };

  /**
   * Module to add a shipping rates calculator to cart page.
   *
   */

  const selectors$x = {
    submitButton: '[data-submit-shipping]',
    form: '[data-shipping-estimate-form]',
    template: '[data-response-template]',
    country: '#estimate_address_country',
    province: '#estimate_address_province',
    zip: '#estimate_address_zip',
    wrapper: '[data-response-wrapper]',
    defaultData: 'data-default-fullname',
  };

  const classes$h = {
    success: 'shipping--success',
    error: 'errors',
  };

  class ShippingCalculator {
    constructor(section) {
      this.button = section.container.querySelector(selectors$x.submitButton);
      this.template = section.container.querySelector(selectors$x.template).innerHTML;
      this.ratesWrapper = section.container.querySelector(selectors$x.wrapper);
      this.form = section.container.querySelector(selectors$x.form);
      this.country = section.container.querySelector(selectors$x.country);
      this.province = section.container.querySelector(selectors$x.province);
      this.zip = section.container.querySelector(selectors$x.zip);
      this.init();
    }

    enableButtons() {
      this.button.removeAttribute('disabled');
      this.button.classList.remove('disabled');
    }

    disableButtons() {
      this.button.setAttribute('disabled', 'disabled');
      this.button.classList.add('disabled');
    }

    render(rates) {
      if (this.template && this.ratesWrapper) {
        const rendered = Sqrl__namespace.render(this.template, rates);
        this.ratesWrapper.innerHTML = rendered;
      }
      this.enableButtons();
      this.ratesWrapper.style.removeProperty('display');
    }

    estimate(shipping_address) {
      const encodedShippingAddressData = encodeURI(
        getUrlString({
          shipping_address: shipping_address,
        })
      );
      const url = `${window.theme.routes.cart}/shipping_rates.json?${encodedShippingAddressData}`;
      const instance = this;
      axios
        .get(url)
        .then(function (response) {
          // handle success
          const items = instance.sanitize(response);
          instance.render(items);
          instance.enableButtons();
          instance.ratesWrapper.style.removeProperty('display');
        })
        .catch(function (error) {
          // handle errors
          const errors = instance.sanitizeErrors(error);
          instance.render(errors);
        });
    }

    sanitize(response) {
      const sanitized = {};
      sanitized.class = classes$h.success;
      sanitized.items = [];
      if (response.data.shipping_rates && response.data.shipping_rates.length > 0) {
        const rates = response.data.shipping_rates;
        rates.forEach((r) => {
          let item = {};
          item.title = r.presentment_name;
          item.value = themeCurrency.formatMoney(r.price, theme.moneyFormat);
          sanitized.items.push(item);
        });
      } else {
        sanitized.items[0] = {value: theme.strings.noShippingAvailable};
      }
      return sanitized;
    }

    sanitizeErrors(response) {
      const errors = {};
      errors.class = classes$h.error;
      errors.items = [];
      if (typeof response.data === 'object') {
        for (const [key, value] of Object.entries(response.data)) {
          let item = {};
          item.title = key.toString();
          item.value = value.toString();
          errors.items.push(item);
        }
      } else {
        errors.items[0] = {value: theme.strings.noShippingAvailable};
      }
      return errors;
    }

    init() {
      const htmlEl = document.querySelector('html');
      let locale = 'en';
      if (htmlEl.hasAttribute('lang') && htmlEl.getAttribute('lang') !== '') {
        locale = htmlEl.getAttribute('lang');
      }

      if (this.form) {
        themeAddresses.AddressForm(this.form, locale, {
          shippingCountriesOnly: true,
        });
      }

      if (this.country && this.country.hasAttribute('data-default') && this.province && this.province.hasAttribute('data-default')) {
        this.country.addEventListener('change', function () {
          this.country.removeAttribute('data-default');
          this.province.removeAttribute('data-default');
        });
      }

      if (this.button) {
        this.button.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.disableButtons();
            while (this.ratesWrapper.firstChild) this.ratesWrapper.removeChild(this.ratesWrapper.firstChild);
            this.ratesWrapper.style.display = 'none';
            const shippingAddress = {};
            let elemCountryVal = this.country.value;
            let elemProvinceVal = this.province.value;
            const elemCountryData = this.country.getAttribute(selectors$x.defaultData);
            if (elemCountryVal === '' && elemCountryData && elemCountryData !== '') {
              elemCountryVal = elemCountryData;
            }
            const elemProvinceData = this.province.getAttribute(selectors$x.defaultData);
            if (elemProvinceVal === '' && elemProvinceData && elemProvinceData !== '') {
              elemProvinceVal = elemProvinceData;
            }
            shippingAddress.zip = this.zip.value || '';
            shippingAddress.country = elemCountryVal || '';
            shippingAddress.province = elemProvinceVal || '';
            this.estimate(shippingAddress);
          }.bind(this)
        );
      }
    }
  }

  const selectors$w = {
    wrapper: '[data-quantity-selector]',
    increase: '[data-increase-quantity]',
    decrease: '[data-decrease-quantity]',
    input: '[data-quantity-input]',
  };

  class Quantity {
    constructor(wrapper) {
      this.wrapper = wrapper;
      this.increase = this.wrapper.querySelector(selectors$w.increase);
      this.decrease = this.wrapper.querySelector(selectors$w.decrease);
      this.input = this.wrapper.querySelector(selectors$w.input);
      this.min = parseInt(this.input.getAttribute('min'), 10);
      this.initButtons();
    }

    initButtons() {
      this.increase.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          let v = parseInt(this.input.value, 10);
          v = isNaN(v) ? 0 : v;
          v++;
          this.input.value = v;
          this.input.dispatchEvent(new Event('change'));
        }.bind(this)
      );
      this.decrease.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          let v = parseInt(this.input.value, 10);
          v = isNaN(v) ? 0 : v;
          v--;
          v = Math.max(this.min, v);
          this.input.value = v;
          this.input.dispatchEvent(new Event('change'));
        }.bind(this)
      );
    }
  }

  function initQtySection(container) {
    const quantityWrappers = container.querySelectorAll(selectors$w.wrapper);
    quantityWrappers.forEach((qty) => {
      new Quantity(qty);
    });
  }

  const selectors$v = {
    drawer: '[data-drawer="drawer-cart"]',
    shipping: '[data-shipping-estimate-form]',
    loader: '[data-cart-loading]',
    form: '[data-cart-form]',
    emptystate: '[data-cart-empty]',
    progress: '[data-cart-progress]',
    items: '[data-line-items]',
    subtotal: '[data-cart-subtotal]',
    bottom: '[data-cart-bottom]',
    quantity: '[data-quantity-selector]',
    errors: '[data-form-errors]',
    item: '[data-cart-item]',
    finalPrice: '[data-cart-final]',
    key: 'data-update-cart',
    remove: 'data-remove-key',
    upsellProduct: '[data-upsell-holder]',
    cartPage: '[data-section-type="cart"]',
    bar: '[data-cart-bar]',
    ship: '[data-cart-message]',
  };

  const classes$g = {
    hidden: 'cart--hidden',
    loading: 'cart--loading',
  };

  class CartItems {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.bar = this.container.querySelector(selectors$v.bar);
      this.ship = this.container.querySelector(selectors$v.ship);
      this.drawer = this.container.querySelector(selectors$v.drawer);
      this.form = this.container.querySelector(selectors$v.form);
      this.loader = this.container.querySelector(selectors$v.loader);
      this.bottom = this.container.querySelector(selectors$v.bottom);
      this.items = this.container.querySelector(selectors$v.items);
      this.subtotal = this.container.querySelector(selectors$v.subtotal);
      this.errors = this.container.querySelector(selectors$v.errors);
      this.finalPrice = this.container.querySelector(selectors$v.finalPrice);
      this.emptystate = this.container.querySelector(selectors$v.emptystate);
      this.progress = this.container.querySelector(selectors$v.progress);
      this.latestClick = null;
      this.cart = null;
      this.stale = true;
      this.cartPage = document.querySelector(selectors$v.cartPage);
      this.listen();
    }

    listen() {
      document.addEventListener(
        'theme:cart:change',
        function (event) {
          this.cart = event.detail.cart;
          this.stale = true;
        }.bind(this)
      );

      document.addEventListener(
        'theme:cart:init',
        function () {
          this.init();
        }.bind(this)
      );

      document.addEventListener(
        'theme:cart:reload',
        function () {
          this.stale = true;
          if (this.cart) {
            this.loadHTML();
          } else {
            this.init().then(() => this.loadHTML());
          }
        }.bind(this)
      );

      if (this.drawer) {
        this.drawer.addEventListener(
          'theme:drawer:open',
          function () {
            if (this.cart) {
              this.loadHTML();
            } else {
              this.init().then(() => this.loadHTML());
            }
          }.bind(this)
        );
      }

      new CartNotes(this.container);
      new CartShippingMessage(this.container);
    }

    init() {
      return window
        .fetch(`${window.theme.routes.cart}.js`)
        .then(this.handleErrors)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.cart = response;
          this.fireChange(response);
          return response;
        })
        .catch((e) => {
          console.error(e);
        });
    }

    loadHTML() {
      if (this.stale) {
        if (this.cart && this.cart.item_count > 0) {
          this.loadForm();
        } else {
          this.showEmpty();
        }
      }
      this.stale = false;
    }

    initInputs() {
      this.inputs = this.container.querySelectorAll(`[${selectors$v.key}]`);
      this.inputs.forEach((input) => {
        const key = input.getAttribute(selectors$v.key);
        input.addEventListener(
          'change',
          function (e) {
            const quantity = parseInt(e.target.value, 10);
            this.latestClick = e.target.closest(selectors$v.item);
            this.lockState();
            this.updateCart(key, quantity);
          }.bind(this)
        );
      });
    }

    initRemove() {
      this.removers = this.container.querySelectorAll(`[${selectors$v.remove}]`);
      this.removers.forEach((remover) => {
        const key = remover.getAttribute(selectors$v.remove);
        remover.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.latestClick = e.target.closest(selectors$v.item);
            this.lockState();
            this.updateCart(key, 0);
          }.bind(this)
        );
      });
    }

    lockState() {
      this.latestClick.querySelector('.item--loadbar').style.display = 'block';
      this.loader.classList.add(classes$g.loading);
    }

    updateCart(clickedKey, newQuantity) {
      let oldCount = null;
      let newCount = null;
      let newItem = null;
      window
        .fetch(`${window.theme.routes.cart}.js`)
        .then(this.handleErrors)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          const matchKeys = (item) => item.key === clickedKey;
          const index = response.items.findIndex(matchKeys);
          oldCount = response.item_count;
          newItem = response.items[index].title;
          const data = {
            line: `${index + 1}`,
            quantity: newQuantity,
          };
          return window.fetch(`${window.theme.routes.cart}/change.js`, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
          });
        })
        .then(this.handleErrors)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          this.cart = response;
          newCount = response.item_count;
          if (oldCount === newCount) {
            this.stockoutError(newItem);
            this.stale = true;
          } else {
            slideUp(this.errors);
            this.fireChange(response);
            this.stale = true;
          }

          this.loadHTML();
        })
        .catch((e) => {
          console.error(e);
          let heading = '';
          if (typeof e.status !== 'undefined') {
            heading = `<p>${e.status}</p>`;
          }
          let paragraph = e.json.description || '';
          this.showError(`${heading + paragraph}`);
          this.loadHTML();
        });
    }

    fireChange(newCart) {
      document.dispatchEvent(
        new CustomEvent('theme:cart:change', {
          detail: {
            cart: newCart,
          },
          bubbles: true,
        })
      );
    }

    updateTotal() {
      if (this.cart && this.cart.total_price) {
        const price = themeCurrency.formatMoney(this.cart.total_price, theme.moneyFormat);
        this.finalPrice.innerHTML = price;
      }
      if (this.subtotal && this.cart) {
        window
          .fetch(`${window.theme.routes.root_url}?section_id=api-cart-subtotal`)
          .then(this.handleErrors)
          .then((response) => {
            return response.text();
          })
          .then((response) => {
            const fresh = document.createElement('div');
            fresh.innerHTML = response;
            this.subtotal.innerHTML = fresh.querySelector('[data-api-content]').innerHTML;
          });
      }
    }

    showError(message) {
      slideUp(this.errors);
      this.errors.innerHTML = message;
      window.setTimeout(() => {
        slideDown(this.errors);
      }, 600);
    }

    stockoutError(itemTitle) {
      let heading = `<p><strong>${window.theme.strings.stockout}</strong></p>`;
      let paragraph = `<p>${itemTitle}</p>`;
      this.showError(`${heading + paragraph}`);
    }

    loadForm() {
      window
        .fetch(`${window.theme.routes.root_url}?section_id=api-cart-items`)
        .then(this.handleErrors)
        .then((response) => {
          return response.text();
        })
        .then((response) => {
          const fresh = document.createElement('div');
          fresh.innerHTML = response;
          this.items.innerHTML = fresh.querySelector('[data-api-content]').innerHTML;

          this.showForm();
          this.initQuantity();
          this.initUpsell();
          this.updateTotal();
        });
    }

    initUpsell() {
      const upsellProduct = this.items.querySelector(selectors$v.upsellProduct);
      const oldUpsellProduct = this.bottom.querySelector(selectors$v.upsellProduct);

      if (oldUpsellProduct) {
        oldUpsellProduct.remove();
      }

      if (this.cartPage && upsellProduct) {
        this.bottom.insertBefore(upsellProduct, this.bottom.firstChild);
      }
    }

    initQuantity() {
      initQtySection(this.container);
      this.initInputs();
      this.initRemove();
    }

    showForm() {
      if (this.bar) {
        this.bar.classList.remove(classes$g.hidden);
      }
      if (this.ship) {
        this.ship.classList.remove(classes$g.hidden);
      }
      if (this.progress) {
        this.progress.classList.remove(classes$g.hidden);
      }
      this.form.classList.remove(classes$g.hidden);
      this.bottom.classList.remove(classes$g.hidden);
      this.loader.classList.remove(classes$g.loading);
      this.emptystate.classList.add(classes$g.hidden);
    }

    showEmpty() {
      if (this.bar) {
        this.bar.classList.add(classes$g.hidden);
      }
      if (this.ship) {
        this.ship.classList.add(classes$g.hidden);
      }
      if (this.progress) {
        this.progress.classList.add(classes$g.hidden);
      }
      this.emptystate.classList.remove(classes$g.hidden);
      this.loader.classList.remove(classes$g.loading);
      this.form.classList.add(classes$g.hidden);
      this.bottom.classList.add(classes$g.hidden);
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  const cartDrawer = {
    onLoad() {
      const isDrawerCart = this.container.querySelector(selectors$v.drawer);
      if (isDrawerCart) {
        this.cart = new CartItems(this);
      }

      const hasShipping = this.container.querySelector(selectors$v.shipping);
      if (hasShipping) {
        new ShippingCalculator(this);
      }
    },
    onUnload: function () {
      if (this.cart && typeof this.cart.unload === 'function') {
        this.cart.unload();
      }
    },
  };

  const selectors$u = {
    accordionGroup: '[data-accordion-group]',
    accordionToggle: 'data-accordion-trigger',
    accordionBody: '[data-accordion-body]',
    accordionBodyMobile: 'data-accordion-body-mobile',
    rangeSlider: 'data-range-holder',
    section: '[data-section-id]',
  };

  const classes$f = {
    open: 'accordion-is-open',
  };

  let sections$c = {};

  class Accordion {
    constructor(el) {
      this.body = el;
      this.key = this.body.id;
      const btnSelector = `[${selectors$u.accordionToggle}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);

      this.toggleEvent = (e) => this.clickEvents(e);
      this.keyboardEvent = (e) => this.keyboardEvents(e);
      this.hideEvent = () => this.hideEvents();

      this.syncBodies = this.getSiblings();

      if (this.body.hasAttribute(selectors$u.accordionBodyMobile)) {
        this.mobileAccordions();
      } else {
        this.init();
      }
    }

    mobileAccordions() {
      if (window.innerWidth < window.theme.sizes.medium) {
        this.init();
        this.setDefaultState();
      } else {
        this.resetMobileAccordions();
        this.body.removeAttribute('style');
      }

      document.addEventListener('theme:resize', () => {
        if (window.innerWidth < window.theme.sizes.medium) {
          this.init();
          this.setDefaultState();
        } else {
          this.resetMobileAccordions();
          this.body.removeAttribute('style');
        }
      });
    }

    init() {
      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.setDefaultState();

      this.trigger.addEventListener('click', this.toggleEvent);
      this.body.addEventListener('keyup', this.keyboardEvent);
      this.body.addEventListener('theme:accordion:close', this.hideEvent);
    }

    hideEvents() {
      this.hideAccordion();
    }

    clickEvents(e) {
      e.preventDefault();
      this.toggleState();
    }

    keyboardEvents(e) {
      if (e.which !== window.theme.keyboardKeys.ESCAPE) {
        return;
      }
      this.hideAccordion();
      this.trigger.focus();
    }

    resetMobileAccordions() {
      this.trigger.removeEventListener('click', this.toggleEvent);
      this.body.removeEventListener('keyup', this.keyboardEvent);
      this.body.removeEventListener('theme:accordion:close', this.hideEvent);
    }

    setDefaultState() {
      if (this.trigger.classList.contains(classes$f.open)) {
        showElement(this.body);
      } else {
        this.hideAccordion();
      }
    }

    getSiblings() {
      const section = this.body.closest(selectors$u.section);
      const groupsArray = [...section.querySelectorAll(selectors$u.accordionGroup)];
      const syncWrapper = groupsArray.filter((el) => el.contains(this.body)).shift();
      if (syncWrapper) {
        const allChilden = [...syncWrapper.querySelectorAll(selectors$u.accordionBody)];
        const onlySiblings = allChilden.filter((el) => !el.contains(this.body));
        return onlySiblings;
      } else return [];
    }

    closeSiblings() {
      this.syncBodies.forEach((accordionBody) => {
        accordionBody.dispatchEvent(new CustomEvent('theme:accordion:close', {bubbles: false}));
      });
    }

    toggleState() {
      if (this.trigger.classList.contains(classes$f.open)) {
        this.hideAccordion();
      } else {
        this.showAccordion();
        this.closeSiblings();

        // Collection filters
        // Accordion with range slider custom event to reload
        if (this.body.hasAttribute(selectors$u.rangeSlider)) {
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('theme:reset-price-range', {bubbles: false}));
          }, 400);
        }
      }
    }

    hideAccordion() {
      this.trigger.classList.remove(classes$f.open);
      slideUp(this.body);
    }

    showAccordion() {
      this.trigger.classList.add(classes$f.open);
      slideDown(this.body);

      setTimeout(() => {
        this.checkInViewportAndScrollTo();
      }, 600);
    }

    checkInViewportAndScrollTo() {
      const rect = this.trigger.getBoundingClientRect();
      const windowScrollY = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
      const inViewport =
        rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);

      if (!inViewport) {
        window.scrollTo({
          top: windowScrollY + rect.top,
          left: 0,
          behavior: 'smooth',
        });
      }
    }

    onBlockSelect(evt) {
      if (this.body.contains(evt.target)) {
        this.showAccordion();
      }
    }

    onBlockDeselect(evt) {
      if (this.body.contains(evt.target)) {
        this.hideAccordion();
      }
    }
  }

  const accordion = {
    onLoad() {
      sections$c[this.id] = [];
      const els = this.container.querySelectorAll(selectors$u.accordionBody);
      els.forEach((el) => {
        sections$c[this.id].push(new Accordion(el));
      });
    },
    onUnload: function () {
      sections$c[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
    onSelect: function () {
      if (this.type === 'accordion-single') {
        this.container.querySelector(`[${selectors$u.accordionToggle}]`).click();
      }
    },
    onDeselect: function () {
      if (this.type === 'accordion-single') {
        this.container.querySelector(`[${selectors$u.accordionToggle}]`).click();
      }
    },
    onBlockSelect(evt) {
      sections$c[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$c[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
  };

  const selectors$t = {
    saleClass: 'on-sale',
    soldClass: 'sold-out',
  };

  function formatPrices(product) {
    // Apprend classes for on sale and sold out
    const on_sale = product.price < product.compare_at_price_min;
    let classes = on_sale ? selectors$t.saleClass : '';
    classes += product.available ? '' : selectors$t.soldClass;
    // Add 'from' before min prive if price varies
    product.price = themeCurrency.formatMoney(product.price, theme.moneyFormat);
    if (product.prive_varies) {
      let min = themeCurrency.formatMoney(product.price_min, theme.moneyFormat);
      product.price = `${window.theme.strings.from} ${min}`;
    }

    const formatted = {
      ...product,
      classes,
      on_sale,
      sold_out: !product.available,
      sold_out_translation: window.theme.strings.soldOut,
      compare_at_price: themeCurrency.formatMoney(product.compare_at_price_min, theme.moneyFormat),
      compare_at_price_max: themeCurrency.formatMoney(product.compare_at_price_max, theme.moneyFormat),
      compare_at_price_min: themeCurrency.formatMoney(product.compare_at_price_min, theme.moneyFormat),
      price_max: themeCurrency.formatMoney(product.price_max, theme.moneyFormat),
      price_min: themeCurrency.formatMoney(product.price_min, theme.moneyFormat),
    };
    return formatted;
  }

  const selectors$s = {
    wrapper: '[data-search-popdown-wrap]',
    results: '[data-predictive-search-results]',
    input: '[data-predictive-search-input]',
    productTemplate: '[data-search-product-template]',
    otherTemplate: '[data-search-other-template]',
    titleTemplate: '[data-predictive-search-title-template]',
    ariaTemplate: '[data-predictive-search-aria-template]',
    productTitleWrapper: '[data-product-title-wrap]',
    productWrapper: '[data-product-wrap]',
    collectionWrapper: '[data-collection-wrap]',
    articleWrapper: '[data-article-wrap]',
    pageWrapper: '[data-page-wrap]',
    ariaWrapper: '[data-predictive-search-aria]',
    outerWrapper: '[data-popdown-outer]',
    loader: '[data-loading-indicator]',
    dirtyClass: 'dirty',
    noResults: 'search--empty',
  };

  let sections$b = {};

  Sqrl__namespace.filters.define('animationDelay', function (index) {
    return index * 90 + 10;
  });

  class SearchPredictive {
    constructor(wrapper) {
      this.wrapper = wrapper;
      this.input = this.wrapper.querySelector(selectors$s.input);
      this.loader = this.wrapper.querySelector(selectors$s.loader);
      this.results = this.wrapper.querySelector(selectors$s.results);
      this.outer = this.input.closest(selectors$s.outerWrapper);

      this.productTemplate = this.wrapper.querySelector(selectors$s.productTemplate).innerHTML;
      this.otherTemplate = this.wrapper.querySelector(selectors$s.otherTemplate).innerHTML;
      this.titleTemplate = this.wrapper.querySelector(selectors$s.titleTemplate).innerHTML;
      this.ariaTemplate = this.wrapper.querySelector(selectors$s.ariaTemplate).innerHTML;

      this.productTitleWrapper = this.results.querySelector(selectors$s.productTitleWrapper);
      this.productWrapper = this.results.querySelector(selectors$s.productWrapper);
      this.collectionWrapper = this.results.querySelector(selectors$s.collectionWrapper);
      this.articleWrapper = this.results.querySelector(selectors$s.articleWrapper);
      this.pageWrapper = this.results.querySelector(selectors$s.pageWrapper);
      this.ariaWrapper = this.results.querySelector(selectors$s.ariaWrapper);

      this.initSearch();
    }

    initSearch() {
      this.input.addEventListener(
        'input',
        debounce(
          function (event) {
            const val = event.target.value;
            if (val && val.length > 1) {
              this.loader.style.display = 'block';
              this.render(val);
            } else {
              this.resetTemplates();
              this.outer.classList.remove(selectors$s.dirtyClass);
            }
          }.bind(this),
          300
        )
      );
      this.input.addEventListener('clear', this.reset.bind(this));
    }

    render(terms) {
      let resources = '';
      resources += window.theme.settings.search_products ? 'product,' : '';
      resources += window.theme.settings.search_collections ? 'collection,' : '';
      resources += window.theme.settings.search_articles ? 'article,' : '';
      resources += window.theme.settings.search_pages ? 'page,' : '';
      resources = resources.slice(0, -1);
      const serialized = `/search/suggest.json?q=${terms}&resources[type]=${resources}&resources[options][unavailable_products]=last`;
      fetch(serialized)
        .then(this.handleErrors)
        .then((response) => response.json())
        .then((response) => {
          this.resetTemplates();
          this.outer.classList.add(selectors$s.dirtyClass);
          const results = response.resources.results;
          const combined = [];
          for (const key in results) {
            if ({}.hasOwnProperty.call(results, key)) {
              combined.push(...results[key]);
            }
          }
          if (combined.length) {
            this.outer.classList.remove(selectors$s.noResults);
            this.injectOther(results);
            this.injectProduct(results.products);
          } else {
            this.noResults(terms);
          }
          this.injectAria(terms, combined);
          trapFocus(this.outer, {elementToFocus: this.input});
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.loader.style.display = 'none';
        });
    }

    injectAria(terms, combined) {
      let title = window.theme.strings.noResultsFor;
      let count = null;
      if (combined.length) {
        count = combined.length;
        title = window.theme.strings.resultsFor;
      }
      this.ariaWrapper.innerHTML = Sqrl__namespace.render(this.ariaTemplate, {
        count: count,
        title: title,
        query: terms,
      });
    }

    noResults() {
      this.resetTemplates();
      this.outer.classList.add(selectors$s.dirtyClass);
      this.outer.classList.add(selectors$s.noResults);
    }

    resetTemplates() {
      this.productTitleWrapper.innerHTML = '';
      this.collectionWrapper.innerHTML = '';
      this.articleWrapper.innerHTML = '';
      this.productWrapper.innerHTML = '';
      this.pageWrapper.innerHTML = '';
      this.ariaWrapper.innerHTML = '';
    }

    reset() {
      this.resetTemplates();
      this.outer.classList.remove(selectors$s.dirtyClass);
      this.outer.classList.remove(selectors$s.noResults);
      this.input.val = '';
    }

    injectOther(results) {
      this.productTitleWrapper.innerHTML += Sqrl__namespace.render(this.titleTemplate, {
        title: window.theme.strings.products,
        count: results.products.length,
      });
      if (results.collections && results.collections.length) {
        this.collectionWrapper.innerHTML += Sqrl__namespace.render(this.titleTemplate, {
          title: window.theme.strings.collections,
          count: results.collections.length,
        });
        this.collectionWrapper.innerHTML += Sqrl__namespace.render(this.otherTemplate, results.collections);
      }
      if (results.pages && results.pages.length) {
        this.pageWrapper.innerHTML += Sqrl__namespace.render(this.titleTemplate, {
          title: window.theme.strings.pages,
          count: results.pages.length,
        });
        this.pageWrapper.innerHTML += Sqrl__namespace.render(this.otherTemplate, results.pages);
      }
      if (results.articles && results.articles.length) {
        this.articleWrapper.innerHTML += Sqrl__namespace.render(this.titleTemplate, {
          title: window.theme.strings.articles,
          count: results.articles.length,
        });
        this.articleWrapper.innerHTML += Sqrl__namespace.render(this.otherTemplate, results.articles);
      }
    }

    injectProduct(products) {
      let formatted = [];
      products.forEach((p) => {
        let product = p;
        product = formatPrices(product);
        product.image = null;
        if (product.featured_image) {
          product.thumb = getSizedImageUrl(product.featured_image.url, '360x360');
        }
        formatted.push(product);
      });
      const productHTML = Sqrl__namespace.render(this.productTemplate, formatted);
      this.productWrapper.innerHTML += productHTML;
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  const searchResultsGlobal = {
    onLoad() {
      sections$b[this.id] = [];
      const els = document.querySelectorAll(selectors$s.wrapper);
      els.forEach((el) => {
        sections$b[this.id].push(new SearchPredictive(el));
      });
    },
    onUnload: function () {
      sections$b[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$r = {
    outer: '[data-drawer-search]',
    wrapper: '[data-search-popdown-wrap]',
    input: '[data-predictive-search-input]',
    clear: '[data-clear-input]',
  };

  class SearchDrawer {
    constructor(section) {
      this.outer = section.container.querySelector(selectors$r.outer);
      if (this.outer) {
        this.wrapper = this.outer.querySelector(selectors$r.wrapper);
        this.input = this.outer.querySelector(selectors$r.input);
        this.clear = this.outer.querySelector(selectors$r.clear);
        this.init();
      }
    }

    init() {
      this.clear.addEventListener(
        'click',
        function (evt) {
          evt.preventDefault();
          this.clearInput();
        }.bind(this)
      );
    }

    clearInput() {
      this.input.value = '';
      this.input.dispatchEvent(new CustomEvent('clear', {bubbles: false}));
      this.input.focus();
    }
  }

  const searchDrawer = {
    onLoad() {
      this.searchDrawer = new SearchDrawer(this);
    },
    onUnload: function () {
      if (this.searchDrawer && typeof this.searchDrawer.unload === 'function') {
        this.searchDrawer.unload();
      }
    },
  };

  const selectors$q = {
    slideruleOpen: 'data-sliderule-open',
    slideruleClose: 'data-sliderule-close',
    sliderulePane: 'data-sliderule-pane',
    slideruleWrappper: '[data-sliderule]',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    dataAnimates: 'data-animates',
    children: `:scope > [data-animates], 
             :scope > * > [data-animates], 
             :scope > * > * >[data-animates],
             :scope .sliderule-grid  > *`,
  };

  const classes$e = {
    isVisible: 'is-visible',
    isHiding: 'is-hiding',
    isHidden: 'is-hidden',
  };

  let sections$a = {};

  class HeaderMobileSliderule {
    constructor(el) {
      this.sliderule = el;
      this.wrapper = el.closest(selectors$q.wrapper);
      this.key = this.sliderule.id;
      const btnSelector = `[${selectors$q.slideruleOpen}='${this.key}']`;
      const exitSelector = `[${selectors$q.slideruleClose}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.exit = document.querySelectorAll(exitSelector);
      this.pane = document.querySelector(`[${selectors$q.sliderulePane}]`);
      this.children = this.sliderule.querySelectorAll(selectors$q.children);

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.clickEvents();
      this.staggerChildAnimations();

      document.addEventListener('theme:sliderule:close', this.closeSliderule.bind(this));
    }

    clickEvents() {
      this.trigger.addEventListener(
        'click',
        function () {
          this.showSliderule();
        }.bind(this)
      );
      this.exit.forEach((element) => {
        element.addEventListener(
          'click',
          function () {
            this.hideSliderule();
          }.bind(this)
        );
      });
    }

    keyboardEvents() {
      this.trigger.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.SPACE) {
            return;
          }
          this.showSliderule();
        }.bind(this)
      );
      this.sliderule.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideSliderule();
          this.buttons[0].focus();
        }.bind(this)
      );
    }

    staggerChildAnimations(reverse = false) {
      const childrenArr = reverse ? Array.prototype.slice.call(this.children).slice().reverse() : this.children;

      childrenArr.forEach((child, index) => {
        child.style.transitionDelay = index * 50 + 10 + 'ms';
      });
    }

    hideSliderule(close = false) {
      const paneStyle = window.getComputedStyle(this.pane);
      const paneTransitionDuration = parseFloat(paneStyle.getPropertyValue('transition-duration')) * 1000;
      const children = close ? this.pane.querySelectorAll(`.${classes$e.isVisible}`) : this.children;
      this.pane.style.setProperty('--sliderule-height', 'auto');
      this.staggerChildAnimations(true);
      this.pane.classList.add(classes$e.isHiding);
      this.sliderule.classList.add(classes$e.isHiding);
      this.sliderule.classList.remove(classes$e.isVisible);
      children.forEach((el) => {
        el.classList.remove(classes$e.isVisible);
      });
      const newPosition = parseInt(this.pane.dataset.sliderulePane, 10) - 1;
      this.pane.setAttribute(selectors$q.sliderulePane, newPosition);
      const hidedSelector = close ? `[${selectors$q.dataAnimates}].${classes$e.isHidden}` : `[${selectors$q.dataAnimates}="${newPosition}"].${classes$e.isHidden}`;
      const hidedItems = this.pane.querySelectorAll(hidedSelector);
      if (hidedItems.length) {
        hidedItems.forEach((element) => {
          element.classList.remove(classes$e.isHidden);
        });
      }

      setTimeout(() => {
        this.pane.classList.remove(classes$e.isHiding);
        this.sliderule.classList.remove(classes$e.isHiding);
        this.staggerChildAnimations();
      }, paneTransitionDuration);
    }

    showSliderule() {
      this.pane.style.setProperty('--sliderule-height', 'auto');
      this.sliderule.classList.add(classes$e.isVisible);
      this.children.forEach((el) => {
        el.classList.add(classes$e.isVisible);
      });
      const oldPosition = parseInt(this.pane.dataset.sliderulePane, 10);
      const newPosition = oldPosition + 1;
      this.pane.setAttribute(selectors$q.sliderulePane, newPosition);
      const hidedItems = this.pane.querySelectorAll(`[${selectors$q.dataAnimates}="${oldPosition}"]`);
      if (hidedItems.length) {
        const hidedItemsTransition = parseFloat(window.getComputedStyle(hidedItems[0]).getPropertyValue('transition-duration')) * 1000;
        setTimeout(() => {
          hidedItems.forEach((element) => {
            element.classList.add(classes$e.isHidden);
          });
        }, hidedItemsTransition);
      }

      const newHeight = parseInt(this.trigger.nextElementSibling.offsetHeight);
      this.pane.style.setProperty('--sliderule-height', `${newHeight}px`);
    }

    closeSliderule() {
      if (this.pane && this.pane.hasAttribute(selectors$q.sliderulePane) && parseInt(this.pane.getAttribute(selectors$q.sliderulePane)) > 0) {
        this.hideSliderule(true);
        if (parseInt(this.pane.getAttribute(selectors$q.sliderulePane)) > 0) {
          this.pane.setAttribute(selectors$q.sliderulePane, 0);
        }
      }
    }
  }

  const headerMobileSliderule = {
    onLoad() {
      sections$a[this.id] = [];
      const els = this.container.querySelectorAll(selectors$q.slideruleWrappper);
      els.forEach((el) => {
        sections$a[this.id].push(new HeaderMobileSliderule(el));
      });
    },
  };

  const selectors$p = {
    wrapper: '[data-product-add-popdown-wrapper]',
    closeDrawer: '[data-close-popdown]',
    apiContent: '[data-api-content]',
    cartSectionAjax: '[data-ajax-disable="false"]',
    ajaxDisabled: '[data-ajax-disable="true"]',
  };

  var globalTimer;

  class CartPopdown {
    constructor() {
      this.drawer = document.querySelector(selectors$p.wrapper);
      this.cartSectionAjax = document.querySelector(selectors$p.cartSectionAjax);
      this.ajaxDisabled = document.querySelector(selectors$p.ajaxDisabled);
      document.addEventListener('theme:cart:popdown', (e) => {
        if (this.cartSectionAjax) {
          // if we are on the cart page, refresh the cart without popdown
          this.cartSectionAjax.dispatchEvent(new CustomEvent('theme:cart:reload', {bubbles: true}));
        } else if (this.ajaxDisabled) {
          // ajax is disabled, refresh the whole page
          window.location.reload();
        } else {
          this.renderPopdown(e);
        }
      });
    }

    renderPopdown(event) {
      const variant = event.detail.variant;
      const url = `${window.theme.routes.root_url}variants/${variant.id}/?section_id=api-product-popdown`;
      const instance = this;
      axios
        .get(url)
        .then(function (response) {
          // handle success
          const fresh = document.createElement('div');
          fresh.innerHTML = response.data;
          instance.drawer.innerHTML = fresh.querySelector('[data-api-content]').innerHTML;
          instance.connectCartButton();
          instance.connectCloseButton();
        })
        .catch(function (error) {
          console.warn(error);
        });
    }

    connectCloseButton() {
      // Enable close button
      this.drawer.classList.add('is-visible');
      const closer = this.drawer.querySelector(selectors$p.closeDrawer);
      closer.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          this.drawer.classList.remove('is-visible');
        }.bind(this)
      );
      this.popdownTimer();
    }

    connectCartButton() {
      // Hook into cart drawer
      const cartButton = this.drawer.querySelector('[data-drawer-toggle="drawer-cart"]');
      const cartDrawer = document.querySelector('[data-drawer="drawer-cart"]');

      if (cartDrawer) {
        cartButton.addEventListener(
          'click',
          function (e) {
            e.preventDefault();
            this.drawer.classList.remove('is-visible');
            cartDrawer.dispatchEvent(
              new CustomEvent('theme:drawer:open', {
                bubbles: false,
              })
            );
          }.bind(this)
        );
      }
    }

    popdownTimer() {
      clearTimeout(globalTimer);
      globalTimer = setTimeout(() => {
        this.drawer.classList.remove('is-visible');
      }, 5000);
    }
  }

  const cartPopdown = {
    onLoad() {
      new CartPopdown(this);
    },
  };

  const selectors$o = {
    wrapper: '[data-header-wrapper]',
    style: 'data-header-style',
    widthContent: '[data-takes-space]',
    desktop: '[data-header-desktop]',
    cloneClass: 'js__header__clone',
    showMobileClass: 'js__show__mobile',
    backfill: '[data-header-backfill]',
    transparent: 'data-header-transparent',
    overrideBorder: 'header-override-border',
    firstSectionHasImage: '.main-content > .shopify-section:first-child [data-overlay-header]',
    preventTransparentHeader: '.main-content > .shopify-section:first-child [data-prevent-transparent-header]',
    deadLink: '.navlink[href="#"]',
  };

  let sections$9 = {};

  class Header {
    constructor(el) {
      this.wrapper = el;
      this.style = this.wrapper.dataset.style;
      this.desktop = this.wrapper.querySelector(selectors$o.desktop);
      this.transparent = this.wrapper.getAttribute(selectors$o.transparent) !== 'false';
      this.overlayedImages = document.querySelectorAll(selectors$o.firstSectionHasImage);
      this.deadLinks = document.querySelectorAll(selectors$o.deadLink);

      this.killDeadLinks();
      if (this.style !== 'drawer' && this.desktop) {
        this.minWidth = this.getMinWidth();
        this.listenWidth();
      }
      this.checkForImage();
      window.dispatchEvent(new Event('resize'));
      document.addEventListener('header:check', this.checkForImage.bind(this));
    }

    unload() {
      document.removeEventListener('theme:resize', this.checkWidth);
    }

    checkForImage() {
      this.overlayedImages = document.querySelectorAll(selectors$o.firstSectionHasImage);
      let preventTransparentHeader = document.querySelectorAll(selectors$o.preventTransparentHeader).length;

      if (this.overlayedImages.length && !preventTransparentHeader && this.transparent) {
        // is transparent and has image, overlay the image
        document.querySelector(selectors$o.backfill).style.display = 'none';
        this.listenOverlay();
      } else {
        this.wrapper.setAttribute(selectors$o.transparent, false);
      }

      if (this.overlayedImages.length && !preventTransparentHeader && !this.transparent) {
        // Have image but not transparent, remove border bottom
        this.wrapper.classList.add(selectors$o.overrideBorder);
        this.subtractHeaderHeight();
      }
    }

    listenOverlay() {
      document.addEventListener('theme:resize', this.checkWidth.bind(this));
      this.subtractAnnouncementHeight();
    }

    listenWidth() {
      document.addEventListener('theme:resize', this.checkWidth.bind(this));
      this.checkWidth();
    }

    killDeadLinks() {
      this.deadLinks.forEach((el) => {
        el.onclick = (e) => {
          e.preventDefault();
        };
      });
    }

    subtractAnnouncementHeight() {
      const {windowHeight, announcementHeight} = readHeights();
      this.overlayedImages.forEach((el) => {
        el.style.setProperty('--full-screen', `${windowHeight - announcementHeight}px`);
        el.classList.add('has-overlay');
      });
    }

    subtractHeaderHeight() {
      const {windowHeight, headerHeight} = readHeights();
      this.overlayedImages.forEach((el) => {
        el.style.setProperty('--full-screen', `${windowHeight - headerHeight}px`);
      });
    }

    checkWidth() {
      if (document.body.clientWidth < this.minWidth) {
        this.wrapper.classList.add(selectors$o.showMobileClass);
      } else {
        this.wrapper.classList.remove(selectors$o.showMobileClass);
      }
    }

    getMinWidth() {
      const comparitor = this.wrapper.cloneNode(true);
      comparitor.classList.add(selectors$o.cloneClass);
      document.body.appendChild(comparitor);
      const wideElements = comparitor.querySelectorAll(selectors$o.widthContent);
      let minWidth = 0;
      if (wideElements.length === 3) {
        minWidth = _sumSplitWidths(wideElements);
      } else {
        minWidth = _sumWidths(wideElements);
      }
      document.body.removeChild(comparitor);
      return minWidth + wideElements.length * 20;
    }
  }

  function _sumSplitWidths(nodes) {
    let arr = [];
    nodes.forEach((el) => {
      arr.push(el.clientWidth);
    });
    if (arr[0] > arr[2]) {
      arr[2] = arr[0];
    } else {
      arr[0] = arr[2];
    }
    const width = arr.reduce((a, b) => a + b);
    return width;
  }
  function _sumWidths(nodes) {
    let width = 0;
    nodes.forEach((el) => {
      width += el.clientWidth;
    });
    return width;
  }

  const header = {
    onLoad() {
      sections$9 = new Header(this.container);
    },
    onUnload: function () {
      if (typeof sections$9.unload === 'function') {
        sections$9.unload();
      }
    },
  };

  register('header', [
    header,
    drawer,
    headerMobileSliderule,
    stickyHeader,
    hoverDisclosure,
    hoverUnderline,
    headerTotals,
    searchPopdown,
    searchResultsGlobal,
    searchDrawer,
    swatchGridSection,
    cartDrawer,
    cartPopdown,
    accordion,
  ]);

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  const footerSection = {
    onLoad() {
      // Lighthouse fires security warning for the Shopify link.
      var shopifyLink = document.querySelector('[data-powered-link] a');
      if (shopifyLink) {
        shopifyLink.setAttribute('rel', 'noopener');
      }
    },
  };

  register('footer', [footerSection, accordion]);

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  function isTouch() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    document.documentElement.classList.toggle('supports-touch', isTouch);

    return isTouch;
  }

  isTouch();

  const defaultOptions$1 = {
    cc_load_policy: 1,
    iv_load_policy: 3,
    modestbranding: 1,
    playsinline: 1,
    controls: 1,
    showinfo: 0,
    ecver: 2,
    fs: 1,
    rel: 0,
  };

  function embedYoutube(uniqueKey, options) {
    const playerOptions = {
      ...defaultOptions$1,
      ...options,
    };
    const playerWrapper = document.querySelector(`[data-player="${uniqueKey}"]`);
    const playerElement = playerWrapper.querySelector('iframe, [data-replace]');
    const youtubeKey = playerWrapper.querySelector('[data-video-id]').getAttribute('data-video-id');
    loadScript({url: 'https://www.youtube.com/iframe_api'});
    const playerPromise = window.youtubeLoaderPromise
      .then(function () {
        let player = new window.YT.Player(playerElement, {
          videoId: youtubeKey,
          playerVars: {
            ...playerOptions,
          },
        });
        playerWrapper.addEventListener('pause', function () {
          try {
            if (player.pauseVideo) {
              player.pauseVideo();
            }
          } catch (e) {
            console.warn(e);
          }
        });
        playerWrapper.addEventListener('play-desktop', function () {
          if (!isTouch()) {
            playerWrapper.dispatchEvent(new Event('play'));
          }
        });
        playerWrapper.addEventListener('play', function () {
          try {
            if (player.playVideo) {
              player.playVideo();
            } else {
              player.addEventListener('onReady', function (event) {
                event.target.playVideo();
              });
            }
          } catch (e) {
            console.warn(e);
          }
        });
        playerWrapper.addEventListener('destroy', function () {
          try {
            if (player.destroy) {
              player.destroy();
            }
          } catch (e) {
            console.warn(e);
          }
        });
        return player;
      })
      .catch(function (err) {
        console.error(err);
      });
    return playerPromise;
  }

  window.youtubeLoaderPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = function () {
      resolve();
    };
  });

  const defaultOptions = {
    autoplay: true,
    loop: true,
    controls: true,
    muted: false,
    playsinline: true,
  };

  function embedVimeo(uniqueKey, options) {
    const playerOptions = {
      ...defaultOptions,
      ...options,
    };
    const playerWrapper = document.querySelector(`[data-player="${uniqueKey}"]`);
    const playerElement = playerWrapper.querySelector('iframe, [data-replace]');
    const vimeoKey = playerWrapper.querySelector('[data-video-id]').getAttribute('data-video-id');
    const loadedPromise = loadScript({url: 'https://player.vimeo.com/api/player.js'});
    const vimeoSelector = `select-${uniqueKey}`;
    playerElement.setAttribute('id', vimeoSelector);
    const returnPlayer = loadedPromise
      .then(function () {
        const player = new window.Vimeo.Player(vimeoSelector, {
          ...playerOptions,
          id: vimeoKey,
        });
        playerWrapper.addEventListener('pause', function () {
          try {
            if (player.pause) {
              player.pause();
            }
          } catch (e) {
            console.warn(e);
          }
        });
        playerWrapper.addEventListener('play-desktop', function () {
          if (!isTouch()) {
            playerWrapper.dispatchEvent(new Event('play'));
          }
        });
        playerWrapper.addEventListener('play', function () {
          if (player.play) {
            player.play();
          }
        });
        playerWrapper.addEventListener('destroy', function () {
          try {
            if (player.destroy) {
              player.destroy();
            }
          } catch (e) {
            console.log(e);
          }
        });
        return player;
      })
      .catch(function (err) {
        console.error(err);
      });
    return returnPlayer;
  }

  const selectors$n = {
    videoPopup: '[data-video-popup]',
    videoAutoplay: '[data-video-autoplay]',
    attrUnique: 'data-unique',
    attrVideoId: 'data-video-id',
    attrVideoType: 'data-video-type',
    attrPlayer: 'data-player',
  };

  class PopupVideo {
    constructor(section) {
      this.container = section.container;
      this.triggers = this.container.querySelectorAll(selectors$n.videoPopup);
      this.backgroundVideo = this.container.querySelector(selectors$n.videoAutoplay);

      this.init();
    }

    init() {
      this.triggers.forEach((trigger) => {
        const unique = trigger.getAttribute(selectors$n.attrUnique);
        const video = trigger.getAttribute(selectors$n.attrVideoId);
        const type = trigger.getAttribute(selectors$n.attrVideoType);

        // Find the modal body, which has been moved to the document root
        // and append a unique ID for youtube and vimeo to init players.
        const uniqueKey = `${video}-${unique}`;
        const player = document.querySelector(`[${selectors$n.attrPlayer}="${uniqueKey}"]`);

        // Modal Event Logic:
        // When a modal opens it creates and plays the video
        // When a modal opens it pauses background videos in this section
        // --
        // When a modal closes it destroys the player
        // When a modal closes it plays background videos anywhere on the page
        MicroModal.init({
          onShow: () => {
            if (this.backgroundVideo && typeof this.backgroundVideo.pause === 'function') {
              this.backgroundVideo.pause();
            }
            let playerPromise = {};
            if (type === 'youtube') {
              playerPromise = embedYoutube(uniqueKey);
            } else if (type === 'vimeo') {
              playerPromise = embedVimeo(uniqueKey);
            }
            playerPromise.then(() => {
              player.dispatchEvent(new CustomEvent('play'));
            });
          },
          onClose: (modal, el, event) => {
            event.preventDefault();
            player.dispatchEvent(new CustomEvent('destroy'));
            if (this.backgroundVideo && typeof this.backgroundVideo.play === 'function') {
              this.backgroundVideo.play();
            }
          },
          openTrigger: `data-trigger-${video}-${unique}`,
        });
      });
    }
  }

  const popupVideoSection = {
    onLoad() {
      new PopupVideo(this);
    },
  };

  const selectors$m = {
    button: '[data-scroll-down]',
  };

  class ScrollButton {
    constructor(el) {
      this.wrapper = el;
      this.init();
    }

    init() {
      const buttons = this.wrapper.querySelectorAll(selectors$m.button);
      if (buttons) {
        buttons.forEach((btn) => {
          btn.addEventListener('click', this.scroll.bind(this));
        });
      }
    }

    scroll() {
      const bottom = this.wrapper.offsetTop + this.wrapper.clientHeight;
      window.scroll({
        top: bottom,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  const scrollButton = {
    onLoad() {
      this.scrollButton = new ScrollButton(this.container);
    },
    onUnload: function () {
      delete this.scrollButton;
    },
  };

  register('video', [parallaxImage, scrollButton, popupVideoSection]);

  register('page-faq', accordion);

  register('hero', [parallaxImage, scrollButton]);

  const selectors$l = {
    slider: '[data-slider]',
    photo: '[data-grid-slide]',
  };

  const attributes = {
    showDots: 'data-show-dots',
  };

  const sections$8 = {};

  class Slider {
    constructor(container, el) {
      this.container = container;
      this.slideshow = el;

      this.pageDots = this.slideshow.getAttribute(attributes.showDots) === 'true';
      this.firstPhoto = this.container.querySelector(selectors$l.photo);
      const buttonOffset = this.firstPhoto.offsetHeight / 2;
      this.slideshow.style.setProperty('--buttons-top', `${buttonOffset}px`);

      if (!this.slideshow) return;

      this.flkty = null;

      this.init();
    }

    init() {
      const instance = this;
      const sliderOptions = {
        initialIndex: 0,
        accessibility: true,
        autoPlay: false,
        contain: true,
        pageDots: this.pageDots,
        adaptiveHeight: false,
        wrapAround: false,
        groupCells: true,
        cellAlign: 'left',
        freeScroll: true,
        prevNextButtons: true,
        draggable: true,
        rightToLeft: window.isRTL,
        arrowShape: {
          x0: 10,
          x1: 60,
          y1: 50,
          x2: 65,
          y2: 45,
          x3: 20,
        },
        on: {
          ready: function () {
            instance.removeIncorrectAria();
          },
        },
      };
      this.flkty = new Flickity(this.slideshow, sliderOptions);

      this.container.addEventListener('theme:tab:change', () => {
        this.flkty.resize();
      });
    }

    removeIncorrectAria() {
      const slidesHidden = this.slideshow.querySelectorAll('[aria-hidden="true"]');
      slidesHidden.forEach((el) => el.removeAttribute('aria-hidden'));
    }

    onUnload() {
      if (this.slideshow && this.flkty) {
        this.flkty.options.watchCSS = false;
        this.flkty.destroy();
      }
    }
  }

  const productSliderSection = {
    onLoad() {
      sections$8[this.id] = [];
      const els = this.container.querySelectorAll(selectors$l.slider);
      els.forEach((el) => {
        sections$8[this.id].push(new Slider(this.container, el));
      });
    },
    onUnload(e) {
      sections$8[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload(e);
        }
      });
    },
  };

  register('custom-content', [parallaxImage, popupVideoSection, swatchGridSection, productSliderSection]);

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  const sections$7 = [];
  const selectors$k = {
    wrapper: '[data-slideshow-wrapper]',
    speed: 'data-slideshow-speed',
    autoplay: 'data-slideshow-autoplay',
    slideCount: 'data-slideshow-slides',
    prevButton: '[data-slide-custom-prev]',
    nextButton: '[data-slide-custom-next]',
  };

  const classes$d = {
    isEnable: 'flickity-enabled',
  };

  class Slideshow {
    constructor(section) {
      this.container = section.container;
      this.wrapper = section.container.querySelector(selectors$k.wrapper);
      this.speed = this.wrapper.getAttribute(selectors$k.speed);
      this.autoplay = this.wrapper.getAttribute(selectors$k.autoplay) === 'true';
      this.slideCount = parseInt(this.wrapper.getAttribute(selectors$k.slideCount), 10);
      this.prevButtons = this.wrapper.querySelectorAll(selectors$k.prevButton);
      this.nextButtons = this.wrapper.querySelectorAll(selectors$k.nextButton);
      this.flkty = null;
      this.init();
    }

    init() {
      const settings = {
        autoPlay: this.autoplay && this.speed ? parseInt(this.speed) : false,
        contain: false,
        pageDots: true,
        adaptiveHeight: true,
        accessibility: true,
        wrapAround: this.slideCount > 1,
        prevNextButtons: false,
        draggable: true,
        fade: true,
        rightToLeft: window.isRTL,
      };
      this.flkty = new FlickityFade(this.wrapper, settings);

      if (this.prevButtons.length) {
        this.prevButtons.forEach((e) => {
          e.onclick = () => {
            this.flkty.previous(true, false);
          };
        });
      }
      if (this.nextButtons.length) {
        this.nextButtons.forEach((e) => {
          e.onclick = () => {
            this.flkty.next(true, false);
          };
        });
      }

      this.reload();
    }

    unload() {
      if (this.flkty && this.wrapper && this.wrapper.classList.contains(classes$d.isEnable)) {
        this.flkty.destroy();
      }
    }

    onBlockSelect(evt) {
      const indexEl = evt.target.closest('[data-slideshow-index]');
      const slideIndex = indexEl.getAttribute('data-slideshow-index');
      const select = parseInt(slideIndex);
      this.flkty.selectCell(select);
      this.flkty.stopPlayer();
    }

    onBlockDeselect() {
      if (this.autoplay) {
        this.flkty.playPlayer();
      }
    }

    reload() {
      this.wrapper.addEventListener('theme:slideshow:reload', () => {
        this.unload();
        this.init();
      });
    }
  }

  const slideshowSection = {
    onLoad() {
      sections$7[this.id] = new Slideshow(this);
    },
    onSelect(e) {
      preventOverflow(e.target);
    },
    onUnload() {
      if (typeof sections$7[this.id].unload === 'function') {
        sections$7[this.id].unload();
      }
    },
    onBlockSelect(evt) {
      if (typeof sections$7[this.id].onBlockSelect === 'function') {
        sections$7[this.id].onBlockSelect(evt);
      }
    },
    onBlockDeselect(evt) {
      if (typeof sections$7[this.id].onBlockSelect === 'function') {
        sections$7[this.id].onBlockDeselect(evt);
      }
    },
  };

  register('slideshow', [slideshowSection, parallaxImage, scrollButton]);

  const selectors$j = {
    rangeSlider: '[data-range-slider]',
    rangeDotLeft: '[data-range-left]',
    rangeDotRight: '[data-range-right]',
    rangeLine: '[data-range-line]',
    rangeHolder: '[data-range-holder]',
    dataMin: 'data-se-min',
    dataMax: 'data-se-max',
    dataMinValue: 'data-se-min-value',
    dataMaxValue: 'data-se-max-value',
    dataStep: 'data-se-step',
    dataFilterUpdate: 'data-range-filter-update',
    priceMin: '[data-field-price-min]',
    priceMax: '[data-field-price-max]',
  };

  const classes$c = {
    classInitialized: 'is-initialized',
  };

  class RangeSlider {
    constructor(section) {
      this.container = section.container;
      this.slider = section.querySelector(selectors$j.rangeSlider);

      if (this.slider) {
        this.onMoveEvent = (event) => this.onMove(event);
        this.onStopEvent = (event) => this.onStop(event);
        this.onStartEvent = (event) => this.onStart(event);
        this.startX = 0;
        this.x = 0;

        // retrieve touch button
        this.touchLeft = this.slider.querySelector(selectors$j.rangeDotLeft);
        this.touchRight = this.slider.querySelector(selectors$j.rangeDotRight);
        this.lineSpan = this.slider.querySelector(selectors$j.rangeLine);

        // get some properties
        this.min = parseFloat(this.slider.getAttribute(selectors$j.dataMin));
        this.max = parseFloat(this.slider.getAttribute(selectors$j.dataMax));

        this.step = 0.0;

        // normalize flag
        this.normalizeFact = 26;

        this.init();

        document.addEventListener('theme:reset-price-range', () => {
          this.setDefaultValues();
        });
      }
    }

    init() {
      this.setDefaultValues();

      // link events
      this.touchLeft.addEventListener('mousedown', this.onStartEvent);
      this.touchRight.addEventListener('mousedown', this.onStartEvent);
      this.touchLeft.addEventListener('touchstart', this.onStartEvent);
      this.touchRight.addEventListener('touchstart', this.onStartEvent);

      // initialize
      this.slider.classList.add(classes$c.classInitialized);
    }

    setDefaultValues() {
      // retrieve default values
      let defaultMinValue = this.min;
      if (this.slider.hasAttribute(selectors$j.dataMinValue)) {
        defaultMinValue = parseFloat(this.slider.getAttribute(selectors$j.dataMinValue));
      }
      let defaultMaxValue = this.max;

      if (this.slider.hasAttribute(selectors$j.dataMaxValue)) {
        defaultMaxValue = parseFloat(this.slider.getAttribute(selectors$j.dataMaxValue));
      }

      // check values are correct
      if (defaultMinValue < this.min) {
        defaultMinValue = this.min;
      }

      if (defaultMaxValue > this.max) {
        defaultMaxValue = this.max;
      }

      if (defaultMinValue > defaultMaxValue) {
        defaultMinValue = defaultMaxValue;
      }

      if (this.slider.getAttribute(selectors$j.dataStep)) {
        this.step = Math.abs(parseFloat(this.slider.getAttribute(selectors$j.dataStep)));
      }

      // initial reset
      this.reset();

      // usefull values, min, max, normalize fact is the width of both touch buttons
      this.maxX = this.slider.offsetWidth - this.touchRight.offsetWidth;
      this.selectedTouch = null;
      this.initialValue = this.lineSpan.offsetWidth - this.normalizeFact;

      // set defualt values
      this.setMinValue(defaultMinValue);
      this.setMaxValue(defaultMaxValue);
    }

    reset() {
      this.touchLeft.style.left = '0px';
      this.touchRight.style.left = this.slider.offsetWidth - this.touchLeft.offsetWidth + 'px';
      this.lineSpan.style.marginLeft = '0px';
      this.lineSpan.style.width = this.slider.offsetWidth - this.touchLeft.offsetWidth + 'px';
      this.startX = 0;
      this.x = 0;
    }

    setMinValue(minValue) {
      const ratio = (minValue - this.min) / (this.max - this.min);
      this.touchLeft.style.left = Math.ceil(ratio * (this.slider.offsetWidth - (this.touchLeft.offsetWidth + this.normalizeFact))) + 'px';
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';
      this.slider.setAttribute(selectors$j.dataMinValue, minValue);
    }

    setMaxValue(maxValue) {
      const ratio = (maxValue - this.min) / (this.max - this.min);
      this.touchRight.style.left = Math.ceil(ratio * (this.slider.offsetWidth - (this.touchLeft.offsetWidth + this.normalizeFact)) + this.normalizeFact) + 'px';
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';
      this.slider.setAttribute(selectors$j.dataMaxValue, maxValue);
    }

    onStart(event) {
      // Prevent default dragging of selected content
      event.preventDefault();
      let eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      if (event.currentTarget === this.touchLeft) {
        this.x = this.touchLeft.offsetLeft;
      } else {
        this.x = this.touchRight.offsetLeft;
      }

      this.startX = eventTouch.pageX - this.x;
      this.selectedTouch = event.currentTarget;
      this.slider.addEventListener('mousemove', this.onMoveEvent);
      this.slider.addEventListener('mouseup', this.onStopEvent);
      this.slider.addEventListener('touchmove', this.onMoveEvent);
      this.slider.addEventListener('touchend', this.onStopEvent);
    }

    onMove(event) {
      let eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      this.x = eventTouch.pageX - this.startX;

      if (this.selectedTouch === this.touchLeft) {
        if (this.x > this.touchRight.offsetLeft - this.selectedTouch.offsetWidth + 10) {
          this.x = this.touchRight.offsetLeft - this.selectedTouch.offsetWidth + 10;
        } else if (this.x < 0) {
          this.x = 0;
        }

        this.selectedTouch.style.left = this.x + 'px';
      } else if (this.selectedTouch === this.touchRight) {
        if (this.x < this.touchLeft.offsetLeft + this.touchLeft.offsetWidth - 10) {
          this.x = this.touchLeft.offsetLeft + this.touchLeft.offsetWidth - 10;
        } else if (this.x > this.maxX) {
          this.x = this.maxX;
        }
        this.selectedTouch.style.left = this.x + 'px';
      }

      // update line span
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';

      // write new value
      this.calculateValue();

      // call on change
      if (this.slider.getAttribute('on-change')) {
        const fn = new Function('min, max', this.slider.getAttribute('on-change'));
        fn(this.slider.getAttribute(selectors$j.dataMinValue), this.slider.getAttribute(selectors$j.dataMaxValue));
      }

      this.onChange(this.slider.getAttribute(selectors$j.dataMinValue), this.slider.getAttribute(selectors$j.dataMaxValue));
    }

    onStop(event) {
      this.slider.removeEventListener('mousemove', this.onMoveEvent);
      this.slider.removeEventListener('mouseup', this.onStopEvent);
      this.slider.removeEventListener('touchmove', this.onMoveEvent);
      this.slider.removeEventListener('touchend', this.onStopEvent);

      this.selectedTouch = null;

      // write new value
      this.calculateValue();

      // call did changed
      this.onChanged(this.slider.getAttribute(selectors$j.dataMinValue), this.slider.getAttribute(selectors$j.dataMaxValue));
    }

    onChange(min, max) {
      const rangeHolder = this.slider.closest(selectors$j.rangeHolder);
      if (rangeHolder) {
        const priceMin = rangeHolder.querySelector(selectors$j.priceMin);
        const priceMax = rangeHolder.querySelector(selectors$j.priceMax);

        if (priceMin && priceMax) {
          priceMin.value = min;
          priceMax.value = max;
        }
      }
    }

    onChanged(min, max) {
      if (this.slider.hasAttribute(selectors$j.dataFilterUpdate)) {
        this.slider.dispatchEvent(new CustomEvent('range:filter:update', {bubbles: true}));
      }
    }

    calculateValue() {
      const newValue = (this.lineSpan.offsetWidth - this.normalizeFact) / this.initialValue;
      let minValue = this.lineSpan.offsetLeft / this.initialValue;
      let maxValue = minValue + newValue;

      minValue = minValue * (this.max - this.min) + this.min;
      maxValue = maxValue * (this.max - this.min) + this.min;

      if (this.step !== 0.0) {
        let multi = Math.floor(minValue / this.step);
        minValue = this.step * multi;

        multi = Math.floor(maxValue / this.step);
        maxValue = this.step * multi;
      }

      if (this.selectedTouch === this.touchLeft) {
        this.slider.setAttribute(selectors$j.dataMinValue, minValue);
      }

      if (this.selectedTouch === this.touchRight) {
        this.slider.setAttribute(selectors$j.dataMaxValue, maxValue);
      }
    }
  }

  const throttle = (fn, wait) => {
    let prev, next;
    return function invokeFn(...args) {
      const now = Date.now();
      next = clearTimeout(next);
      if (!prev || now - prev >= wait) {
        // eslint-disable-next-line prefer-spread
        fn.apply(null, args);
        prev = now;
      } else {
        next = setTimeout(invokeFn.bind(null, ...args), wait - (now - prev));
      }
    };
  };

  const selectors$i = {
    filtersWrappper: '[data-filters]',
    filtersWrappperAttr: 'data-filters',
    underlay: '[data-filters-underlay]',
    filtersHideDesktop: 'data-default-hide',
    filtersToggle: 'data-filters-toggle',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    groupHeading: 'data-group-heading',
    showMore: 'data-show-more',
  };

  const classes$b = {
    show: 'drawer--visible',
    defaultVisible: 'filters--default-visible',
    hide: 'hidden',
    expand: 'is-expanded',
    hidden: 'is-hidden',
  };

  const sections$6 = {};

  class Filters {
    constructor(filters) {
      this.container = filters;
      this.underlay = this.container.querySelector(selectors$i.underlay);
      this.groupHeadings = this.container.querySelectorAll(`[${selectors$i.groupHeading}]`);
      this.showMoreButtons = this.container.querySelectorAll(`[${selectors$i.showMore}]`);
      const triggerKey = this.container.getAttribute(selectors$i.filtersWrappperAttr);
      const selector = `[${selectors$i.filtersToggle}='${triggerKey}']`;
      this.filtersToggleButtons = document.querySelectorAll(selector);

      this.connectToggleMemory = (evt) => this.connectToggleFunction(evt);
      this.connectShowHiddenOptions = (evt) => this.showHiddenOptions(evt);

      this.connectToggle();
      this.onFocusOut();
      this.expandingEvents();

      if (this.getShowOnLoad()) {
        this.showFilters();
      } else {
        this.hideFilters();
      }
    }

    unload() {
      if (this.filtersToggleButtons.length) {
        this.filtersToggleButtons.forEach((element) => {
          element.removeEventListener('click', this.connectToggleMemory);
        });
      }

      if (this.showMoreButtons.length) {
        this.showMoreButtons.forEach((button) => {
          button.removeEventListener('click', this.connectShowHiddenOptions);
        });
      }
    }

    expandingEvents() {
      if (this.showMoreButtons.length) {
        this.showMoreButtons.forEach((button) => {
          button.addEventListener('click', throttle(this.connectShowHiddenOptions, 500));
        });
      }
    }

    showHiddenOptions(evt) {
      const element = evt.target.hasAttribute(selectors$i.showMore) ? evt.target : evt.target.closest(`[${selectors$i.showMore}]`);

      element.classList.add(classes$b.hidden);

      element.previousElementSibling.querySelectorAll(`.${classes$b.hidden}`).forEach((option) => {
        option.classList.remove(classes$b.hidden);
      });
    }

    connectToggle() {
      this.filtersToggleButtons.forEach((button) => {
        button.addEventListener('click', this.connectToggleMemory.bind(this));
      });
    }

    connectToggleFunction(evt) {
      const ariaExpanded = evt.currentTarget.getAttribute('aria-expanded') === 'true';
      if (ariaExpanded) {
        this.hideFilters();
      } else {
        this.showFilters();
      }
    }

    onFocusOut() {
      this.container.addEventListener(
        'focusout',
        function (evt) {
          if (window.innerWidth >= window.theme.sizes.medium) {
            return;
          }
          const childInFocus = evt.currentTarget.contains(evt.relatedTarget);
          const isVisible = this.container.classList.contains(classes$b.show);
          const isFocusEnabled = document.body.classList.contains('focus-enabled');
          if (isFocusEnabled && isVisible && !childInFocus) {
            this.hideFilters();
          }
        }.bind(this)
      );

      this.container.addEventListener(
        'keyup',
        function (evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideFilters();
          this.filtersToggleButtons[0].focus();
        }.bind(this)
      );

      this.underlay.addEventListener(
        'click',
        function () {
          this.hideFilters();
        }.bind(this)
      );
    }

    getShowOnLoad() {
      const selector = `[${selectors$i.filtersHideDesktop}='false']`;
      const showOnDesktop = document.querySelector(selector);
      const isDesktop = window.innerWidth >= window.theme.sizes.medium;
      if (showOnDesktop && isDesktop) {
        return true;
      } else {
        return false;
      }
    }

    showFilters() {
      this.container.classList.remove(classes$b.hide);
      // animates after display none is removed
      setTimeout(() => {
        this.filtersToggleButtons.forEach((btn) => btn.setAttribute('aria-expanded', true));
        this.filtersToggleButtons.forEach((btn) => btn.classList.add(classes$b.show));
        this.container.classList.add(classes$b.show);
        this.container.querySelector(selectors$i.focusable).focus();
      }, 1);
    }

    hideFilters() {
      this.filtersToggleButtons.forEach((btn) => btn.setAttribute('aria-expanded', false));
      this.container.classList.remove(classes$b.show);
      this.container.classList.remove(classes$b.defaultVisible);
      this.filtersToggleButtons.forEach((btn) => btn.classList.remove(classes$b.show));
      this.filtersToggleButtons.forEach((btn) => btn.classList.remove(classes$b.defaultVisible));
      // adds display none after animations
      setTimeout(() => {
        if (!this.container.classList.contains(classes$b.show)) {
          this.container.classList.add(classes$b.hide);
        }
      }, 800);
    }
  }

  const collectionFiltersSidebar = {
    onLoad() {
      sections$6[this.id] = [];
      const wrappers = this.container.querySelectorAll(selectors$i.filtersWrappper);
      wrappers.forEach((wrapper) => {
        sections$6[this.id].push(new Filters(wrapper));
      });
    },
    onUnload: function () {
      sections$6[this.id].forEach((filters) => {
        if (typeof filters.unload === 'function') {
          filters.unload();
        }
      });
    },
  };

  const selectors$h = {
    collectionSidebar: '[data-collection-sidebar]',
    form: '[data-sidebar-filter-form]',
    inputs: 'input, select, label, textarea',
    priceMin: '[data-field-price-min]',
    priceMax: '[data-field-price-max]',
    priceMinValue: 'data-field-price-min',
    priceMaxValue: 'data-field-price-max',
    rangeMin: '[data-se-min-value]',
    rangeMax: '[data-se-max-value]',
    rangeMinValue: 'data-se-min-value',
    rangeMaxValue: 'data-se-max-value',
    productsContainer: '[data-products-grid]',
    filterUpdateUrlButton: '[data-filter-update-url]',
    activeFiltersHolder: '[data-active-filters]',
    activeFiltersCount: '[data-active-filters-count]',
    dataSort: 'data-sort-enabled',
    collectionTools: '[data-collection-tools]',
    swatch: '[data-swatch]',
    filtersWrappper: '[data-filters]',
    headerSticky: '[data-header-sticky="sticky"]',
    headerHeight: '[data-header-height]',
    gridLarge: 'data-grid-large',
    gridSmall: 'data-grid-small',
    showMore: '[data-show-more]',
    accordionBody: '[data-accordion-body]',
    checkedOption: 'input:checked',
    siblingsInnerHolder: '[data-sibling-inner]',
  };

  const classes$a = {
    classHidden: 'is-hidden',
    classLoading: 'is-loading',
  };

  const times = {
    loadingDelay: 1000,
    scrollTime: 1000,
  };

  class FiltersForm {
    constructor(section) {
      this.section = section;
      this.container = this.section.container;
      this.sidebar = this.container.querySelector(selectors$h.collectionSidebar);
      this.form = section.container.querySelector(selectors$h.form);
      this.sort = this.container.querySelector(`[${selectors$h.dataSort}]`);
      this.productsContainer = this.container.querySelector(selectors$h.productsContainer);
      this.activeFiltersHolder = this.container.querySelector(selectors$h.activeFiltersHolder);
      this.activeFiltersCount = this.container.querySelector(selectors$h.activeFiltersCount);
      this.headerIsSticky = document.querySelector(selectors$h.headerSticky) !== null;
      this.layoutLarge = this.container.querySelector(`[${selectors$h.gridLarge}]`);
      this.layoutSmall = this.container.querySelector(`[${selectors$h.gridSmall}]`);

      if (this.productsContainer && this.sidebar) {
        this.init();
      }

      if (this.sort) {
        this.container.addEventListener('theme:filter:form', (e) => this.filtering(e));
      }

      if (this.sidebar || this.sort) {
        window.addEventListener('popstate', (e) => this.filtering(e));
      }
    }

    init() {
      this.showAllOptions();

      if (this.form) {
        new RangeSlider(this.form);

        this.sidebar.addEventListener(
          'input',
          debounce((e) => {
            const type = e.type;
            const target = e.target;

            if (!selectors$h.inputs.includes(type) || !this.form || typeof this.form.submit !== 'function') {
              return;
            }

            const priceMin = this.form.querySelector(selectors$h.priceMin);
            const priceMax = this.form.querySelector(selectors$h.priceMax);

            if (priceMin && priceMax) {
              if (target.hasAttribute(selectors$h.priceMinValue) && !priceMax.value) {
                priceMax.value = priceMax.placeholder;
              }

              if (target.hasAttribute(selectors$h.priceMaxValue) && !priceMin.value) {
                priceMin.value = priceMin.placeholder;
              }
            }

            this.filtering(e);
          }, 1500)
        );

        this.form.addEventListener('range:filter:update', (e) => this.updateRange(e));
      }

      if (this.sidebar) {
        this.sidebar.addEventListener('click', (e) => this.updateFilterFromUrl(e));
      }

      if (this.activeFiltersHolder) {
        this.activeFiltersHolder.addEventListener('click', (e) => this.updateFilterFromUrl(e));
      }

      if (this.productsContainer) {
        this.productsContainer.addEventListener('click', (e) => this.updateFilterFromUrl(e));
      }

      // Color swatches tooltips
      new Swapper(this.sidebar);
    }

    /**
     * Update range slider (price money)
     * @param {Object} e
     */
    updateRange(e) {
      if (this.form && typeof this.form.submit === 'function') {
        const rangeMin = this.form.querySelector(selectors$h.rangeMin);
        const rangeMax = this.form.querySelector(selectors$h.rangeMax);
        const priceMin = this.form.querySelector(selectors$h.priceMin);
        const priceMax = this.form.querySelector(selectors$h.priceMax);
        const checkElements = rangeMin && rangeMax && priceMin && priceMax;

        if (checkElements && rangeMin.hasAttribute(selectors$h.rangeMinValue) && rangeMax.hasAttribute(selectors$h.rangeMaxValue)) {
          const priceMinValue = parseInt(priceMin.placeholder);
          const priceMaxValue = parseInt(priceMax.placeholder);
          const rangeMinValue = parseInt(rangeMin.getAttribute(selectors$h.rangeMinValue));
          const rangeMaxValue = parseInt(rangeMax.getAttribute(selectors$h.rangeMaxValue));

          if (priceMinValue !== rangeMinValue || priceMaxValue !== rangeMaxValue) {
            priceMin.value = rangeMinValue;
            priceMax.value = rangeMaxValue;

            this.filtering(e);
          }
        }
      }
    }

    /**
     * Update filter on last clicked element
     * @param {Object} e
     */
    updateFilterFromUrl(e) {
      const target = e.target;
      if (target.matches(selectors$h.filterUpdateUrlButton) || (target.closest(selectors$h.filterUpdateUrlButton) && target)) {
        e.preventDefault();
        const button = target.matches(selectors$h.filterUpdateUrlButton) ? target : target.closest(selectors$h.filterUpdateUrlButton);
        this.filtering(e, button.getAttribute('href'));
      }
    }

    /**
     * Add filters to history api
     *
     * @param {Object} e
     * @param {String} replaceHref
     */
    addToHistory(e, replaceHref = '') {
      const sortValue = this.sort ? this.sort.getAttribute(selectors$h.dataSort) : '';

      if (!e || (e && e.type !== 'popstate')) {
        if (replaceHref === '') {
          const searchParams = new window.URL(window.location.href).searchParams;
          const filterUrlParams = Object.fromEntries(searchParams);
          const filterUrlRemoveString = searchParams.toString();

          if (filterUrlRemoveString.includes('filter.') || filterUrlRemoveString.includes('sort_by') || filterUrlRemoveString.includes('page')) {
            for (const key in filterUrlParams) {
              if (key.includes('filter.') || key.includes('sort_by') || key.includes('page')) {
                searchParams.delete(key);
              }
            }
          }

          if (this.form) {
            const formParams = new URLSearchParams(new FormData(this.form));

            for (let [key, val] of formParams.entries()) {
              if (key.includes('filter.') && val) {
                searchParams.append(key, val);
              }
            }
          }

          if (sortValue || (e && e.detail && e.detail.href)) {
            const sortString = sortValue ? sortValue : e.detail.params;
            searchParams.set('sort_by', sortString);
          }

          const filterUrlString = searchParams.toString();
          const filterNewParams = filterUrlString ? `?${filterUrlString}` : location.pathname;
          window.history.pushState(null, '', filterNewParams);

          return;
        }

        window.history.pushState(null, '', replaceHref);
      }
    }

    /**
     * Get filter result and append them to their holders
     */
    getFilterResult() {
      this.productsContainer.classList.add(classes$a.classLoading);
      this.getGridValues();

      fetch(`${window.location.pathname}${window.location.search}`)
        .then((response) => response.text())
        .then((response) => {
          const responseHolder = document.createElement('div');
          responseHolder.innerHTML = response;

          if (this.sidebar) {
            this.sidebar.innerHTML = responseHolder.querySelector(selectors$h.collectionSidebar).innerHTML;
          }

          if (this.activeFiltersCount) {
            this.activeFiltersCount.innerHTML = responseHolder.querySelector(selectors$h.activeFiltersCount).innerHTML;
          }

          this.productsContainer.innerHTML = responseHolder.querySelector(selectors$h.productsContainer).innerHTML;

          // Show active filters holder
          this.activeFiltersHolder.innerHTML = responseHolder.querySelector(selectors$h.activeFiltersHolder).innerHTML;
          this.activeFiltersHolder.classList.toggle(classes$a.classHidden, this.activeFiltersHolder.innerHTML === '');

          this.setGridValues();
          this.refreshFunctionalities();

          setTimeout(() => {
            this.productsContainer.classList.remove(classes$a.classLoading);
          }, times.loadingDelay);
        });
    }

    /**
     * Refresh functionalities
     */
    refreshFunctionalities() {
      // Init range slider
      this.form = this.container.querySelector(selectors$h.form);
      if (this.form) {
        new RangeSlider(this.form);
        this.form.addEventListener('range:filter:update', (e) => this.updateRange(e));
      }

      // Init filters
      const filters = this.container.querySelectorAll(selectors$h.filtersWrappper);
      filters.forEach((filter) => {
        new Filters(filter);
      });

      // Init accordions
      const accordions = this.container.querySelectorAll(selectors$h.accordionBody);
      accordions.forEach((accordion) => {
        new Accordion(accordion);
      });

      // Init siblings
      new Siblings(this.container);

      // Color swatches tooltips
      if (this.sidebar) {
        new Swapper(this.sidebar);
      }

      // Init product swatches
      makeGridSwatches(this.container);

      this.showAllOptions();
    }

    // Get grid values
    getGridValues() {
      if (this.layoutLarge) {
        this.layoutLargeValue = this.layoutLarge.getAttribute(selectors$h.gridLarge);
      }

      if (this.layoutSmall) {
        this.layoutSmallValue = this.layoutSmall.getAttribute(selectors$h.gridSmall);
      }
    }

    // Set grid values on AJAX
    setGridValues() {
      if (this.layoutLarge) {
        this.layoutLarge = this.container.querySelector(`[${selectors$h.gridLarge}]`);
        this.layoutLarge.setAttribute(selectors$h.gridLarge, this.layoutLargeValue);
      }

      if (this.layoutSmall) {
        this.layoutSmall = this.container.querySelector(`[${selectors$h.gridSmall}]`);
        this.layoutSmall.setAttribute(selectors$h.gridSmall, this.layoutSmallValue);
      }
    }

    // Show all options if in the filter have selected option but it is hidden
    showAllOptions() {
      const checkedOptions = this.container.querySelectorAll(selectors$h.checkedOption);

      checkedOptions.forEach((option) => {
        if (option.parentNode.classList.contains(classes$a.classHidden)) {
          const button = option.closest(selectors$h.accordionBody).nextElementSibling;

          if (!button.classList.contains(selectors$h.classHidden)) {
            button.dispatchEvent(new CustomEvent('click'));
          }
        }
      });
    }

    /**
     * Filtering method and scroll at the top on the section
     * @param {Object} e
     * @param {String} replaceHref
     */
    filtering(e, replaceHref = '') {
      // Scroll to filter tools
      const windowScrollY = window.scrollY || window.pageYOffset;
      const headerH = this.headerIsSticky ? document.querySelector(selectors$h.headerHeight).getBoundingClientRect().height : 0;
      const collectionTools = this.container.querySelector(selectors$h.collectionTools);
      const scrollToElement = collectionTools.offsetTop - headerH;
      const enableScrollTo = collectionTools.offsetTop + collectionTools.getBoundingClientRect().height < windowScrollY - headerH;

      if (enableScrollTo) {
        window.scrollTo({
          top: scrollToElement,
          left: 0,
          behavior: 'smooth',
        });
      }

      setTimeout(
        () => {
          this.addToHistory(e, replaceHref);
          this.getFilterResult();
        },
        enableScrollTo ? times.scrollTime : 10
      );
    }
  }

  const collectionFiltersForm = {
    onLoad() {
      this.filterForm = new FiltersForm(this);
    },
    onUnload() {
      if (this.filterForm && typeof this.filterForm.unload === 'function') {
        this.filterForm.unload();
      }
    },
  };

  register('search-page', [collectionFiltersSidebar, collectionFiltersForm, swatchGridSection, accordion]);

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  const selectors$g = {
    zoomImage: '[data-image-zoom]',
    attrUnique: 'data-unique',
  };

  class GalleryZoom {
    constructor(container) {
      this.triggers = container.querySelectorAll(selectors$g.zoomImage);
      this.init();
    }

    init() {
      this.triggers.forEach((trigger) => {
        const unique = trigger.getAttribute(selectors$g.attrUnique);

        MicroModal.init({
          disableScroll: true,
          openTrigger: `data-popup-${unique}`,
          onShow: (modal) => {
            var images = modal.querySelectorAll('[data-src]', modal);
            images.forEach((image) => {
              if (image.getAttribute('src') === null) {
                const bigImage = image.getAttribute('data-src');
                image.setAttribute('src', bigImage);
              }
            });
          },
          onClose: (modal, el, event) => {
            event.preventDefault();
          },
        });
      });
    }
  }

  const galleryZoomSection = {
    onLoad() {
      new GalleryZoom(this.container);
    },
  };

  register('gallery', [galleryZoomSection, popupVideoSection]);

  var modelJsonSections = {};
  var models = {};
  var xrButtons = {};

  const selectors$f = {
    productMediaWrapper: '[data-product-single-media-wrapper]',
    productSlideshow: '[data-product-slideshow]',
    productXr: '[data-shopify-xr]',
    dataMediaId: 'data-media-id',
    dataModelId: 'data-model-id',
    modelViewer: 'model-viewer',
    dataModel3d: 'data-shopify-model3d-id',
    modelJson: '#ModelJson-',
  };

  function initSectionModels(modelViewerContainer, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false,
    };

    const mediaId = modelViewerContainer.getAttribute(selectors$f.dataMediaId);
    const modelViewerElement = modelViewerContainer.querySelector(selectors$f.modelViewer);
    const modelId = modelViewerElement.getAttribute(selectors$f.dataModelId);
    const xrButton = modelViewerContainer.closest(selectors$f.productSlideshow).parentElement.querySelector(selectors$f.productXr);
    xrButtons[sectionId] = {
      $element: xrButton,
      defaultId: modelId,
    };

    models[mediaId] = {
      modelId: modelId,
      mediaId: mediaId,
      sectionId: sectionId,
      $container: modelViewerContainer,
      $element: modelViewerElement,
    };

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr,
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi,
      },
    ]);
  }

  function setupShopifyXr(errors) {
    if (errors) {
      console.warn(errors);
      return;
    }
    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function () {
        setupShopifyXr();
      });
      return;
    }

    for (const sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        const modelSection = modelJsonSections[sectionId];
        if (modelSection.loaded) continue;

        const modelJson = document.querySelector(`${selectors$f.modelJson}${sectionId}`);
        if (modelJson) {
          window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
          modelSection.loaded = true;
        }
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) {
      console.warn(errors);
      return;
    }

    for (const key in models) {
      if (models.hasOwnProperty(key)) {
        const model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.$element);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
    const xrButton = xrButtons[model.sectionId];

    model.$container.addEventListener('pause', function () {
      if (model.modelViewerUi.pause) {
        model.modelViewerUi.pause();
      }
    });
    model.$container.addEventListener('play-desktop', function () {
      if (model.modelViewerUi.play && !isTouch()) {
        model.modelViewerUi.play();
      }
      if (xrButton && xrButton.$element && model && model.modelId && selectors$f.dataModel3d) {
        xrButton.$element.setAttribute(selectors$f.dataModel3d, model.modelId);
      }
    });
    model.$container.addEventListener('play', function () {
      if (model.modelViewerUi.play) {
        model.modelViewerUi.play();
      }
    });
  }

  async function productNativeVideo(uniqueKey) {
    const playerElement = document.querySelector(`[data-player="${uniqueKey}"]`);
    const videoElement = playerElement.querySelector('video');
    const videoLoad = {
      name: 'video-ui',
      version: '1.0',
    };
    await loadScript(videoLoad);

    const player = new window.Shopify.Plyr(videoElement);
    playerElement.addEventListener('pause', function () {
      if (player.pause) {
        player.pause();
      }
    });
    playerElement.addEventListener('play-desktop', function () {
      if (player.play && !isTouch()) {
        playerElement.dispatchEvent(new CustomEvent('play'));
      }
    });
    playerElement.addEventListener('play', function () {
      try {
        if (player.play) {
          player.play();
        } else {
          player.addEventListener('onReady', function (event) {
            event.target.play();
          });
        }
      } catch (e) {
        console.warn(e);
      }
    });
    playerElement.addEventListener('destroy', function () {
      try {
        if (player.destroy) {
          player.destroy();
        }
      } catch (e) {
        console.warn(e);
      }
    });
    return player;
  }

  const selectors$e = {
    holderItems: '[data-custom-scrollbar-items]',
    scrollbar: '[data-custom-scrollbar]',
    scrollbarTrack: '[data-custom-scrollbar-track]',
  };

  const classes$9 = {
    hide: 'hide',
  };

  class CustomScrollbar {
    constructor(holder) {
      this.holderItems = holder.querySelector(selectors$e.holderItems);
      this.scrollbar = holder.querySelector(selectors$e.scrollbar);
      this.scrollbarTrack = holder.querySelector(selectors$e.scrollbarTrack);
      this.trackWidth = 0;
      this.scrollWidth = 0;

      if (this.scrollbar && this.holderItems) {
        this.events();
        this.calculateTrackWidth();
      }
    }

    events() {
      this.holderItems.addEventListener('scroll', this.calculatePosition.bind(this));

      document.addEventListener('theme:resize:width', this.calculateTrackWidth.bind(this));
      document.addEventListener('theme:resize:width', this.calculatePosition.bind(this));
    }

    calculateTrackWidth() {
      this.scrollbarWidth = this.scrollbar.clientWidth === 0 ? this.scrollbar.parentNode.getBoundingClientRect().width : this.scrollbar.clientWidth;
      setTimeout(() => {
        this.scrollWidth =
          this.holderItems.children.length *
          (this.holderItems.children[0].clientWidth +
            Number(getComputedStyle(this.holderItems.children[0]).marginRight.replace('px', '')) +
            Number(getComputedStyle(this.holderItems.children[0]).marginLeft.replace('px', '')));

        this.trackWidth = (this.scrollbarWidth / this.scrollWidth) * 100;
        this.trackWidth = this.trackWidth < 5 ? 5 : this.trackWidth;
        this.scrollbar.style.setProperty('--track-width', `${this.trackWidth}%`);
        const hideScrollbar = this.trackWidth >= 100;

        this.scrollbar.classList.toggle(classes$9.hide, hideScrollbar);
      }, 100);
    }

    calculatePosition() {
      let position = this.holderItems.scrollLeft / (this.holderItems.scrollWidth - this.holderItems.clientWidth);
      position *= this.scrollbar.clientWidth - this.scrollbarTrack.clientWidth;
      position = position < 0 ? 0 : position;
      position = isNaN(position) ? 0 : position;

      this.scrollbar.style.setProperty('--position', `${Math.round(position)}px`);

      document.dispatchEvent(
        new CustomEvent('theme:scrollbar:scroll', {
          bubbles: true,
          detail: {
            holder: this.holderItems,
          },
        })
      );
    }
  }

  const selectors$d = {
    productSlideshow: '[data-product-slideshow]',
    productThumbs: '[data-product-thumbs]',
    thumbImage: '[data-slideshow-thumbnail]',
    productImage: '[data-product-image]',
    mediaSlide: '[data-media-slide]',
    dataMediaId: 'data-media-id',
    dataMediaSelect: 'data-media-select',
    mediaType: 'data-type',
    videoPlayerExternal: '[data-type="external_video"]',
    videoPlayerNative: '[data-type="video"]',
    modelViewer: '[data-type="model"]',
    allPlayers: '[data-player]',
    xrButton: '[data-shopify-xr]',
    xrButtonId: 'data-shopify-model3d-id',
    loopVideo: 'data-enable-video-looping',
    flickitylockHeight: 'flickity-lock-height',
    alignment: 'data-thumbs-align',
  };

  const classes$8 = {
    flickityDisableClass: 'flickity-disabled-mobile',
    flickityEnabled: 'flickity-enabled',
    selected: 'is-selected',
    active: 'is-activated',
  };

  class Media {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.slideshow = this.container.querySelector(selectors$d.productSlideshow);
      this.thumbWrapper = this.container.querySelector(selectors$d.productThumbs);
      this.thumbImages = this.container.querySelectorAll(selectors$d.thumbImage);
      this.loopVideo = this.container.getAttribute(selectors$d.loopVideo) === 'true';
      this.centerAlign = this.container.getAttribute(selectors$d.alignment) === 'center';

      this.flkty = null;
      this.flktyThumbs = null;
      this.currentSlide = null;
      this.enableScrollbar = false;

      this.init();
    }

    init() {
      this.createSlider();
      this.detectVideo();
      this.detectYouTube();
      this.detect3d();
      this.stopSliderThumbs();

      document.addEventListener('theme:resize', () => {
        this.stopSliderThumbs();
      });
    }

    createSlider() {
      if (!this.slideshow) {
        return;
      }

      const instance = this;
      let flickityOptions = {
        autoPlay: false,
        prevNextButtons: false,
        contain: true,
        pageDots: false,
        adaptiveHeight: true,
        accessibility: true,
        wrapAround: true,
        fade: true,
        rightToLeft: window.isRTL,
        on: {
          ready: function () {
            instance.sliderThumbs();
          },
        },
      };

      this.flkty = new FlickityFade(this.slideshow, flickityOptions);
      this.flkty.resize();

      this.currentSlide = this.slideshow.querySelectorAll(selectors$d.mediaSlide)[0];
      this.setDraggable();

      this.flkty.on(
        'change',
        function (index) {
          this.currentSlide.dispatchEvent(new CustomEvent('pause'));
          this.currentSlide = this.flkty.cells[index].element;
          this.slideshow.classList.remove(selectors$d.flickitylockHeight);

          if (this.flktyThumbs !== null && this.thumbWrapper.classList.contains(classes$8.flickityEnabled)) {
            this.flktyThumbs.select(index);
          } else {
            const id = this.currentSlide.getAttribute(selectors$d.dataMediaId);
            const currentThumb = this.thumbWrapper.querySelector(`[${selectors$d.dataMediaSelect}="${id}"]`);

            this.thumbWrapper.querySelector(`.${classes$8.active}`).classList.remove(classes$8.active);
            currentThumb.classList.add(classes$8.active);
          }
        }.bind(this)
      );

      this.flkty.on(
        'settle',
        function (index) {
          this.currentSlide = this.flkty.cells[index].element;
          this.setDraggable();
          this.currentSlide.dispatchEvent(new CustomEvent('play-desktop'));
          const isFocusEnabled = document.body.classList.contains(selectors$d.focusEnabled);
          if (isFocusEnabled) this.currentSlide.dispatchEvent(new Event('focus'));
          this.confirmSync();
        }.bind(this)
      );

      this.eventListeners();
    }

    eventListeners() {
      this.slideshow.addEventListener(
        'theme:image:change',
        function (event) {
          var mediaId = event.detail.id;
          const mediaIdString = `[${selectors$d.dataMediaId}="${mediaId}"]`;
          const matchesMedia = (cell) => {
            return cell.element.matches(mediaIdString);
          };
          const index = this.flkty.cells.findIndex(matchesMedia);
          this.flkty.select(index);
        }.bind(this)
      );

      this.thumbImages.forEach((thumb) => {
        thumb.addEventListener(
          'click',
          function (event) {
            const thumb = event.currentTarget;
            const id = thumb.getAttribute(selectors$d.dataMediaSelect);

            const activedThumb = thumb.parentNode.querySelector(`.${classes$8.active}`);
            if (activedThumb) {
              activedThumb.classList.remove(classes$8.active);
            }
            thumb.classList.add(classes$8.active);
            this.slideshow.dispatchEvent(
              new CustomEvent('theme:image:change', {
                detail: {
                  id: id,
                },
              })
            );
          }.bind(this)
        );
      });
    }

    sliderThumbs() {
      let opts = {
        freeScroll: true,
        draggable: true,
        contain: true,
        prevNextButtons: false,
        pageDots: false,
        accessibility: true,
        cellAlign: this.centerAlign ? 'center' : 'left',
        watchCSS: true,
      };
      this.flktyThumbs = new FlickitySync(this.thumbWrapper, opts);
    }

    confirmSync() {
      if (this.flkty.selectedIndex !== this.flktyThumbs.selectedIndex) {
        this.flkty.resize();
      }
    }

    setDraggable() {
      if (this.currentSlide) {
        const mediaType = this.currentSlide.getAttribute(selectors$d.mediaType);

        if (mediaType === 'model' || mediaType === 'video' || mediaType === 'external_video') {
          // fisrt boolean sets value, second option false to prevent refresh
          this.flkty.options.draggable = false;
          this.flkty.updateDraggable();
        } else {
          this.flkty.options.draggable = true;
          this.flkty.updateDraggable();
        }
      }
    }

    detect3d() {
      const modelViewerElements = this.container.querySelectorAll(selectors$d.modelViewer);
      if (modelViewerElements) {
        modelViewerElements.forEach((element) => {
          initSectionModels(element, this.section.id);
        });
        document.addEventListener(
          'shopify_xr_launch',
          function () {
            this.container.querySelectorAll(selectors$d.allPlayers).forEach((player) => {
              player.dispatchEvent(new CustomEvent('pause'));
            });
          }.bind(this)
        );
      }
    }

    detectVideo() {
      const playerElements = this.section.container.querySelectorAll(selectors$d.videoPlayerNative);
      for (var player of playerElements) {
        const uniqueKey = player.dataset.player;
        const nativePlayerPromise = productNativeVideo(uniqueKey);
        if (this.loopVideo === true) {
          nativePlayerPromise
            .then((nativePlayer) => {
              nativePlayer.loop = true;
              return nativePlayer;
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }

    detectYouTube() {
      const playerElements = this.section.container.querySelectorAll(selectors$d.videoPlayerExternal);
      for (var player of playerElements) {
        const uniqueKey = player.dataset.player;
        const youtubePlayerPromise = embedYoutube(uniqueKey);
        if (this.loopVideo === true) {
          youtubePlayerPromise
            .then((youtubePlayer) => {
              return _setToLoop(youtubePlayer);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }

    stopSliderThumbs() {
      if (window.innerWidth < window.theme.sizes.medium && this.thumbWrapper?.classList.contains(classes$8.flickityDisableClass) && !this.enableScrollbar) {
        new CustomScrollbar(this.container);
        this.enableScrollbar = true;
      } else {
        this.enableScrollbar = false;
      }
    }

    pauseAllMedia() {
      const all = this.container.querySelector(`[data-media-slide]`);
      all.dispatchEvent(new CustomEvent('pause'));
    }

    pauseOtherMedia(uniqueKey) {
      const otherMedia = this.container.querySelector(`[data-media-slide]:not([data-player="${uniqueKey}"])`);
      otherMedia.dispatchEvent(new CustomEvent('pause'));
    }

    destroy() {
      this.container.querySelectorAll(selectors$d.allPlayers).forEach((player) => {
        player.dispatchEvent(new CustomEvent('destroy'));
      });
    }
  }

  function _setToLoop(youtubePlayer) {
    youtubePlayer.addEventListener('onStateChange', function (event) {
      if (event.data === 0) {
        // video is over, replay
        event.target.playVideo();
      }
    });
    return youtubePlayer;
  }

  const selectors$c = {
    pickupContainer: 'data-store-availability-container',
    shopifySection: '[data-api-content]',
    drawer: '[data-pickup-drawer]',
    drawerOpen: '[data-pickup-drawer-open]',
    drawerClose: '[data-pickup-drawer-close]',
    drawerBody: '[data-pickup-body]',
  };

  const classes$7 = {
    isVisible: 'drawer--visible',
    isHidden: 'hide',
  };

  let sections$5 = {};

  class PickupAvailability {
    constructor(section) {
      this.container = section.container;
      this.drawer = null;
      this.buttonDrawerOpen = null;
      this.buttonDrawerClose = null;
      this.drawerBody = null;

      this.fetchPickupAvailability();

      this.container.addEventListener('theme:variant:change', (event) => this.fetchPickupAvailability(event));
    }

    fetchPickupAvailability(event) {
      const container = this.container.querySelector(`[${selectors$c.pickupContainer}]`);
      if (!container) return;
      const variantID = event && event.detail.variant ? event.detail.variant.id : container.getAttribute(selectors$c.pickupContainer);
      if (event && !event.detail.variant) {
        container.classList.add(classes$7.isHidden);
        return;
      }

      if (variantID) {
        fetch(`${window.theme.routes.root_url}variants/${variantID}/?section_id=api-pickup-availability`)
          .then(this.handleErrors)
          .then((response) => response.text())
          .then((text) => {
            const pickupAvailabilityHTML = new DOMParser().parseFromString(text, 'text/html').querySelector(selectors$c.shopifySection).innerHTML;
            container.innerHTML = pickupAvailabilityHTML;
            container.classList.remove(classes$7.isHidden);

            this.drawer = this.container.querySelector(selectors$c.drawer);
            this.buttonDrawerOpen = this.container.querySelector(selectors$c.drawerOpen);
            this.buttonDrawerClose = this.container.querySelectorAll(selectors$c.drawerClose);
            this.drawerBody = this.container.querySelector(selectors$c.drawerBody);

            if (this.buttonDrawerOpen) {
              this.buttonDrawerOpen.addEventListener('click', () => this.openDrawer());
            }

            if (this.buttonDrawerClose.length) {
              this.buttonDrawerClose.forEach((element) => {
                element.addEventListener('click', () => this.closeDrawer());
              });
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }

    openDrawer() {
      if (this.drawer) {
        this.drawer.classList.add(classes$7.isVisible);
        this.drawer.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
        this.drawerBody.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
      }
    }

    closeDrawer() {
      if (this.drawer) {
        this.drawer.classList.remove(classes$7.isVisible);
        this.drawer.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        this.drawerBody.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
      }
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  const pickupAvailability = {
    onLoad() {
      sections$5[this.id] = new PickupAvailability(this);
    },
  };

  const hideElement = (elem) => {
    if (elem) {
      elem.style.display = 'none';
    }
  };

  const selectors$b = {
    form: '[data-product-form]',
    optionPosition: 'data-option-position',
    optionInput: '[name^="options"], [data-popout-option]',
    selectOptionValue: 'data-value',
  };

  const classes$6 = {
    soldOut: 'sold-out',
    unavailable: 'unavailable',
  };

  /**
   * Variant Sellout Precrime Click Preview
   * I think of this like the precrime machine in Minority report.  It gives a preview
   * of every possible click action, given the current form state.  The logic is:
   *
   * for each clickable name=options[] variant selection element
   * find the value of the form if the element were clicked
   * lookup the variant with those value in the product json
   * clear the classes, add .unavailable if it's not found,
   * and add .sold-out if it is out of stock
   *
   * Caveat: we rely on the option position so we don't need
   * to keep a complex map of keys and values.
   */

  class SelloutVariants {
    constructor(section, productJSON) {
      this.container = section;
      this.productJSON = productJSON;
      this.form = this.container.querySelector(selectors$b.form);
      this.formData = new FormData(this.form);
      this.optionElements = this.container.querySelectorAll(selectors$b.optionInput);

      if (this.productJSON && this.form) {
        this.init();
      }
    }

    init() {
      this.update();
    }

    update() {
      this.getCurrentState();

      this.optionElements.forEach((el) => {
        const val = el.value || el.getAttribute(selectors$b.selectOptionValue);
        const positionString = el.closest(`[${selectors$b.optionPosition}]`).getAttribute(selectors$b.optionPosition);
        // subtract one because option.position in liquid does not count form zero, but JS arrays do
        const position = parseInt(positionString, 10) - 1;

        let newVals = [...this.selections];
        newVals[position] = val;

        const found = this.productJSON.variants.find((element) => {
          // only return true if every option matches our hypothetical selection
          let perfectMatch = true;
          for (let index = 0; index < newVals.length; index++) {
            if (element.options[index] !== newVals[index]) {
              perfectMatch = false;
            }
          }
          return perfectMatch;
        });

        el.classList.remove(classes$6.soldOut, classes$6.unavailable);
        if (typeof found === 'undefined') {
          el.classList.add(classes$6.unavailable);
        } else if (found && found.available === false) {
          el.classList.add(classes$6.soldOut);
        }
      });
    }

    getCurrentState() {
      this.formData = new FormData(this.form);
      this.selections = [];
      for (var value of this.formData.entries()) {
        if (value[0].includes('options[')) {
          // push the current state of the form, dont worry about the group name
          // we will be using the array position instead of the name to match values
          this.selections.push(value[1]);
        }
      }
    }
  }

  const selectors$a = {
    outerSection: '[data-section-id]',
    productForm: '[data-product-form]',
    productSlideshow: '[data-product-slideshow]',
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    buttonsWrapper: '[data-buttons-wrapper]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    priceButton: '[data-button-price]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    unitPrice: '[data-product-unit-price]',
    unitBase: '[data-product-base]',
    unitWrapper: '[data-product-unit]',
    dataEnableHistoryState: 'data-enable-history-state',
    optionPosition: 'data-option-position',
    optionValue: '[data-option-value]',
    subPrices: '[data-subscription-watch-price]',
    subSelectors: '[data-subscription-selectors]',
    priceOffWrap: '[data-price-off]',
    priceOffType: '[data-price-off-type]',
    priceOffAmount: '[data-price-off-amount]',
    subsToggle: '[data-toggles-group]',
    subsChild: 'data-group-toggle',
    subDescription: '[data-plan-description]',
    remainingCount: '[data-remaining-count]',
    remainingMax: '[data-remaining-max]',
    remainingMaxAttr: 'data-remaining-max',
    remainingWrapper: '[data-remaining-wrapper]',
    remainingJSON: '[data-product-remaining-json]',
    preOrderTag: '_preorder',
    idInput: '[name="id"]',
    upsellModal: '[data-upsell-modal]',
  };

  const classes$5 = {
    hide: 'hide',
    variantSoldOut: 'variant--soldout',
    variantUnavailable: 'variant--unavailable',
    productPriceSale: 'product__price--sale',
    remainingLow: 'count-is-low',
    remainingIn: 'count-is-in',
    remainingOut: 'count-is-out',
    remainingUnavailable: 'count-is-unavailable',
  };

  class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.container = this;
      this.outerSection = this.container.closest(selectors$a.outerSection);
      this.upsell = this.container.closest(selectors$a.upsellModal);
      this.outerWrapper = this.upsell ? this.upsell : this.outerSection || this.container;

      this.productForm = this.container.querySelector(selectors$a.productForm);
      this.slideshow = this.outerWrapper.querySelector(selectors$a.productSlideshow);
      this.enableHistoryState =
        this.outerSection && this.outerSection.hasAttribute(selectors$a.dataEnableHistoryState) ? this.outerSection.getAttribute(selectors$a.dataEnableHistoryState) === 'true' : false;
      this.hasUnitPricing = this.outerWrapper.querySelector(selectors$a.unitWrapper);
      this.subSelectors = this.container.querySelector(selectors$a.subSelectors);
      this.subPrices = this.container.querySelector(selectors$a.subPrices);

      this.priceOffWrap = this.outerWrapper.querySelector(selectors$a.priceOffWrap);
      this.priceOffAmount = this.outerWrapper.querySelector(selectors$a.priceOffAmount);
      this.priceOffType = this.outerWrapper.querySelector(selectors$a.priceOffType);
      this.planDecription = this.container.querySelector(selectors$a.subDescription);

      this.remainingWrapper = this.container.querySelector(selectors$a.remainingWrapper);
      const remainingMaxWrap = this.container.querySelector(selectors$a.remainingMax);

      this.sellout = null;

      if (this.remainingWrapper && remainingMaxWrap) {
        this.remainingMaxInt = parseInt(remainingMaxWrap.getAttribute(selectors$a.remainingMaxAttr), 10);
        this.remainingCount = this.container.querySelector(selectors$a.remainingCount);
        this.remainingJSONWrapper = this.container.querySelector(selectors$a.remainingJSON);
        this.remainingJSON = null;
        if (this.remainingJSONWrapper && this.remainingJSONWrapper.innerHTML !== '') {
          this.remainingJSON = JSON.parse(this.remainingJSONWrapper.innerHTML);
        } else {
          console.warn('Missing product quantity JSON');
        }
      }

      initQtySection(this.container);

      this.init();
    }

    init() {
      let productJSONText = null;
      this.productJSON = null;
      const productElemJSON = this.container.querySelector(selectors$a.productJson);

      if (productElemJSON) {
        productJSONText = productElemJSON.innerHTML;
      }
      if (productJSONText && this.productForm) {
        this.productJSON = JSON.parse(productJSONText);
        this.sellout = new SelloutVariants(this.container, this.productJSON);
        this.linkForm();
      } else {
        console.warn('Missing product form or product JSON');
      }

      // Add cookie for recent products
      if (this.productJSON) {
        new RecordRecentlyViewed(this.productJSON.handle);
      }
    }

    destroy() {
      this.productForm.destroy();
    }

    linkForm() {
      this.productForm = new ProductFormReader(this.productForm, this.productJSON, {
        onOptionChange: this.onOptionChange.bind(this),
        onPlanChange: this.onPlanChange.bind(this),
        onQuantityChange: this.onQuantityChange.bind(this),
      });
      this.pushState(this.productForm.getFormState());
      this.subsToggleListeners();
    }

    onOptionChange(evt) {
      this.pushState(evt.dataset);
    }

    onPlanChange(evt) {
      if (this.subPrices) {
        this.pushState(evt.dataset);
      }
    }

    onQuantityChange(evt) {
      const formState = evt.dataset;
      this.productState = this.setProductState(formState);
      this.updateButtonPrices(formState);
    }

    pushState(formState) {
      this.productState = this.setProductState(formState);
      this.updateProductImage(formState);
      this.updateAddToCartState(formState);
      if (!document.querySelector('.bundle_variants')) {
        this.updateProductPrices(formState);
      }
      this.updateSaleText(formState);
      this.updateSubscriptionText(formState);
      this.updateLegend(formState);
      this.updateRemaining(formState);
      this.fireHookEvent(formState);
      if (this.sellout) {
        this.sellout.update(formState);
      }
      if (this.enableHistoryState) {
        this.updateHistoryState(formState);
      }
    }

    updateAddToCartState(formState) {
      const variant = formState.variant;
      let addText = theme.strings.addToCart;
      const priceWrapper = this.outerWrapper.querySelectorAll(selectors$a.priceWrapper);
      const buttonsWrapper = this.container.querySelector(selectors$a.buttonsWrapper);
      const addToCart = buttonsWrapper.querySelectorAll(selectors$a.addToCart);
      const addToCartText = buttonsWrapper.querySelectorAll(selectors$a.addToCartText);

      if (this.productJSON.tags.includes(selectors$a.preOrderTag)) {
        addText = theme.strings.preOrder;
      }

      if (priceWrapper.length && variant) {
        priceWrapper.forEach((element) => {
          element.classList.remove(classes$5.hide);
        });
      }

      if (addToCart.length) {
        addToCart.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.disabled = false;
            } else {
              element.disabled = true;
            }
          } else {
            element.disabled = true;
          }
        });
      }

      if (addToCartText.length) {
        addToCartText.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.innerHTML = addText;
            } else {
              element.innerHTML = theme.strings.soldOut;
            }
          } else {
            element.innerHTML = theme.strings.unavailable;
          }
        });
      }

      if (buttonsWrapper) {
        if (variant) {
          if (variant.available) {
            buttonsWrapper.classList.remove(classes$5.variantSoldOut, classes$5.variantUnavailable);
          } else {
            buttonsWrapper.classList.add(classes$5.variantSoldOut);
            buttonsWrapper.classList.remove(classes$5.variantUnavailable);
          }
          const formSelect = buttonsWrapper.querySelector(selectors$a.originalSelectorId);
          if (formSelect) {
            formSelect.value = variant.id;
          }
        } else {
          buttonsWrapper.classList.add(classes$5.variantUnavailable);
          buttonsWrapper.classList.remove(classes$5.variantSoldOut);
        }
      }
    }

    updateLegend(formState) {
      const variant = formState.variant;
      if (variant) {
        const vals = this.container.querySelectorAll(selectors$a.optionValue);
        vals.forEach((val) => {
          const wrapper = val.closest(`[${selectors$a.optionPosition}]`);
          if (wrapper) {
            const position = wrapper.getAttribute(selectors$a.optionPosition);
            const index = parseInt(position, 10) - 1;
            this.newValue = variant.options[index];
            val.innerHTML = this.newValue;
          }
        });
      }
    }

    updateHistoryState(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      const location = window.location.href;
      if (variant && location.includes('/product')) {
        const url = new window.URL(location);
        const params = url.searchParams;
        params.set('variant', variant.id);
        if (plan && plan.detail && plan.detail.id && this.productState.hasPlan) {
          params.set('selling_plan', plan.detail.id);
        } else {
          params.delete('selling_plan');
        }
        url.search = params.toString();
        const urlString = url.toString();
        window.history.replaceState({path: urlString}, '', urlString);
      }
    }

    updateRemaining(formState) {
      const variant = formState.variant;
      if (variant && this.remainingWrapper && this.remainingJSON && this.remainingCount) {
        const newQuantity = this.remainingJSON[variant.id];
        if (newQuantity && newQuantity <= this.remainingMaxInt && newQuantity > 0) {
          this.remainingWrapper.classList.remove(classes$5.remainingIn, classes$5.remainingOut, classes$5.remainingUnavailable);
          this.remainingWrapper.classList.add(classes$5.remainingLow);
          this.remainingCount.innerHTML = newQuantity;
        } else if (this.productState.soldOut) {
          this.remainingWrapper.classList.remove(classes$5.remainingLow, classes$5.remainingIn, classes$5.remainingUnavailable);
          this.remainingWrapper.classList.add(classes$5.remainingOut);
        } else if (this.productState.available) {
          this.remainingWrapper.classList.remove(classes$5.remainingLow, classes$5.remainingOut, classes$5.remainingUnavailable);
          this.remainingWrapper.classList.add(classes$5.remainingIn);
        }
      } else if (this.remainingWrapper) {
        this.remainingWrapper.classList.remove(classes$5.remainingIn, classes$5.remainingOut, classes$5.remainingLow);
        this.remainingWrapper.classList.add(classes$5.remainingUnavailable);
      }
    }

    getBaseUnit(variant) {
      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit;
    }

    subsToggleListeners() {
      const toggles = this.container.querySelectorAll(selectors$a.subsToggle);

      toggles.forEach((toggle) => {
        toggle.addEventListener(
          'change',
          function (e) {
            const val = e.target.value.toString();
            const selected = this.container.querySelector(`[${selectors$a.subsChild}="${val}"]`);
            const groups = this.container.querySelectorAll(`[${selectors$a.subsChild}]`);
            if (selected) {
              selected.classList.remove(classes$5.hide);
              const first = selected.querySelector(`[name="selling_plan"]`);
              first.checked = true;
              first.dispatchEvent(new Event('change'));
            }
            groups.forEach((group) => {
              if (group !== selected) {
                group.classList.add(classes$5.hide);
                const plans = group.querySelectorAll(`[name="selling_plan"]`);
                plans.forEach((plan) => {
                  plan.checked = false;
                  plan.dispatchEvent(new Event('change'));
                });
              }
            });
          }.bind(this)
        );
      });
    }

    updateSaleText(formState) {
      if (this.productState.planSale) {
        this.updateSaleTextSubscription(formState);
      } else if (this.productState.onSale) {
        this.updateSaleTextStandard(formState);
      } else if (this.priceOffWrap) {
        this.priceOffWrap.classList.add(classes$5.hide);
      }
    }

    updateSaleTextStandard(formState) {
      if (!this.priceOffType) return;
      this.priceOffType.innerHTML = window.theme.strings.sale || 'sale';
      const variant = formState.variant;
      if (window.theme.settings.badge_sale_type && window.theme.settings.badge_sale_type === 'percentage') {
        const discountFloat = (variant.compare_at_price - variant.price) / variant.compare_at_price;
        const discountInt = Math.floor(discountFloat * 100);
        this.priceOffAmount.innerHTML = `${discountInt}%`;
      } else {
        const discount = variant.compare_at_price - variant.price;
        this.priceOffAmount.innerHTML = themeCurrency.formatMoney(discount, theme.moneyFormat);
      }
      this.priceOffWrap.classList.remove(classes$5.hide);
    }

    updateSaleTextSubscription(formState) {
      this.priceOffType.innerHTML = window.theme.strings.subscription || 'subscripton';
      const variant = formState.variant;
      const adjustment = formState.plan.detail.price_adjustments[0];
      const discount = adjustment.value;
      if (adjustment && adjustment.value_type === 'percentage') {
        this.priceOffAmount.innerHTML = `${discount}%`;
      } else if (adjustment && adjustment.value_type === 'price') {
        this.priceOffAmount.innerHTML = themeCurrency.formatMoney(variant.price - adjustment.value, theme.moneyFormat);
      } else {
        this.priceOffAmount.innerHTML = themeCurrency.formatMoney(discount, theme.moneyFormat);
      }
      this.priceOffWrap.classList.remove(classes$5.hide);
    }

    updateSubscriptionText(formState) {
      if (formState.plan && this.planDecription && formState.plan.detail.description !== null) {
        this.planDecription.innerHTML = formState.plan.detail.description;
        this.planDecription.classList.remove(classes$5.hide);
      } else if (this.planDecription) {
        this.planDecription.classList.add(classes$5.hide);
      }
    }

    getPrices(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      let comparePrice = '';
      let price = '';

      if (this.productState.available) {
        comparePrice = variant.compare_at_price;
        price = variant.price;
      }

      if (this.productState.hasPlan) {
        price = plan.allocation.price;
      }

      if (this.productState.planSale) {
        comparePrice = plan.allocation.compare_at_price;
        price = plan.allocation.price;
      }
      return {
        price: price,
        comparePrice: comparePrice,
      };
    }

    updateButtonPrices(formState) {
      const priceButtons = this.container.querySelectorAll(selectors$a.priceButton);
      const {price} = this.getPrices(formState);
      if (document.querySelector('[data-bundlePrice]')) {
        var priceB = document.querySelector('[data-bundlePrice]').dataset.bundleprice;
      }

      if (priceButtons.length) {
        priceButtons.forEach((btn) => {
          if (document.querySelector('[data-bundlePrice]')) {
            var btnPrice = formState.quantity * priceB;
          }
          else {
            var btnPrice = formState.quantity * price;
          }
          btn.innerHTML = themeCurrency.formatMoney(btnPrice, theme.moneyFormat);
        });
      }
    }

    updateProductPrices(formState) {
      const variant = formState.variant;
      const priceWrappers = this.outerWrapper.querySelectorAll(selectors$a.priceWrapper);
      const priceButtons = this.container.querySelectorAll(selectors$a.priceButton);

      const {price, comparePrice} = this.getPrices(formState);

      priceWrappers.forEach((wrap) => {
        const comparePriceEl = wrap.querySelector(selectors$a.comparePrice);
        const productPriceEl = wrap.querySelector(selectors$a.productPrice);
        const comparePriceText = wrap.querySelector(selectors$a.comparePriceText);

        if (comparePriceEl) {
          if (this.productState.onSale || this.productState.planSale) {
            comparePriceEl.classList.remove(classes$5.hide);
            comparePriceText.classList.remove(classes$5.hide);
            productPriceEl.classList.add(classes$5.productPriceSale);
          } else {
            comparePriceEl.classList.add(classes$5.hide);
            comparePriceText.classList.add(classes$5.hide);
            productPriceEl.classList.remove(classes$5.productPriceSale);
          }
          comparePriceEl.innerHTML = themeCurrency.formatMoney(comparePrice, theme.moneyFormat);
        }
        if (productPriceEl) {
          if (variant) {
            productPriceEl.innerHTML = themeCurrency.formatMoney(price, theme.moneyFormat);
          } else {
            productPriceEl.innerHTML = '&nbsp;';
          }
        }
      });

      if (priceButtons.length) {
        priceButtons.forEach((btn) => {
          const btnPrice = formState.quantity * price;
          btn.innerHTML = themeCurrency.formatMoney(btnPrice, theme.moneyFormat);
        });
      }

      if (this.hasUnitPricing) {
        this.updateProductUnits(formState);
      }
    }

    updateProductUnits(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      let unitPrice = null;

      if (variant && variant.unit_price) {
        unitPrice = variant.unit_price;
      }
      if (plan && plan.allocation && plan.allocation.unit_price) {
        unitPrice = plan.allocation.unit_price;
      }

      if (unitPrice) {
        const base = this.getBaseUnit(variant);
        const formattedPrice = themeCurrency.formatMoney(unitPrice, theme.moneyFormat);
        this.outerWrapper.querySelector(selectors$a.unitPrice).innerHTML = formattedPrice;
        this.outerWrapper.querySelector(selectors$a.unitBase).innerHTML = base;
        showElement(this.outerWrapper.querySelector(selectors$a.unitWrapper));
      } else {
        hideElement(this.outerWrapper.querySelector(selectors$a.unitWrapper));
      }
    }

    fireHookEvent(formState) {
      const variant = formState.variant;
      this.container.dispatchEvent(
        new CustomEvent('theme:variant:change', {
          detail: {
            variant: variant,
          },
          bubbles: true,
        })
      );
    }

    /**
     * Tracks aspects of the product state that are relevant to UI updates
     * @param {object} evt - variant change event
     * @return {object} productState - represents state of variant + plans
     *  productState.available - current variant and selling plan options result in valid offer
     *  productState.soldOut - variant is sold out
     *  productState.onSale - variant is on sale
     *  productState.showUnitPrice - variant has unit price
     *  productState.requiresPlan - all the product variants requires a selling plan
     *  productState.hasPlan - there is a valid selling plan
     *  productState.planSale - plan has a discount to show next to price
     *  productState.planPerDelivery - plan price does not equal per_delivery_price - a prepaid subscribtion
     */
    setProductState(dataset) {
      const variant = dataset.variant;
      const plan = dataset.plan;

      const productState = {
        available: true,
        soldOut: false,
        onSale: false,
        showUnitPrice: false,
        requiresPlan: false,
        hasPlan: false,
        planPerDelivery: false,
        planSale: false,
      };

      if (!variant || (variant.requires_selling_plan && !plan)) {
        productState.available = false;
      } else {
        if (!variant.available) {
          productState.soldOut = true;
        }

        if (variant.compare_at_price > variant.price) {
          productState.onSale = true;
        }

        if (variant.unit_price) {
          productState.showUnitPrice = true;
        }

        if (this.productJSON && this.productJSON.requires_selling_plan) {
          productState.requiresPlan = true;
        }

        if (plan && this.subPrices) {
          productState.hasPlan = true;
          if (plan.allocation.per_delivery_price !== plan.allocation.price) {
            productState.planPerDelivery = true;
          }
          if (variant.price > plan.allocation.price) {
            productState.planSale = true;
          }
        }
      }
      return productState;
    }

    updateProductImage(formState) {
      const variant = formState.variant;
      if (this.slideshow && variant && variant.featured_media && variant.featured_media.id) {
        // Update variant image, if one is set
        this.slideshow.dispatchEvent(
          new CustomEvent('theme:image:change', {
            detail: {
              id: variant.featured_media.id,
            },
          })
        );
      }
    }
  }

  const selectors$9 = {
    slideshow: '[data-product-slideshow]',
    singeImage: '[data-product-image]',
    zoomButton: '[data-zoom-button]',
    zoomWrapper: '[data-zoom-wrapper]',
    mediaId: '[data-media-id]',
    mediaIdAttr: 'data-media-id',
  };

  function productPhotoswipeZoom(container, json) {
    const loadedPromise = loadScript({url: window.theme.assets.photoswipe});
    const returnZoom = loadedPromise
      .then(() => {
        const PhotoSwipe = window.themePhotoswipe.PhotoSwipe.default;
        const PhotoSwipeUI = window.themePhotoswipe.PhotoSwipeUI.default;

        const triggers = container.querySelectorAll(selectors$9.zoomButton);
        triggers.forEach((trigger) => {
          trigger.addEventListener('click', (event) => {
            const el = container.querySelector(selectors$9.zoomWrapper);
            const dataId = event.target.closest(selectors$9.mediaId).getAttribute(selectors$9.mediaIdAttr).toString();
            const items = [];
            for (let i = 0; i < json.media.length; i++) {
              if (json.media[i].media_type === 'image') {
                items[items.length] = {
                  src: json.media[i].src,
                  w: json.media[i].width,
                  h: json.media[i].height,
                  id: json.media[i].id,
                };
              }
            }
            const findImage = (element) => element.id.toString() === dataId;
            const index = items.findIndex(findImage);
            const options = {
              index,
              showHideOpacity: true,
              showAnimationDuration: 150,
              hideAnimationDuration: 250,
              bgOpacity: 1,
              spacing: 0,
              allowPanToNext: false,
              maxSpreadZoom: 3,
              history: false,
              loop: true,
              pinchToClose: false,
              modal: false,
              closeOnScroll: false,
              closeOnVerticalDrag: true,
              getDoubleTapZoom: function getDoubleTapZoom(isMouseClick, item) {
                if (isMouseClick) {
                  return 1.67;
                } else {
                  return item.initialZoomLevel < 0.7 ? 1 : 1.3;
                }
              },
              getThumbBoundsFn: function getThumbBoundsFn() {
                let imageLocation = container.querySelector(selectors$9.slideshow);
                if (!imageLocation) {
                  imageLocation = container.querySelector(selectors$9.singeImage);
                }
                const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                const rect = imageLocation.getBoundingClientRect();
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
              },
            };
            el.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
            // Initializes and opens PhotoSwipe
            const gallery = new PhotoSwipe(el, PhotoSwipeUI, items, options);
            gallery.init();
            gallery.listen('close', function () {
              document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
            });
          });
        });
      })
      .catch((e) => console.error(e));
    return returnZoom;
  }

  const selectors$8 = {
    body: 'body',
    dataRelatedSectionElem: '[data-related-section]',
    dataTabsHolder: '[data-tabs-holder]',
    dataTab: 'data-tab',
    dataTabIndex: 'data-tab-index',
    blockId: 'data-block-id',
    tabsLi: '.tabs > button',
    tabLink: '.tab-link',
    tabLinkRecent: '.tab-link__recent',
    tabContent: '.tab-content',
    scrollbarHolder: '[data-scrollbar]',
    scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
    scrollbarArrowNext: '[data-scrollbar-arrow-next]',
  };

  const classes$4 = {
    classCurrent: 'current',
    classHide: 'hide',
    classAlt: 'alt',
  };

  const sections$4 = {};

  class GlobalTabs {
    constructor(holder) {
      this.container = holder;
      this.body = document.querySelector(selectors$8.body);
      this.accessibility = window.accessibility;

      if (this.container) {
        this.scrollbarHolder = this.container.querySelectorAll(selectors$8.scrollbarHolder);

        this.init();

        // Init native scrollbar
        this.initNativeScrollbar();
      }
    }

    init() {
      const ctx = this.container;
      const tabsNavList = ctx.querySelectorAll(selectors$8.tabsLi);
      const firstTabLink = ctx.querySelector(`${selectors$8.tabLink}-0`);
      const firstTabContent = ctx.querySelector(`${selectors$8.tabContent}-0`);

      if (firstTabContent) {
        firstTabContent.classList.add(classes$4.classCurrent);
      }

      if (firstTabLink) {
        firstTabLink.classList.add(classes$4.classCurrent);
      }

      this.checkVisibleTabLinks();
      this.container.addEventListener('tabs:checkRecentTab', () => this.checkRecentTab());
      this.container.addEventListener('tabs:hideRelatedTab', () => this.hideRelatedTab());

      if (tabsNavList.length) {
        tabsNavList.forEach((element) => {
          const tabId = parseInt(element.getAttribute(selectors$8.dataTab));
          const tab = ctx.querySelector(`${selectors$8.tabContent}-${tabId}`);

          element.addEventListener('click', () => {
            this.tabChange(element, tab);
          });

          element.addEventListener('keyup', (event) => {
            if ((event.which === window.theme.keyboardKeys.SPACE || event.which === window.theme.keyboardKeys.ENTER) && this.body.classList.contains('is-focused')) {
              this.tabChange(element, tab);

              if (tab.querySelector('a, input')) {
                this.accessibility.lastFocused = element;

                this.accessibility.a11y.trapFocus(tab, {
                  elementToFocus: tab.querySelector('a:first-child, input:first-child'),
                });
              }
            }
          });
        });
      }
    }

    tabChange(element, tab) {
      this.container.querySelector(`${selectors$8.tabsLi}.${classes$4.classCurrent}`).classList.remove(classes$4.classCurrent);
      this.container.querySelector(`${selectors$8.tabContent}.${classes$4.classCurrent}`).classList.remove(classes$4.classCurrent);

      element.classList.add(classes$4.classCurrent);
      tab.classList.add(classes$4.classCurrent);

      if (element.classList.contains(classes$4.classHide)) {
        tab.classList.add(classes$4.classHide);
      }

      this.checkVisibleTabLinks();

      this.container.dispatchEvent(new CustomEvent('theme:tab:change'));
    }

    initNativeScrollbar() {
      if (this.scrollbarHolder.length) {
        this.scrollbarHolder.forEach((scrollbar) => {
          new NativeScrollbar(scrollbar);
        });
      }
    }

    checkVisibleTabLinks() {
      const tabsNavList = this.container.querySelectorAll(selectors$8.tabsLi);
      const tabsNavListHided = this.container.querySelectorAll(`${selectors$8.tabLink}.${classes$4.classHide}`);
      const difference = tabsNavList.length - tabsNavListHided.length;

      if (difference < 2) {
        this.container.classList.add(classes$4.classAlt);
      } else {
        this.container.classList.remove(classes$4.classAlt);
      }
    }

    checkRecentTab() {
      const tabLink = this.container.querySelector(selectors$8.tabLinkRecent);

      if (tabLink) {
        tabLink.classList.remove(classes$4.classHide);
        const tabLinkIdx = parseInt(tabLink.getAttribute(selectors$8.dataTab));
        const tabContent = this.container.querySelector(`${selectors$8.tabContent}[${selectors$8.dataTabIndex}="${tabLinkIdx}"]`);

        if (tabContent) {
          tabContent.classList.remove(classes$4.classHide);
        }

        this.checkVisibleTabLinks();

        this.initNativeScrollbar();
      }
    }

    hideRelatedTab() {
      const relatedSection = this.container.querySelector(selectors$8.dataRelatedSectionElem);
      if (!relatedSection) {
        return;
      }

      const parentTabContent = relatedSection.closest(`${selectors$8.tabContent}.${classes$4.classCurrent}`);
      if (!parentTabContent) {
        return;
      }
      const parentTabContentIdx = parseInt(parentTabContent.getAttribute(selectors$8.dataTabIndex));
      const tabsNavList = this.container.querySelectorAll(selectors$8.tabsLi);

      if (tabsNavList.length > parentTabContentIdx) {
        const nextTabsNavLink = tabsNavList[parentTabContentIdx].nextSibling;

        if (nextTabsNavLink) {
          tabsNavList[parentTabContentIdx].classList.add(classes$4.classHide);
          nextTabsNavLink.dispatchEvent(new Event('click'));
          this.initNativeScrollbar();
        }
      }
    }

    onBlockSelect(evt) {
      const element = this.container.querySelector(`${selectors$8.tabLink}[${selectors$8.blockId}="${evt.detail.blockId}"]`);
      if (element) {
        element.dispatchEvent(new Event('click'));

        element.parentNode.scrollTo({
          top: 0,
          left: element.offsetLeft - element.clientWidth,
          behavior: 'smooth',
        });
      }
    }
  }

  const tabs = {
    onLoad() {
      sections$4[this.id] = [];
      const tabHolders = this.container.querySelectorAll(selectors$8.dataTabsHolder);

      tabHolders.forEach((holder) => {
        sections$4[this.id].push(new GlobalTabs(holder));
      });
    },
    onBlockSelect(e) {
      sections$4[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(e);
        }
      });
    },
  };

  const selectors$7 = {
    productForm: '[data-product-form]',
    productJson: '[data-product-json]',
    popupButton: '[data-toggle-product-modal]',
    zoomButton: '[data-zoom-button]',
    toggleTruncateHolder: '[data-truncated-holder]',
    toggleTruncateButton: '[data-truncated-button]',
    toggleTruncateContent: '[data-truncated-content]',
    toggleTruncateContentAttr: 'data-truncated-content',
  };

  const classes$3 = {
    classExpanded: 'is-expanded',
    classVisible: 'is-visible',
  };

  const sections$3 = [];

  class ProductTemplate {
    constructor(section) {
      this.section = section;
      this.id = section.id;
      this.container = section.container;
      this.settings = section.settings;
      this.productFormElement = this.container.querySelector(selectors$7.productForm);

      modal(this.id);
      this.media = new Media(section);

      const productJSON = this.container.querySelector(selectors$7.productJson);
      if (productJSON && productJSON.innerHTML !== '') {
        this.product = JSON.parse(productJSON.innerHTML);
      } else {
        console.error('Missing product JSON');
        return;
      }

      this.truncateElementHolder = this.container.querySelector(selectors$7.toggleTruncateHolder);
      this.truncateElement = this.container.querySelector(selectors$7.toggleTruncateContent);
      this.resizeEventTruncate = () => this.truncateText();

      this.init();
    }

    init() {
      this.zoomEnabled = this.container.querySelector(selectors$7.zoomButton) !== null;
      if (this.zoomEnabled) {
        productPhotoswipeZoom(this.container, this.product);
      }

      if (this.truncateElementHolder && this.truncateElement) {
        setTimeout(this.resizeEventTruncate, 50);
        document.addEventListener('theme:resize', this.resizeEventTruncate);
      }
    }

    truncateText() {
      if (this.truncateElementHolder.classList.contains(classes$3.classVisible)) return;
      const truncateRows = 5;
      const truncateElementCloned = this.truncateElement.cloneNode(true);
      const truncateElementClass = this.truncateElement.getAttribute(selectors$7.toggleTruncateContentAttr);
      const truncateNextElement = this.truncateElement.nextElementSibling;
      if (truncateNextElement) {
        truncateNextElement.remove();
      }

      this.truncateElement.parentElement.append(truncateElementCloned);

      const truncateAppendedElement = this.truncateElement.nextElementSibling;
      truncateAppendedElement.classList.add(truncateElementClass);
      truncateAppendedElement.removeAttribute(selectors$7.toggleTruncateContentAttr);

      showElement(truncateAppendedElement);

      ellipsed.ellipsis(truncateAppendedElement, truncateRows, {
        replaceStr: '',
      });

      hideElement(truncateAppendedElement);

      if (this.truncateElement.innerHTML !== truncateAppendedElement.innerHTML) {
        this.truncateElementHolder.classList.add(classes$3.classExpanded);
      } else {
        truncateAppendedElement.remove();
        this.truncateElementHolder.classList.remove(classes$3.classExpanded);
      }

      this.toggleTruncatedContent(this.truncateElementHolder);
    }

    toggleTruncatedContent(holder) {
      const toggleButton = holder.querySelector(selectors$7.toggleTruncateButton);
      if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
          e.preventDefault();
          holder.classList.remove(classes$3.classExpanded);
          holder.classList.add(classes$3.classVisible);
        });
      }
    }

    onBlockSelect(event) {
      const block = this.container.querySelector(`[data-block-id="${event.detail.blockId}"]`);
      if (block) {
        block.dispatchEvent(new Event('click'));
      }
    }

    onBlockDeselect(event) {
      const block = this.container.querySelector(`[data-block-id="${event.detail.blockId}"]`);
      if (block) {
        block.dispatchEvent(new Event('click'));
      }
    }

    onUnload() {
      this.media.destroy();
      if (this.truncateElementHolder && this.truncateElement) {
        document.removeEventListener('theme:resize', this.resizeEventTruncate);
      }
    }
  }

  const productSection = {
    onLoad() {
      sections$3[this.id] = new ProductTemplate(this);
    },
    onUnload() {
      if (typeof sections$3[this.id].unload === 'function') {
        sections$3[this.id].unload();
      }
    },
    onBlockSelect(evt) {
      if (typeof sections$3[this.id].onBlockSelect === 'function') {
        sections$3[this.id].onBlockSelect(evt);
      }
    },
    onBlockDeselect(evt) {
      if (typeof sections$3[this.id].onBlockDeselect === 'function') {
        sections$3[this.id].onBlockDeselect(evt);
      }
    },
  };

  register('product', [productSection, pickupAvailability, productAddSection, accordion, tabs, swapperSection]);

  if (!customElements.get('product-form')) {
    customElements.define('product-form', ProductForm);
  }

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  const selectors$6 = {
    toggle: 'data-toggle-grid',
    large: 'data-grid-large',
    small: 'data-grid-small',
  };

  const options = {
    breakpoint: window.theme.sizes.small,
  };

  var sections$2 = {};

  class Toggle {
    constructor(toggle) {
      this.toggle = toggle;
      this.value = this.toggle.getAttribute(selectors$6.toggle);
      this.toggleClickFunction = (evt) => this.toggleClick(evt);

      this.init();
    }

    init() {
      this.toggle.addEventListener('click', this.toggleClickFunction);
    }

    unload() {
      this.toggle.removeEventListener('click', this.toggleClickFunction);
    }

    toggleClick() {
      const isLarge = window.innerWidth >= options.breakpoint;
      const selector = isLarge ? selectors$6.large : selectors$6.small;
      document.querySelector(`[${selector}]`).setAttribute(selector, this.value);
      if (window.lazySizes) {
        window.lazySizes.autoSizer.checkElems();
      }
    }
  }

  const toggleSection = {
    onLoad() {
      sections$2[this.id] = [];
      const buttons = this.container.querySelectorAll(`[${selectors$6.toggle}]`);
      buttons.forEach((button) => {
        sections$2[this.id].push(new Toggle(button));
      });
    },
    onUnload: function () {
      sections$2[this.id].forEach((toggle) => {
        if (typeof toggle.unload === 'function') {
          toggle.unload();
        }
      });
    },
  };

  const selectors$5 = {
    sort: 'data-sort-enabled',
    sortLinks: '[data-sort-link]',
    sortButtonText: '[data-sort-button-text]',
    sortValue: 'data-value',
  };

  const classes$2 = {
    active: 'popout-list__item--current',
  };

  class Sort {
    constructor(section) {
      this.container = section.container;
      this.sort = this.container.querySelector(`[${selectors$5.sort}]`);
      this.sortLinks = this.container.querySelectorAll(selectors$5.sortLinks);
      this.sortButtonText = this.container.querySelector(selectors$5.sortButtonText);

      if (this.sort) {
        this.init();
      }
    }

    init() {
      this.sortLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.sortingResults(e);
        });
      });
    }

    sortingResults(e) {
      const link = e.currentTarget;
      const sort = link.getAttribute(selectors$5.sortValue);
      const text = link.innerText;

      this.sortButtonText.innerText = text;
      this.sortButtonText.parentNode.dispatchEvent(new Event('click'));

      this.sort.querySelector(`.${classes$2.active}`).classList.remove(classes$2.active);
      link.parentNode.classList.add(classes$2.active);

      this.sort.setAttribute(selectors$5.sort, sort);

      this.container.dispatchEvent(
        new CustomEvent('theme:filter:form', {
          bubbles: true,
          detail: {
            params: sort,
          },
        })
      );
    }
  }

  var selectors$4 = {
    collectionNavGrouped: '[data-tag-group]',
    linkAdd: '.link--add',
    linkRemove: '.link--remove',
    swatch: 'data-swatch',
  };

  class Collection {
    constructor(section) {
      this.section = section;
      this.container = this.section.container;
      this.swatches = this.container.querySelectorAll(`[${selectors$4.swatch}]`);
      this.init();
    }

    init() {
      new Sort(this.section);
      this.removeUnusableFilters();
    }

    removeUnusableFilters() {
      // temp tag filters
      const collectionNavGrouped = this.container.querySelectorAll(selectors$4.collectionNavGrouped);
      if (collectionNavGrouped.length > 0) {
        collectionNavGrouped.forEach((element) => {
          const linkAdd = element.querySelector(selectors$4.linkAdd);
          const linkRemove = element.querySelector(selectors$4.linkRemove);

          if (!linkAdd && !linkRemove) {
            hideElement(element);
          }
        });
      }
    }
  }

  const collectionSection = {
    onLoad() {
      this.collection = new Collection(this);
    },
  };

  register('collection', [collectionSection, collectionFiltersSidebar, collectionFiltersForm, toggleSection, swatchGridSection, accordion, siblings]);

  if (!customElements.get('popout-select')) {
    customElements.define('popout-select', PopoutSelect);
  }

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  register('collection-row', [swatchGridSection, siblings]);

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  register('collection-tabs', [tabs, productSliderSection, swatchGridSection]);

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  var styles = {};
  styles.basic = [];
  /* eslint-disable */
  styles.light = [
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'on'}, {lightness: '64'}, {hue: '#ff0000'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},
    {featureType: 'administrative', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f0f0f0'}, {visibility: 'simplified'}]},
    {featureType: 'landscape.natural.landcover', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape.natural.terrain', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry.fill', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'labels', stylers: [{lightness: '100'}]},
    {featureType: 'poi.park', elementType: 'all', stylers: [{visibility: 'on'}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{saturation: '-41'}, {color: '#e8ede7'}]},
    {featureType: 'poi.park', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: '-100'}]},
    {featureType: 'road', elementType: 'labels', stylers: [{lightness: '25'}, {gamma: '1.06'}, {saturation: '-100'}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{gamma: '10.00'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}, {visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{gamma: '10.00'}, {lightness: '100'}, {weight: '0.4'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'simplified'}, {weight: '0.01'}, {lightness: '39'}]},
    {featureType: 'road.local', elementType: 'labels.text.stroke', stylers: [{weight: '0.50'}, {gamma: '10.00'}, {lightness: '100'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#cfe5ee'}, {visibility: 'on'}]},
  ];

  styles.light_blank = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'off'}, {lightness: '64'}, {hue: '#ff0000'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},
    {featureType: 'administrative', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f0f0f0'}, {visibility: 'simplified'}]},
    {featureType: 'landscape.natural.landcover', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape.natural.terrain', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry.fill', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'labels', stylers: [{lightness: '100'}]},
    {featureType: 'poi.park', elementType: 'all', stylers: [{visibility: 'on'}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{saturation: '-41'}, {color: '#e8ede7'}]},
    {featureType: 'poi.park', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: '-100'}]},
    {featureType: 'road', elementType: 'labels', stylers: [{lightness: '25'}, {gamma: '1.06'}, {saturation: '-100'}, {visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{gamma: '10.00'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}, {visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{gamma: '10.00'}, {lightness: '100'}, {weight: '0.4'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'off'}, {weight: '0.01'}, {lightness: '39'}]},
    {featureType: 'road.local', elementType: 'labels.text.stroke', stylers: [{weight: '0.50'}, {gamma: '10.00'}, {lightness: '100'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#cfe5ee'}, {visibility: 'on'}]},
  ];

  styles.white_blank = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#444444'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f2f2f2'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: -100}, {lightness: 45}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#e4e4e4'}, {visibility: 'on'}]},
  ];

  styles.white_label = [
    {featureType: 'all', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{gamma: '3.86'}, {lightness: '100'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#cccccc'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f2f2f2'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: -100}, {lightness: 45}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'labels.text', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#e4e4e4'}, {visibility: 'on'}]},
  ];

  styles.dark_blank = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'all', elementType: 'labels.text.fill', stylers: [{saturation: 36}, {color: '#000000'}, {lightness: 40}]},
    {featureType: 'all', elementType: 'labels.text.stroke', stylers: [{visibility: 'on'}, {color: '#000000'}, {lightness: 16}]},
    {featureType: 'all', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 17}, {weight: 1.2}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 21}]},
    {featureType: 'road', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 17}, {weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 29}, {weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 18}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 16}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 19}]},
    {featureType: 'water', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 17}]},
  ];

  styles.dark_label = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'all', elementType: 'labels.text.fill', stylers: [{saturation: 36}, {color: '#000000'}, {lightness: 40}]},
    {featureType: 'all', elementType: 'labels.text.stroke', stylers: [{visibility: 'on'}, {color: '#000000'}, {lightness: 16}]},
    {featureType: 'all', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 17}, {weight: 1.2}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {lightness: '-82'}]},
    {featureType: 'administrative', elementType: 'labels.text.stroke', stylers: [{invert_lightness: true}, {weight: '7.15'}]},
    {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 21}]},
    {featureType: 'road', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 17}, {weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 29}, {weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 18}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 16}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 19}]},
    {featureType: 'water', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 17}]},
  ];
  /* eslint-enable */

  function mapStyle(key) {
    return styles[key];
  }

  window.theme.allMaps = window.theme.allMaps || {};
  let allMaps = window.theme.allMaps;

  class Map {
    constructor(section) {
      this.container = section.container;
      this.mapWrap = this.container.querySelector('[data-map-container]');
      this.styleString = this.container.getAttribute('data-style') || '';
      this.key = this.container.getAttribute('data-api-key');
      this.zoomString = this.container.getAttribute('data-zoom') || 14;
      this.address = this.container.getAttribute('data-address');
      this.enableCorrection = this.container.getAttribute('data-latlong-correction');
      this.lat = this.container.getAttribute('data-lat');
      this.long = this.container.getAttribute('data-long');
      if (this.key) {
        this.initMaps();
      }
    }

    initMaps() {
      const urlKey = `https://maps.googleapis.com/maps/api/js?key=${this.key}`;
      loadScript({url: urlKey})
        .then(() => {
          return this.enableCorrection === 'true' && this.lat !== '' && this.long !== '' ? new window.google.maps.LatLng(this.lat, this.long) : geocodeAddressPromise(this.address);
        })
        .then((center) => {
          var zoom = parseInt(this.zoomString, 10);
          const styles = mapStyle(this.styleString);
          var mapOptions = {
            zoom,
            styles,
            center,
            draggable: true,
            clickableIcons: false,
            scrollwheel: false,
            zoomControl: false,
            disableDefaultUI: true,
          };
          const map = createMap(this.mapWrap, mapOptions);
          return map;
        })
        .then((map) => {
          this.map = map;
          allMaps[this.id] = map;
        })
        .catch((e) => {
          console.log('Failed to load Google Map');
          console.log(e);
        });
    }

    onUnload() {
      if (typeof window.google !== 'undefined') {
        window.google.maps.event.clearListeners(this.map, 'resize');
      }
    }
  }

  function createMap(container, options) {
    var map = new window.google.maps.Map(container, options);
    var center = map.getCenter();

    new window.google.maps.Marker({
      map: map,
      position: center,
    });

    window.google.maps.event.addDomListener(window, 'resize', function () {
      window.google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
    return map;
  }

  function geocodeAddressPromise(address) {
    return new Promise((resolve, reject) => {
      var geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({address: address}, function (results, status) {
        if (status == 'OK') {
          var latLong = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          resolve(latLong);
        } else {
          reject(status);
        }
      });
    });
  }

  const mapSection = {
    onLoad() {
      allMaps[this.id] = new Map(this);
    },
    onUnload() {
      if (typeof allMaps[this.id].unload === 'function') {
        allMaps[this.id].unload();
      }
    },
  };

  register('section-map', mapSection);

  register('section-columns', popupVideoSection);

  const selectors$3 = {
    dataRelatedSectionElem: '[data-related-section]',
    dataRelatedProduct: '[data-grid-item]',
    dataLimit: 'data-limit',
    dataMinimum: 'data-minimum',
    recentlyViewed: '[data-recent-wrapper]',
    recentlyViewedWrapper: '[data-recently-viewed-wrapper]',
    recentlyProduct: '[data-recently-viewed-products]',
    slider: '[data-slider]',
    gridLarge: 'data-grid-large',
    dataLayout: 'data-layout',
  };

  class Related {
    constructor(section) {
      this.section = section;
      this.container = section.container;

      this.init();

      this.container.addEventListener('recent-products:added', () => {
        this.recent();
      });
    }

    init() {
      const relatedSection = this.container.querySelector(selectors$3.dataRelatedSectionElem);

      if (!relatedSection) {
        return;
      }

      const numberSlides = relatedSection.getAttribute(selectors$3.dataLayout);
      const productId = relatedSection.getAttribute('data-product-id');
      const limit = relatedSection.getAttribute('data-limit');
      const route = window.theme.routes.product_recommendations_url || '/recommendations/products/';
      const requestUrl = `${route}?section_id=related&limit=${limit}&product_id=${productId}`;

      axios
        .get(requestUrl)
        .then((response) => {
          const fresh = document.createElement('div');
          fresh.innerHTML = response.data;

          const inner = fresh.querySelector(selectors$3.dataRelatedSectionElem);

          if (inner.querySelector(selectors$3.dataRelatedProduct)) {
            const innerHtml = inner.innerHTML;
            hideElement(relatedSection);
            relatedSection.innerHTML = innerHtml;
            slideDown(relatedSection);

            makeGridSwatches(relatedSection.parentElement);

            if (relatedSection.querySelector(selectors$3.slider)) {
              relatedSection.querySelector(selectors$3.slider).setAttribute(selectors$3.gridLarge, numberSlides);
              new Slider(relatedSection, relatedSection.querySelector(selectors$3.slider));
            }
          } else {
            relatedSection.dispatchEvent(
              new CustomEvent('tabs:hideRelatedTab', {
                bubbles: true,
              })
            );
          }
        })
        .catch(function (error) {
          console.warn(error);
        });
    }

    recent() {
      const recentlyViewedHolder = this.container.querySelector(selectors$3.recentlyViewed);
      const recentlyViewedWrapper = this.container.querySelector(selectors$3.recentlyViewedWrapper);
      const recentProducts = this.container.querySelectorAll(selectors$3.dataRelatedProduct);

      const minimumNumberProducts = recentlyViewedHolder.hasAttribute(selectors$3.dataMinimum) ? parseInt(recentlyViewedHolder.getAttribute(selectors$3.dataMinimum)) : 4;
      const checkRecentInRelated = !recentlyViewedWrapper && recentProducts.length > 0;
      const checkRecentOutsideRelated = recentlyViewedWrapper && recentProducts.length >= minimumNumberProducts;

      if (checkRecentInRelated || checkRecentOutsideRelated) {
        recentlyViewedHolder.dispatchEvent(
          new CustomEvent('tabs:checkRecentTab', {
            bubbles: true,
          })
        );

        makeGridSwatches(this.container);

        if (recentlyViewedHolder.querySelector(selectors$3.slider)) {
          new Slider(recentlyViewedHolder, recentlyViewedHolder.querySelector(selectors$3.slider));
        }
      }
    }
  }

  const relatedSection = {
    onLoad() {
      this.section = new Related(this);
    },
  };

  register('related', [relatedSection, tabs, recentProducts]);

  if (!customElements.get('radio-swatch')) {
    customElements.define('radio-swatch', RadioSwatch);
  }

  const selectors$2 = {
    ajaxDisable: 'data-ajax-disable',
    shipping: '[data-shipping-estimate-form]',
    input: '[data-update-cart]',
    update: '[data-update-button]',
    bottom: '[data-cart-bottom]',
    upsellProduct: '[data-upsell-holder]',
    upsellButton: '[data-add-action-wrapper]',
  };

  const cartSection = {
    onLoad() {
      const hasShipping = this.container.querySelector(selectors$2.shipping);
      if (hasShipping) {
        new ShippingCalculator(this);
      }

      this.disabled = this.container.getAttribute(selectors$2.ajaxDisable) == 'true';
      if (this.disabled) {
        this.cart = new DisabledCart(this);
        return;
      }

      this.cart = new CartItems(this);
      const initPromise = this.cart.init();
      initPromise.then(() => {
        this.cart.loadHTML();
      });
    },
  };

  class DisabledCart {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.inputs = this.container.querySelectorAll(selectors$2.input);
      this.quantityWrappers = this.container.querySelectorAll(selectors$2.qty);
      this.updateBtn = this.container.querySelector(selectors$2.update);
      this.upsellProduct = this.container.querySelector(selectors$2.upsellProduct);
      this.initQuantity();
      this.initInputs();
      if (this.upsellProduct) {
        this.moveUpsell();
      }
    }

    initQuantity() {
      initQtySection(this.container);
    }

    moveUpsell() {
      const bottom = this.container.querySelector(selectors$2.bottom);
      bottom.insertBefore(this.upsellProduct, bottom.firstChild);
    }

    initInputs() {
      this.inputs.forEach((input) => {
        input.addEventListener(
          'change',
          function () {
            this.updateBtn.classList.add('cart--dirty');
            this.updateBtn.classList.add('heartBeat');
            setTimeout(
              function () {
                this.updateBtn.classList.remove('heartBeat');
              }.bind(this),
              1300
            );
          }.bind(this)
        );
      });
    }
  }

  register('cart', [cartSection, accordion]);

  if (!customElements.get('upsell-product')) {
    customElements.define('upsell-product', UpsellProduct);
  }

  register('accordion-single', accordion);

  const fadeIn = (el, display, callback = null) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';

    (function fade() {
      let val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }

      if (val === 1 && typeof callback === 'function') {
        callback();
      }
    })();
  };

  const fadeOut = (el, callback = null) => {
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }

      if (parseFloat(el.style.opacity) === 0 && typeof callback === 'function') {
        callback();
      }
    })();
  };

  const selectors$1 = {
    newsletterForm: '[data-newsletter-form]',
  };

  const classes$1 = {
    success: 'has-success',
    error: 'has-error',
  };

  const sections$1 = {};

  class NewsletterCheckForResult {
    constructor(newsletter) {
      this.sessionStorage = window.sessionStorage;
      this.newsletter = newsletter;

      this.stopSubmit = true;
      this.isChallengePage = false;
      this.formID = null;

      this.checkForChallengePage();

      this.newsletterSubmit = (e) => this.newsletterSubmitEvent(e);

      if (!this.isChallengePage) {
        this.init();
      }
    }

    init() {
      this.newsletter.addEventListener('submit', this.newsletterSubmit);

      this.showMessage();
    }

    newsletterSubmitEvent(e) {
      if (this.stopSubmit) {
        e.preventDefault();

        this.removeStorage();
        this.writeStorage();
        this.stopSubmit = false;
        this.newsletter.submit();
      }
    }

    checkForChallengePage() {
      this.isChallengePage = window.location.pathname === '/challenge';
    }

    writeStorage() {
      if (this.sessionStorage !== undefined) {
        this.sessionStorage.setItem('newsletter_form_id', this.newsletter.id);
      }
    }

    readStorage() {
      this.formID = this.sessionStorage.getItem('newsletter_form_id');
    }

    removeStorage() {
      this.sessionStorage.removeItem('newsletter_form_id');
    }

    showMessage() {
      this.readStorage();

      if (this.newsletter.id === this.formID) {
        const newsletter = document.getElementById(this.formID);

        if (window.location.search.indexOf('?customer_posted=true') !== -1) {
          newsletter.classList.remove(classes$1.error);
          newsletter.classList.add(classes$1.success);
        } else if (window.location.search.indexOf('accepts_marketing') !== -1) {
          newsletter.classList.remove(classes$1.success);
          newsletter.classList.add(classes$1.error);
        }

        this.scrollToForm(newsletter);
      }
    }

    scrollToForm(newsletter) {
      const rect = newsletter.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);

      if (!isVisible) {
        setTimeout(() => {
          window.scroll({
            top: rect.top,
            left: 0,
            behavior: 'smooth',
          });
        }, 400);
      }
    }

    unload() {
      this.newsletter.removeEventListener('submit', this.newsletterSubmit);
    }
  }

  const newsletterCheckForResultSection = {
    onLoad() {
      sections$1[this.id] = [];
      const newsletters = this.container.querySelectorAll(selectors$1.newsletterForm);
      newsletters.forEach((form) => {
        sections$1[this.id].push(new NewsletterCheckForResult(form));
      });
    },
    onUnload() {
      sections$1[this.id].forEach((form) => {
        if (typeof form.unload === 'function') {
          form.unload();
        }
      });
    },
  };

  const selectors = {
    tracking: '[data-tracking-consent]',
    trackingAccept: '[data-confirm-cookies]',
    close: '[data-close-modal]',
    popupInner: '[data-popup-inner]',
    newsletterPopup: '[data-newsletter]',
    newsletterPopupHolder: '[data-newsletter-holder]',
    newsletterField: '[data-newsletter-field]',
    newsletterForm: '[data-newsletter-form]',
    promoPopup: '[data-promo-text]',
    delayAttribite: 'data-popup-delay',
    cookieNameAttribute: 'data-cookie-name',
    dataTargetReferrer: 'data-target-referrer',
  };

  const classes = {
    hide: 'hide',
    hasValue: 'has-value',
    success: 'has-success',
    desktop: 'desktop',
    mobile: 'mobile',
  };

  let sections = {};

  class PopupCookie {
    constructor(name, value) {
      this.configuration = {
        expires: null, // session cookie
        path: '/',
        domain: window.location.hostname,
      };
      this.name = name;
      this.value = value;
    }

    write() {
      const hasCookie = document.cookie.indexOf('; ') !== -1 && !document.cookie.split('; ').find((row) => row.startsWith(this.name));
      if (hasCookie || document.cookie.indexOf('; ') === -1) {
        document.cookie = `${this.name}=${this.value}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      }
    }

    read() {
      if (document.cookie.indexOf('; ') !== -1 && document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
        const returnCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith(this.name))
          .split('=')[1];

        return returnCookie;
      } else return false;
    }

    destroy() {
      if (document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
        document.cookie = `${this.name}=null; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      }
    }
  }

  class DelayShow {
    constructor(holder, element) {
      this.element = element;
      this.delay = holder.getAttribute(selectors.delayAttribite);

      if (this.delay === 'always') {
        this.always();
      }

      if (this.delay === 'delayed') {
        this.delayed();
      }

      if (this.delay === 'bottom') {
        this.bottom();
      }

      if (this.delay === 'idle') {
        this.idle();
      }
    }

    always() {
      fadeIn(this.element);
    }

    delayed() {
      // Show popup after 10s
      setTimeout(() => {
        fadeIn(this.element);
      }, 10000);
    }

    // Scroll to the bottom of the page
    bottom() {
      window.addEventListener('scroll', () => {
        if (window.scrollY + window.innerHeight >= document.body.clientHeight) {
          fadeIn(this.element);
        }
      });
    }

    // Idle for 1 min
    idle() {
      let timer = 0;
      let idleTime = 60000;
      const documentEvents = ['mousemove', 'mousedown', 'click', 'touchmove', 'touchstart', 'touchend', 'keydown', 'keypress'];
      const windowEvents = ['load', 'resize', 'scroll'];

      const startTimer = () => {
        timer = setTimeout(() => {
          timer = 0;
          fadeIn(this.element);
        }, idleTime);

        documentEvents.forEach((eventType) => {
          document.addEventListener(eventType, resetTimer);
        });

        windowEvents.forEach((eventType) => {
          window.addEventListener(eventType, resetTimer);
        });
      };

      const resetTimer = () => {
        if (timer) {
          clearTimeout(timer);
        }

        documentEvents.forEach((eventType) => {
          document.removeEventListener(eventType, resetTimer);
        });

        windowEvents.forEach((eventType) => {
          window.removeEventListener(eventType, resetTimer);
        });

        startTimer();
      };

      startTimer();
    }
  }

  class TargetReferrer {
    constructor(el) {
      this.el = el;
      this.locationPath = location.href;

      if (!this.el.hasAttribute(selectors.dataTargetReferrer)) {
        return;
      }

      this.init();
    }

    init() {
      if (this.locationPath.indexOf(this.el.getAttribute(selectors.dataTargetReferrer)) === -1 && !window.Shopify.designMode) {
        this.el.parentNode.removeChild(this.el);
      }
    }
  }

  class Tracking {
    constructor(el) {
      this.popup = el;
      this.modal = document.querySelector(selectors.tracking);
      this.modalInner = this.popup.querySelector(selectors.popupInner);
      this.close = this.modal.querySelector(selectors.close);
      this.acceptButton = this.modal.querySelector(selectors.trackingAccept);
      this.enable = this.modal.getAttribute('data-enable') === 'true';
      this.showPopup = false;

      window.Shopify.loadFeatures(
        [
          {
            name: 'consent-tracking-api',
            version: '0.1',
          },
        ],
        (error) => {
          if (error) {
            throw error;
          }

          const userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked();
          const userTrackingConsent = window.Shopify.customerPrivacy.getTrackingConsent();

          this.showPopup = !userCanBeTracked && userTrackingConsent === 'no_interaction' && this.enable;

          if (window.Shopify.designMode) {
            this.showPopup = true;
          }

          this.init();
        }
      );
    }

    init() {
      if (this.showPopup) {
        fadeIn(this.modalInner);
      }

      this.clickEvents();
    }

    clickEvents() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        window.Shopify.customerPrivacy.setTrackingConsent(false, () => fadeOut(this.modalInner));
      });

      this.acceptButton.addEventListener('click', (event) => {
        event.preventDefault();

        window.Shopify.customerPrivacy.setTrackingConsent(true, () => fadeOut(this.modalInner));
      });

      document.addEventListener('trackingConsentAccepted', function () {
        console.log('trackingConsentAccepted event fired');
      });
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target) && this.showPopup) {
        fadeIn(this.modalInner);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.modalInner);
      }
    }
  }

  class PromoText {
    constructor(el) {
      this.popup = el;
      this.popupInner = this.popup.querySelector(selectors.popupInner);
      this.close = this.popup.querySelector(selectors.close);
      this.cookie = new PopupCookie(this.popup.getAttribute(selectors.cookieNameAttribute), 'user_has_closed');
      this.isTargeted = new TargetReferrer(this.popup);
      this.hasDeviceClass = '';

      this.init();
    }

    init() {
      const cookieExists = this.cookie.read() !== false;

      if (!cookieExists || window.Shopify.designMode) {
        if (!window.Shopify.designMode) {
          new DelayShow(this.popup, this.popupInner);
        } else {
          fadeIn(this.popupInner);
        }

        this.clickEvents();
      }
    }

    clickEvents() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        fadeOut(this.popupInner);
        this.cookie.write();
      });
    }

    onBlockSelect(evt) {
      if (this.popup.classList.contains(classes.mobile)) {
        this.hasDeviceClass = classes.mobile;
      }

      if (this.popup.classList.contains(classes.desktop)) {
        this.hasDeviceClass = classes.desktop;
      }

      if (this.hasDeviceClass !== '') {
        this.popup.classList.remove(this.hasDeviceClass);
      }

      if (this.popup.contains(evt.target)) {
        fadeIn(this.popupInner);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.popupInner);
      }

      if (this.hasDeviceClass !== '') {
        this.popup.classList.add(this.hasDeviceClass);
      }
    }
  }

  class NewsletterPopup {
    constructor(el) {
      this.popup = el;
      this.popupInner = this.popup.querySelector(selectors.popupInner);
      this.holder = this.popup.querySelector(selectors.newsletterPopupHolder);
      this.close = this.popup.querySelector(selectors.close);
      this.newsletterField = this.popup.querySelector(selectors.newsletterField);
      this.cookie = new PopupCookie(this.popup.getAttribute(selectors.cookieNameAttribute), 'newsletter_is_closed');
      this.form = this.popup.querySelector(selectors.newsletterForm);
      this.isTargeted = new TargetReferrer(this.popup);

      this.init();
    }

    init() {
      const cookieExists = this.cookie.read() !== false;

      if (!cookieExists || window.Shopify.designMode) {
        this.show();

        if (this.form.classList.contains(classes.success)) {
          this.checkForSuccess();
        }
      }
    }

    show() {
      if (!window.Shopify.designMode) {
        new DelayShow(this.popup, this.popupInner);
      } else {
        fadeIn(this.popupInner);
      }

      this.inputField();
      this.closePopup();
    }

    checkForSuccess() {
      fadeIn(this.popupInner);
      this.cookie.write();
    }

    closePopup() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        fadeOut(this.popupInner);
        this.cookie.write();
      });
    }

    inputField() {
      this.newsletterField.addEventListener('input', () => {
        if (this.newsletterField.value !== '') {
          this.holder.classList.add(classes.hasValue, this.newsletterField.value !== '');
        }
      });

      this.newsletterField.addEventListener('focus', () => {
        if (this.newsletterField.value !== '') {
          this.holder.classList.add(classes.hasValue, this.newsletterField.value !== '');
        }
      });

      this.newsletterField.addEventListener('focusout', () => {
        setTimeout(() => {
          this.holder.classList.remove(classes.hasValue);
        }, 2000);
      });
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeIn(this.popupInner);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.popupInner);
      }
    }
  }

  const popupSection = {
    onLoad() {
      sections[this.id] = [];

      const tracking = this.container.querySelectorAll(selectors.tracking);
      tracking.forEach((el) => {
        sections[this.id].push(new Tracking(el));
      });

      const newsletterPopup = this.container.querySelectorAll(selectors.newsletterPopup);
      newsletterPopup.forEach((el) => {
        sections[this.id].push(new NewsletterPopup(el));
      });

      const promoPopup = this.container.querySelectorAll(selectors.promoPopup);
      promoPopup.forEach((el) => {
        sections[this.id].push(new PromoText(el));
      });
    },
    onBlockSelect(evt) {
      sections[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
  };

  register('popups', [popupSection, newsletterCheckForResultSection]);

  register('tabs', tabs);

  const wrap = (toWrap, wrapperClass = '', wrapper) => {
    wrapper = wrapper || document.createElement('div');
    wrapper.classList.add(wrapperClass);
    toWrap.parentNode.insertBefore(wrapper, toWrap);
    return wrapper.appendChild(toWrap);
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.isRTL = document.documentElement.getAttribute('dir') === 'rtl';

    // Load all registered sections on the page.
    load('*');

    // Animate on scroll
    if (window.theme.settings.animate_scroll) {
      AOS.init({once: true});
      document.body.classList.add('aos-initialized');
      document.body.classList.add('theme-animate-scroll');
    }

    // Animate on hover
    if (window.theme.settings.animate_hover) {
      document.body.classList.add('theme-animate-hover');
    }

    // When images load, clear the background color
    document.addEventListener('lazyloaded', function (event) {
      const lazyImage = event.target.parentNode;
      if (lazyImage.classList.contains('lazy-image')) {
        lazyImage.style.backgroundImage = 'none';
      }
    });

    // Target tables to make them scrollable
    const tableSelectors = '.rte table';
    const tables = document.querySelectorAll(tableSelectors);
    tables.forEach((table) => {
      wrap(table, 'rte__table-wrapper');
    });

    // Target iframes to make them responsive
    const iframeSelectors = '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"], .rte iframe#admin_bar_iframe';
    const frames = document.querySelectorAll(iframeSelectors);
    frames.forEach((frame) => {
      wrap(frame, 'rte__video-wrapper');
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('focus-enabled');
    });
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 9) {
        document.body.classList.add('focus-enabled');
      }
    });

    // Apply a specific class to the html element for browser support of cookies.
    if (window.navigator.cookieEnabled) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }

    // Common a11y fixes
    focusHash();
    bindInPageLinks();

    let hasNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    if (!hasNativeSmoothScroll) {
      loadScript({url: window.theme.assets.smoothscroll});
    }
  });

}(themeVendor.FlickityFade, themeVendor.BodyScrollLock, themeVendor.MicroModal, themeVendor.Rellax, themeVendor.Flickity, themeVendor.themeCurrency, themeVendor.Sqrl, themeVendor.axios, themeVendor.themeAddresses, themeVendor.ellipsis, themeVendor.FlickitySync, themeVendor.AOS));
