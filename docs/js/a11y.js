'use strict';

$(function(){

  // 탭
  if ( $('._a11y_tab').length >= 1 ) {
    $('._a11y_tab').each(function () {
      var welWrap = $(this);
      var welTabList = welWrap.find('[role=tablist]');
      var welTabBtn = welWrap.find('[role=tab]');
      var welTabPanel = welWrap.find('[role=tabpanel]');
      var nTabActive = 0;
      var nTabFocus = nTabActive;
      welTabList
        .on('click', '[role=tab]', function () {
          nTabFocus = welTabBtn.index( $(this) ) ;
          nTabActive = nTabFocus;
          welTabBtn.attr({'aria-selected':'false','tabindex':'-1'});
          $(this).attr({'aria-selected':'true','tabindex':'0'});
          welTabPanel.hide().removeAttr('tabindex');
          welTabPanel.eq(nTabFocus).show().attr('tabindex','0');
        })
        .on('keydown', '[role=tab]', function (e) {
          if ( e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 39 ) {
            e.preventDefault();
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
            if ( e.keyCode === 9 ) { nTabFocus = nTabActive; }
            $(welTabBtn[nTabFocus]).attr('tabindex','0');
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

});
