(function ($) {
  "use strict";

  // ===== Right-side menu (no overlay) =====
  (function () {
    function openMenu() {
      $('.menu').addClass('clicked').attr('aria-expanded', 'true');
      $('#nav').addClass('show');
      $('.overlay').removeClass('show'); // 혹시 켜져 있으면 강제 제거
    }
    function closeMenu() {
      $('.menu').removeClass('clicked').attr('aria-expanded', 'false');
      $('#nav').removeClass('show');
      $('.overlay').removeClass('show');
    }

    // 햄버거 클릭 → 열기/닫기
    $(document).on('click', '.menu', function () {
      if ($('#nav').hasClass('show')) closeMenu();
      else openMenu();
    });

    // 메뉴 링크 클릭 / 햄버거(X 상태) 클릭 → 닫기
    $(document)
      .on('click', '#nav a', closeMenu)
      .on('click', '.menu.clicked', closeMenu);

    // 패널 밖 클릭 → 닫기
    $(document).on('click', function (e) {
      if (!$('#nav').hasClass('show')) return;
      if ($(e.target).closest('#nav, .menu').length === 0) closeMenu();
    });

    // ESC 키 → 닫기
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $('#nav').hasClass('show')) closeMenu();
    });
  })();

 

  /* ==========================================
   * Portfolio modal + Slick (lazy init)
   *  - 모달 열린 뒤 최초 1회만 초기화
   *  - 클릭한 카드 인덱스로 진입
   *  - 배경 스크롤 고정/복원
   * ==========================================*/
  (function () {
    var savedScrollTop = 0;
    var $modal = $('#modal-id');
    var $main  = $('.port-slider');
    var $nav   = $('.port-slider-nav');

    // 상세보기(돋보기) 아이콘 클릭: 점프 방지 + 인덱스 저장 + 배경 스크롤 고정
    $(document).on('click', '.port-item .fa-search', function (e) {
      e.preventDefault();

      var idx = parseInt($(this).attr('data-index'), 10) || 0;
      $modal.data('start-index', idx);

      savedScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      $('body').css({ position: 'fixed', top: -savedScrollTop + 'px', width: '100%' });

      $modal.modal('show');
    });

    // 모달 표시 후 최초 1회 slick 초기화
    $modal.one('shown.bs.modal', function () {
      if ($main.length && !$main.hasClass('slick-initialized')) {
        $main.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          prevArrow: '<button type="button" class="slick-arrow slick-prev" aria-label="Previous">❮</button>',
          nextArrow: '<button type="button" class="slick-arrow slick-next" aria-label="Next">❯</button>',
          asNavFor: '.port-slider-nav',
          adaptiveHeight: true,
          speed: 300,
          lazyLoad: 'ondemand'
        });
      }

      if ($nav.length && !$nav.hasClass('slick-initialized')) {
        $nav.slick({
          slidesToShow: 6,
          slidesToScroll: 1,
          asNavFor: '.port-slider',
          focusOnSelect: true,
          arrows: false,
          lazyLoad: 'ondemand',
          responsive: [
            { breakpoint: 992, settings: { slidesToShow: 5 } },
            { breakpoint: 768, settings: { slidesToShow: 4 } },
            { breakpoint: 576, settings: { slidesToShow: 3 } }
          ]
        });
      }

      // 시작 인덱스로 이동
      var idx = $modal.data('start-index') || 0;
      if ($main.hasClass('slick-initialized')) $main.slick('slickGoTo', idx, true);
      if ($nav.hasClass('slick-initialized'))  $nav.slick('slickGoTo',  idx, true);
    });

    // 모달 닫힐 때: 고정 해제 + 스크롤 복원
    $modal.on('hidden.bs.modal', function () {
      $('body').attr('style', '');
      window.scrollTo(0, savedScrollTop);
    });
  })();


// ===== Back to Top =====
(function () {
  // 스크롤 시 버튼 표시/숨김
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 200) {
      $('.back-to-top').fadeIn(200);
    } else {
      $('.back-to-top').fadeOut(200);
    }
  });

  // 클릭 시 부드럽게 상단으로 이동
  $(document).on('click', '.back-to-top', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 600);
  });
})();



})(jQuery);
