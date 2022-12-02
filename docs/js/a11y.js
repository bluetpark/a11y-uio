'use strict';

$(function(){

  // 탭
  if ( $('._a11y_tab').length >= 1 ) {
    $('._a11y_tab').each(function(){
      var welWrap = $(this);
      var welTabList = welWrap.find('[role=tablist]');
      var welTabBtn = welWrap.find('[role=tab]');
      var welTabPanel = welWrap.find('[role=tabpanel]');
      var nTabFocus = 0;
      welTabList
        .on('keydown', '[role=tab]', function(e){
          if ( e.keyCode === 37 || e.keyCode === 39 ) {
            $(welTabBtn[nTabFocus]).attr('tabindex','-1');
            // 왼쪽 방향키
            if ( e.keyCode === 37 ) {
              nTabFocus--;
              if ( nTabFocus < 0 ) { nTabFocus = welTabBtn.length - 1 }
            }
            // 오른쪽 방향키
            if ( e.keyCode === 39 ) {
              nTabFocus++;
              if ( nTabFocus >= welTabBtn.length ) { nTabFocus = 0 }
            }
            $(welTabBtn[nTabFocus]).attr('tabindex','0');
            $(welTabBtn[nTabFocus]).trigger('focus');
          }
        })
        .on('click', '[role=tab]', function(e){
          nTabFocus = welTabBtn.index($(this)) ;
          welTabBtn.attr({'aria-selected':'false','tabindex':'-1'});
          $(this).attr({'aria-selected':'true','tabindex':'0'});
          welTabPanel.hide().removeAttr('tabindex');
          welTabPanel.eq(nTabFocus).show().attr('tabindex','0');
        });
    });
  }

});
