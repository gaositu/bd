 /**
 *	DESC:	A Simple Library Based On Zepto, For Mobile Device
 *	AUTHOR:	1203A
 *	SINCE:	2013-04-06
 *	EMAIL:	gao_st@126.com
 */
;( function ( window, $ ) {
	var NO_NEED_LOAD_DATA = [ '#main' ],
		DATA_MAPPING = [ 'v', '#css', '#css3', '#js', '#jquery', '#html5', '#php', '#sql', '#srsy', '#about' ];
	
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
				tmpArr.push( tmpKey );
			}
		}
		
		renderUL( tmpArr, id );
		
	}
	
	function renderUL ( arr, id ) {
		var str;
		if ( arr ) {
			str = '<li>' + arr.join('</li><li>') + '</li>';
		}
		
		$( id ).find( 'ul' ).html( str );
		// console.log( str );
		
		// doIScroll( id );
	}
	
	/*function doIScroll( id ) {
		document.addEventListener('DOMContentLoaded', function () { setTimeout(function () {
			new iScroll(id, { checkDOMChanges: true });
		}, 200); }, false);
	}*/
})( window, Zepto );