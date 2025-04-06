// ================================
// Dark Mode Check
// ================================
if (window.localStorage.getItem('theme') === "Dark") {
  $('body').attr('data-theme', 'Dark');
  $(".toggle-dark-mode").removeClass("fa-moon").addClass("fa-sun");
}

if (window.localStorage.getItem('theme') === "Light") {
  $('body').attr('data-theme', 'Light');
  $(".toggle-dark-mode").removeClass("fa-sun").addClass("fa-moon");
}

// ================================
// Parse the URL parameter
// ================================
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Give the parameter a variable name
var action = getParameterByName('action');
var stripe = getParameterByName('stripe');

$(document).ready(function() {
  // ================================
  // Set Body Class
  // ================================
  if (action == 'subscribe') {
    $('body').addClass("subscribe-success");
  }
  if (action == 'signup') {
    window.location = '{{@site.url}}/signup/?action=checkout';
  }
  if (action == 'checkout') {
    $('body').addClass("signup-success");
  }
  if (action == 'signin') {
    $('body').addClass("signin-success");
  }
  if (stripe == 'success') {
    $('body').addClass("checkout-success");
  }
  if (stripe == 'billing-update-success') {
    $('body').addClass("billing-success");
  }
  if (stripe == 'billing-update-cancel') {
    $('body').addClass("billing-cancel");
  }

  // ================================
  // Testimonials
  // ================================
  if ($(".scroller").length > 0) {
    var variableWidth = $(".testimonials-slider").hasClass("fullwidth");

    $(".scroller").slick({
      centerMode: true,
      slidesToShow: 1,
      variableWidth: variableWidth,
      dots: true,
      arrows: false,
      focusOnSelect: true,
      adaptiveHeight: true,
      speed: 600,
      cssEase: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
      responsive: [
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            slidesToShow: 1,
            variableWidth: false,
          },
        },
      ],
    });
  }

  // ================================
  // Portfolio
  // ================================
  if ($(".portfolio-tag-filter").length > 0) {
    var tag_list = [];
    $(".portfolio-item").each(function() {
      var tags = $(this).attr("data-tags").split(",");

      $.each(tags, function(i) {
        if ($.inArray(tags[i], tag_list) === -1 && tags[i] !== "") {
          tag_list.push(tags[i]);
        }
      });
    });

    $.each(tag_list.sort(), function(i) {
      $(".portfolio-tag-filter").append('<li><a href="javascript:;" data-tag="' + tag_list[i] + '">' + tag_list[i] + '</a></li>');
    });

    $(".portfolio-tag-filter li a").click(function() {
      $(".portfolio-tag-filter li a").removeClass("active");
      $(this).addClass("active");

      var tag = $(this).attr("data-tag");

      if (tag === "all") {
        $(".portfolio-item").removeClass("hidden");
        return false;
      }

      $(".portfolio-item").removeClass("hidden").not('[data-tags*="' + tag + '"]').addClass("hidden");
    });

    var grid = document.querySelector(".portfolio-items");
    animateCSSGrid.wrapGrid(grid, {duration : 400, easing :'easeOut'});
  }

  // ================================
  // Disqus comments
  // ================================
  if ($(".disqus-lazy").length > 0) {
    disqusLazy();
  }

  // ================================
  // Image zooms
  // ================================
  $('.post-content img').not('.post-image-responsive').attr('data-zoomable', 'true');

  // If the image is inside a link, remove zoom
  $('.post-content a img').removeAttr('data-zoomable');

  var background = '#ffffff';
  if ($('body').hasClass('dark-mode')) {
    background = '#222327';
  }

  mediumZoom('[data-zoomable]', {
    background: background,
    margin: 50
  });

  // ================================
  // Responsive video embeds
  // ================================
  var postContent = $(".post-content");
  postContent.fitVids({
    'customSelector': [
      'iframe[src*="ted.com"]',
      'iframe[src*="player.twitch.tv"]',
      'iframe[src*="dailymotion.com"]',
      'iframe[src*="facebook.com"]'
    ]
  });

  // ================================
  // Image gallery
  // ================================
  var images = document.querySelectorAll('.kg-gallery-image img');
  images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });

  // ================================
  // Mobile Nav
  // ================================
  $('.nav-toggle').click(function () {
    if (!$(this).hasClass('active')) {
      $(this).addClass('active');
      $('.nav').addClass('active').fadeIn();
    } else {
      $(this).removeClass('active');
      $('.nav').fadeOut("normal", function() {
        $(this).removeClass('active');
      });
    }
  });

  // ================================
  // Account navigation menu
  // ================================
  $('.nav-dropdown > a').click(function(event) {
    $('.nav-dropdown a').removeClass('active');
    $(this).toggleClass('active');
    event.stopPropagation();
  });

  $('body').click(function () {
    $('.nav-dropdown a').removeClass('active');
  });

  // ================================
  // Dark Mode Toggle
  // ================================
  if ($(".toggle-dark-mode").length > 0) {
    $(".toggle-dark-mode").click(function() {
      if(window.localStorage.getItem('theme') === 'Dark') {
       $('body').attr('data-theme', 'Light');
       window.localStorage.setItem('theme', 'Light');
       $(".toggle-dark-mode").removeClass("fa-sun").addClass("fa-moon");
      } else {
        $('body').attr('data-theme', 'Dark');
        window.localStorage.setItem('theme', 'Dark');
        $(".toggle-dark-mode").removeClass("fa-moon").addClass("fa-sun");
      }
    });
  }

  // ================================
  // Notifications
  // ================================
  $('.notification-close').click(function () {
    $(this).parent().addClass('closed');
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
      var clean_uri = uri.substring(0, uri.indexOf("?"));
      window.history.replaceState({}, document.title, clean_uri);
    }
  });

  // ================================
  // Clipboard URL Copy
  // ================================
  var url = document.location.href;

  var clipboard = new ClipboardJS('.js-share__link--clipboard', {
    text: function() {
      return url;
    }
  });

  clipboard.on('success', function(e) {
    $(".copy-success").fadeIn("fast", function() {
      setTimeout(function() {
        $(".copy-success").fadeOut();
      }, 3000);
    });
  });

  // ================================
  // Infinite Scroll
  // ================================
  const nextPage = document.getElementById('next');

  if (nextPage) {
    var infScroll = new InfiniteScroll('.post-grid', {
      path: '#next',
      append: '.post-card',
      history: false,
      button: '#loadmore',
      hideNav: '#next',
      scrollThreshold: false
    });

    infScroll.on('append', function(response, path, items) {
      for (var i = 0; i < items.length; i++) {
        reloadSrcsetImgs(items[i]);
      }
    });

    function reloadSrcsetImgs(item) {
      var imgs = item.querySelectorAll('img[srcset]');
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        img.outerHTML = img.outerHTML;
      }
    }
  }
});
