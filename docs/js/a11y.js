'use strict';

$(function(){

  // 탭
  if ( $('._a11y_tab').length >= 1 ) {
    $('._a11y_tab').each(function () {
      var welWrap = $(this);
      var welTabList = welWrap.find('[role=tablist]');
      var welTabBtn = welWrap.find('[role=tab]');
      var welTabPanel = welWrap.find('[role=tabpanel]');
      var nTabActive = welTabBtn.index( welWrap.find('[role=tab][aria-selected=true]') );
      var nTabFocus = nTabActive;
      welTabList
        .on('click', '[role=tab]', function (e) {
          var welActiveTabBtn = $(this);
          nTabFocus = welTabBtn.index( welActiveTabBtn ) ;
          nTabActive = nTabFocus;
          welTabBtn.attr({'aria-selected':'false','tabindex':'-1'});
          welActiveTabBtn.attr({'aria-selected':'true'}).removeAttr('tabindex');
          welTabPanel.hide().removeAttr('tabindex');
          welTabPanel.eq(nTabFocus).show().attr('tabindex','0');
        })
        .on('keydown', '[role=tab]', function (e) {
          if ( e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 39 ) {
            if ( e.keyCode === 37 || e.keyCode === 39 ) { e.preventDefault(); }
            $(welTabBtn[nTabFocus]).attr('tabindex','-1');
            // 방향키 왼쪽
            if ( e.keyCode === 37 ) {
              nTabFocus--;
              if ( nTabFocus < 0 ) { nTabFocus = welTabBtn.length - 1; }
            }
            // 방향키 오른쪽
            if ( e.keyCode === 39 ) {
              nTabFocus++;
              if ( nTabFocus >= welTabBtn.length ) { nTabFocus = 0; }
            }
            // 탭
            if ( e.keyCode === 9 ) {
              if (nTabFocus !== nTabActive) { nTabFocus = nTabActive; }
            }
            $(welTabBtn[nTabFocus]).removeAttr('tabindex');
            $(welTabBtn[nTabFocus]).trigger('focus');
          }
        });
    });
  }

  // 셀렉트
  if ( $('._a11y_select').length >= 1 ) {
    $("._a11y_select").each(function () {
      var welWrap = $(this);
      var welCombobox = welWrap.find('[role=combobox]');
      var welListbox = welWrap.find('[role=listbox]');
      var welPanel = welListbox.parent();
      var welOption = welWrap.find('[role=option]');
      welCombobox
        .on('click', function () {
          if ( welCombobox.attr('aria-expanded') === 'false' ) {
            welCombobox.attr('aria-expanded','true');
            welPanel.show();
            welListbox.find('[role=option][aria-selected=true]').trigger('focus');
          } else {
            welCombobox.attr('aria-expanded','false');
            welPanel.hide();
          }
        })
        .on('keydown', function (e) {
          var nCurrent = welOption.index( welListbox.find('[role=option][aria-selected=true]') );
          if ( e.keyCode === 38 || e.keyCode === 40 ) {
            // 방향키 위, 방향키 아래 무시
            e.preventDefault();
            // 방향키 위 && 옵션 첫번째가 아닐 때
            if ( e.keyCode === 38 && nCurrent > 0 ){ nCurrent--; }
            // 방향키 아래 && 옵션 마지막이 아닐 때
            if ( e.keyCode === 40 && nCurrent < welOption.length - 1 ){ nCurrent++; }
            welOption.removeAttr('aria-selected');
            welOption.eq(nCurrent).attr('aria-selected','true');
            welCombobox.text( welOption.eq(nCurrent).text() );
          }
        });
      welOption
        .on('click', function () {
          welOption.removeAttr('aria-selected');
          $(this).attr('aria-selected','true');
          welCombobox.text( $(this).text() ).attr({ 'aria-expanded':'false','aria-live':'assertive'} );
          welCombobox.trigger('focus');
          setTimeout(function (){ welPanel.hide(); }, 100);
        })
        .on('keydown', function (e){
          var nCurrent = welOption.index( welListbox.find('[role=option][aria-selected=true]') );
          welCombobox.attr('aria-live','off');
          if ( e.keyCode === 9 || e.keyCode === 27 || e.keyCode === 32 || e.keyCode === 38 || e.keyCode === 40 ) {
            // 탭, ESC, 스페이스, 방향키 위, 방향키 아래 무시
            e.preventDefault();
            // 방향키 위 && 옵션 첫번째가 아닐 때
            if ( e.keyCode === 38 && nCurrent > 0 ) { nCurrent--; }
            // 방향키 아래 && 옵션 마지막이 아닐 때
            if ( e.keyCode === 40 && nCurrent < welOption.length - 1 ) { nCurrent++; }
            welOption.removeAttr('aria-selected').eq(nCurrent).attr('aria-selected','true').trigger('focus');
            welCombobox.text( welOption.eq(nCurrent).text() );
            // 탭, ESC 초점 돌려주기
            if ( e.keyCode === 9 || e.keyCode === 27 ) { $(this).trigger('click'); }
          }
        });
    });
  }

  // 카테고리
  if ( $('._a11y_menu').length >= 1 ) {
    $('._a11y_menu').each(function () {
      var welMenu = $(this);
      var welMenuBtn = welMenu.find('._a11y_menu_btn');
      var welMenuPanel = welMenu.find('._a11y_menu_panel');
      // 조건 1. 1뎁스 하위메뉴는 하나만 열릴 수 있다. 하나가 열리면 다른 것은 닫힘.
      // 키보드 동작
        // button
          // enter키
            // 하위메뉴 닫혔을 때
              // button에 aria-expanded="true"
              // 하위메뉴 열기
            // 하위메뉴 열렸을 때
              // button에 aria-expanded="false"
              // 하위메뉴 닫기
        // 하위메뉴
          // esc 키 실행
            // 열었던 버튼으로 초점 이동
            // 하위메뉴 닫기
      // 마우스 동작
        // 하위메뉴 영역에서 마우스 빠지면 하위메뉴 닫기
        // a
          // 마우스 올림
            // 하위메뉴 열기
          // 마우스 내림
            // 하위메뉴 닫기
      welMenuBtn
        .on('click',function(){
          if ( $(this).is('[aria-expanded=false]') ) {
            $(this).attr('aria-expanded','true');
          } else {
            $(this).attr('aria-expanded','false');
          }
        })
        .on('mouseenter',function(){
          $(this).attr('aria-expanded','true');
        })
        .on('mouseleave',function(){
          $(this).attr('aria-expanded','false');
        });
      welMenuPanel
        .on('mouseenter',function(){
          welMenuBtn.trigger('mouseenter');
        })
        .on('mouseleave',function(){
          $(this).find('button[aria-expanded]').attr('aria-expanded','false');
          welMenuBtn.trigger('mouseleave');
        });
      welMenuPanel.find('button[aria-expanded]')
        .on('click',function(){
          var welBtn = $(this);
          welBtn.parent().siblings().find('button[aria-expanded]').attr('aria-expanded','false');
          if ( welBtn.is('[aria-expanded=false]') ) {
            welBtn.attr('aria-expanded','true');
          } else {
            welBtn.attr('aria-expanded','false');
          }
        })
        .on('mouseenter',function(){
          var welBtn = $(this);
          welBtn.parent().siblings().find('button[aria-expanded]').attr('aria-expanded','false');
          welBtn.attr('aria-expanded','true');
        });
      welMenuPanel.find('a, button')
        .on('keydown',function(e){
          var welTarget = $(this);
          if (e.keyCode === 27) {
            welTarget.closest('div').prev('button[aria-expanded]').trigger('focus').attr('aria-expanded','false');
          }
        });
    });
  }

});
