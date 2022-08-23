/*
* Pipeline Theme
*
* Use this file to add custom Javascript to Pipeline.  Keeping your custom
* Javascript in this fill will make it easier to update Pipeline. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*
*/


(function() {


  function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  document.querySelectorAll('.metafield-multi_line_text_field').forEach(function(item) {
    item.innerHTML = htmlDecode(item.innerHTML);
  });

  function handleErrors(response) {
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

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // To show and hide search result
  window.onload = () => {
    if (document.querySelector('[data-search-page]')) {
      var title = document.querySelector('title').innerText;
      var count = document.querySelectorAll('[data-products-grid] .grid').length;

      document.querySelectorAll('[data-products-grid] .grid').forEach((el) => {
          el.style.display = 'block';
          if (el.nextElementSibling) {
            el.nextElementSibling.style.display = 'block';
          }
          if (localStorage.getItem("blog-search") == "1" && el.querySelector('a').getAttribute("href").indexOf("guides-advice") < 0) {
            count --;
            el.style.display = 'none';
            if (el.nextElementSibling) {
              el.nextElementSibling.style.display = 'none';
            }
          }
      });

      if (count != document.querySelectorAll('[data-products-grid] .grid').length) {
        title = title.substring(0, title.indexOf('results') - 2) + count + title.substring(title.indexOf('results') - 1);
        title = count == 1 ? title.replace("results", "result") : title ;
        document.querySelector('title').innerText = title;
      }
      document.querySelector('.loading-icon').style.display = 'none';
    }

    // Price Form
    if (document.querySelector('[data-popup-custom]')) {
      document.querySelectorAll('[data-popup-custom]').forEach((el) => {
        el.addEventListener('click', function() {
          document.getElementById(this.dataset.popupCustom).ariaHidden = 'false';
          document.getElementById(this.dataset.popupCustom).classList.add('is-open');
        });
      });
    }

    if(document.querySelector('[data-form-success]')) {
      document.querySelector('.form-success').classList.remove('hidden');
    }

    // Terms modal
    if (document.querySelector('[data-popup-terms]')) {
      document.querySelector('[data-popup-terms]').addEventListener('click', function() {
        document.getElementById(this.dataset.popupTerms).ariaHidden = 'false';
        document.getElementById(this.dataset.popupTerms).classList.add('is-open');
      });
    }

    // Disable add to cart button
    const addButton = document.querySelector('[data-add-to-cart]');
    if (addButton && addButton.dataset.disable == 'true') {
      addButton.disabled = true;
    }

    if (document.querySelector('.terms_checkbox input')) {
      document.querySelector('.terms_checkbox input').addEventListener('change', (e) => {
        if (e.target.checked == true) {
          addButton.disabled = false;
        }
        else {
          addButton.disabled = true;
        }
      });
    }

    document.addEventListener('click', function(event) {
      document.querySelectorAll('[data-modal-content]').forEach((el) => {
        if (!el.contains(event.target) && !event.target.dataset.popupCustom) {
          el.parentElement.parentElement.ariaHidden = 'true';
          el.parentElement.parentElement.classList.remove('is-open');
        }
      });
    });
  }

  if (!document.querySelector('[data-search-page]')) {
    localStorage.setItem("blog-search", "0");
  }

  // Predictive search on blog page
  const blogSearchContainer = document.querySelector('[data-predictive-blog-search-results]');

  if (blogSearchContainer) {
    document.addEventListener('click', function(event) {
      var isClickInsideElement = blogSearchContainer.contains(event.target);
      if (!isClickInsideElement) {
          //Do something click is outside specified element
        blogSearchContainer.style.display = 'none';
      }
    }); 

    document.querySelector('[data-predictive-blog-search-input]').addEventListener('input', debounce((e) => {
      localStorage.setItem("blog-search", "1");
      const val = e.target.value;
      var wrapper = document.querySelector('[data-predictive-blog-search-results] .wrapper');
      var loader = document.querySelector('[data-blog-search-loading-indicator]');
      wrapper.innerHTML = '';
      
      if (val && val.length > 1) {
        loader.style.display = 'block';
        blogSearchContainer.style.display = 'block';
        fetch(`/search/suggest.json?q=${val}&resources[type]=article&resources[options][unavailable_products]=last`)
        .then(handleErrors)
        .then((response) => response.json())
        .then((response) => {
          const results = response.resources.results.articles;
          
          for (var i = 0; i < results.length; i ++) {
            var title = results[i].title;
            var url = results[i].url;
            if (url.indexOf('guides-advice') > -1) {
              wrapper.innerHTML += `<div class="other__inline animates"><p class="other__inline__title"><a href="${url}">${title}</a></p></div>`;
            }
          }

        })
        .finally(() => {
          loader.style.display = 'none';
        })
      }
      else {
        loader.style.display = 'none';
        wrapper.innerHTML = '';
      }
    }, 500));
  }

  // Accordion filter on blog page
  const triggers = document.querySelectorAll('[data-blog-filter-trigger]');

  if (triggers) {
    triggers.forEach((ele) => {
      ele.addEventListener('click', (e) => {
        let el = ele.nextElementSibling;

        if (ele.classList.contains('accordion-is-open')) {
          ele.classList.remove('accordion-is-open');

          el.style.transitionTimingFunction = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
          el.style.transitionProperty = 'height, margin, padding';
          el.style.transitionDuration = 500 + 'ms';
          el.style.boxSizing = 'border-box';
          el.style.height = el.offsetHeight + 'px';
          el.offsetHeight;
          el.style.overflow = 'hidden';
          el.style.height = 0;
          el.style.paddingTop = 0;
          el.style.paddingBottom = 0;
          el.style.marginTop = 0;
          el.style.marginBottom = 0;
          window.setTimeout(() => {
            el.style.display = 'none';
            el.style.removeProperty('height');
            el.style.removeProperty('padding-top');
            el.style.removeProperty('padding-bottom');
            el.style.removeProperty('margin-top');
            el.style.removeProperty('margin-bottom');
            el.style.removeProperty('overflow');
            el.style.removeProperty('transition-duration');
            el.style.removeProperty('transition-property');
            el.style.removeProperty('transition-timing-function');
          }, 500);
        }
        else {
          ele.classList.add('accordion-is-open');
          el.style.display = 'block';

          let height = el.offsetHeight;
          el.style.overflow = 'hidden';
          el.style.height = 0;
          el.style.paddingTop = 0;
          el.style.paddingBottom = 0;
          el.style.marginTop = 0;
          el.style.marginBottom = 0;
          el.offsetHeight;
          el.style.boxSizing = 'border-box';
          el.style.transitionTimingFunction = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
          el.style.transitionProperty = 'height, margin, padding';
          el.style.transitionDuration = 500 + 'ms';
          el.style.height = height + 'px';
          el.style.removeProperty('padding-top');
          el.style.removeProperty('padding-bottom');
          el.style.removeProperty('margin-top');
          el.style.removeProperty('margin-bottom');
          window.setTimeout(() => {
            el.style.removeProperty('height');
            el.style.removeProperty('overflow');
            el.style.removeProperty('transition-duration');
            el.style.removeProperty('transition-property');
            el.style.removeProperty('transition-timing-function');
          }, 500);
        }
      })
    });
  }

})();
