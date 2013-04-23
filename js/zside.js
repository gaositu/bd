 /**
 *	DESC:	A Simple Library Based On Zepto, For Mobile Device
 *	AUTHOR:	1203A
 *	SINCE:	2013-04-06
 *	EMAIL:	gao_st@126.com
 */
;( function ( window, $ ) {
	var NO_NEED_LOAD_DATA = [ '#main' ],
		DATA_MAPPING = [ 'v', 'css', 'css3', 'js', 'jquery', 'html5', 'php', 'sql', 'srsy', 'about' ];
		
	var listScroll;
	
	$( document ).ready( function () {
		bindAnchorEvt();
		listScroll = new iScroll('list', { checkDOMChanges: true, fadeScrollbar: true });
	});
	
	function bindAnchorEvt () {
		$('#wrapper, #footer').on( 'click', 'a[href]', function ( e ) {
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
			
			if ( tmpId == '#list' ) {
				tmpId = $(this).attr('id');
			} 
			loadDataById( tmpId );
		});
	}
	
	function loadDataById ( id ) {
		var index;
		if ( $.inArray( id, NO_NEED_LOAD_DATA ) > -1 ) {
			return;
		}
		
		index = $.inArray( id, DATA_MAPPING );
		if ( index > 0 ) {
			getData( index, id );
		}
		
	}
	
	function getData( index, id ) {
		var ls = window.localStorage,
			length = ls.length, 
			i,
			tmpKey,
			tmpArr = [];
		for ( i=0; i<length; i++ ) {
			tmpKey = ls.key(i);
			if ( tmpKey.indexOf( index ) == 0 ) {
				tmpArr.push( tmpKey.substring( tmpKey.indexOf( '_' ) + 1 ) );
			}
		}
		
		renderUL( tmpArr, id );
		
	}
	
	function renderUL ( arr, id ) {
		var str;
		if ( arr ) {
			str = '<li><a href="#detail">' + arr.join('</a></li><li><a href="#detail">') + '</a></li>';
		}
		
		$( '#list' ).find( 'ul' ).html( str );
		
		listScroll.scrollTo( 0, 0, 100 );
	}	
})( window, Zepto );