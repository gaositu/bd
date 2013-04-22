 /**
 *	DESC:	A Simple Library Based On Zepto, For Mobile Device
 *	AUTHOR:	1203A
 *	SINCE:	2013-04-06
 *	EMAIL:	gao_st@126.com
 */
;( function ( window, $ ) {
	$( document ).ready( function () {
		bindAnchorEvt();
	});
	
	function bindAnchorEvt () {
		$('a[href]').on( 'click', function ( e ) {
			var tmpId = $(this).attr('href');
			$( tmpId ).css({
				'-webkit-transition': '-webkit-transform 200ms',
				'-webkit-transform-origin': '0% 0%', 
				'-webkit-transform': 'translate(0%, 0%) scale(1) translateZ(0px)',
				'opacity': 1
			}).siblings().css({
				'-webkit-transition': '-webkit-transform 200ms',
				'-webkit-transform-origin': '0% 0%', 
				'-webkit-transform': 'translate(100%, 0%) scale(1) translateZ(0px)',
				'opacity': 0
			});
			
			e.preventDefault();
		});
	}
})( window, Zepto );