 /**
 *	DESC:		A Simple Library Based On Zepto, For Mobile Device
 *	AUTHOR:		1203A
 *	SINCE:		2013-04-06
 *	EMAIL:		gao_st@126.com
 * 	VERSION:	1.2
 */

var zside = ( function ( window, $, undefined ) {
	var zside = {
		version: '1.2',
		initialize: function () {
			this.bindAnchorEvt();
		},
		bindAnchorEvt: function () {
			$('body').on( 'click', 'a[href]', function ( e ) {
				var tmpHref = $(this).attr('href'),
					title = $(this).attr('title'),
					id = $(this).attr('id'),
					$tmpMenu,
					from = $(this).attr('from'),
					callback = $(this).attr('callback');
				
				if ( tmpHref.indexOf( '@' ) == 0 ) {
					if ( tmpHref.indexOf( 'left' ) > -1 ) {
						$tmpMenu = $('#leftMenu');
						if ( $tmpMenu.css('opacity') == 0 ) {
							$tmpMenu.css( 'opacity', 1 );
							$( '#main' ).css({
								'-webkit-transition': '-webkit-transform 200ms',
								'-webkit-transform-origin': '0% 0%', 
								'-webkit-transform': 'translate(80%, 0%) scale(1) translateZ(0px)'
							});
						} else {
							$( '#main' ).css({
								'-webkit-transition': '-webkit-transform 200ms',
								'-webkit-transform-origin': '0% 0%', 
								'-webkit-transform': 'translate(0%, 0%) scale(1) translateZ(0px)'
							});
							setTimeout( function () {
								$tmpMenu.css( 'opacity', 0 );
							}, 200);
						}
						
					} else {
						$tmpMenu = $('#rightMenu');
						if ( $tmpMenu.css('opacity') == 0 ) {
							$tmpMenu.css( 'opacity', 1 );
							$( '#main' ).css({
								'-webkit-transition': '-webkit-transform 200ms',
								'-webkit-transform-origin': '0% 0%', 
								'-webkit-transform': 'translate(-80%, 0%) scale(1) translateZ(0px)'
							});
						} else {
							$( '#main' ).css({
								'-webkit-transition': '-webkit-transform 200ms',
								'-webkit-transform-origin': '0% 0%', 
								'-webkit-transform': 'translate(0%, 0%) scale(1) translateZ(0px)'
							});
							setTimeout( function () {
								$tmpMenu.css( 'opacity', 0 );
							}, 200);
						}
					}
				} else {
					$( tmpHref ).css({
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
				}
				
				if ( callback ) {
					window['zside'][ callback ]( title, from, id, tmpHref, this );					
				}
				e.preventDefault();
			});
		}
	};
	return zside;
})( window, Zepto );

$( document ).ready( function () {
	zside.initialize();
});