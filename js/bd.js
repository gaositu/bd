;( function ( window, $, zside ) {
	var myScroll, listScroll, historyScroll,
		searchScroll, favScroll,
		appName = '面试宝典',
		// baseUrl = 'http://zzhdf.cn/data/',
		// baseUrl = 'http://192.168.0.245/bd/data/',
		// baseUrl = 'http://192.168.1.102/m/bd6/data/',
		baseUrl = 'http://0.baodian.duapp.com/',
		ls = window.localStorage,
		DATA_MAPPING = [ 'v', 'css', 'css3', 'js', 'jquery', 'html5', 'php', 'sql', 'srsy', 'about' ];
		
	$.extend( zside, {
		init: function () {
			this.initScroll();
			this.initData();
			this.initSearch();
		},
		
		initScroll: function () {
			myScroll = new iScroll( 'wrapper', { checkDOMChanges: true } );
			listScroll = new iScroll( 'list', { checkDOMChanges: true } );
			historyScroll = new iScroll( 'history', { checkDOMChanges: true } );
			searchScroll = new iScroll( 'search', { checkDOMChanges: true } );
			favScroll = new iScroll( 'favorite', { checkDOMChanges: true } );
		},
		
		onHomeIconTap: function ( title, from, id, tmpHref, target ) {
			var $masker = $( '#footer .masker'),
				index, $header = $('#header');
			$('#header label').text( title || appName );
			if ( 'tabbar' != from ) {
				$('#header #leftBtn').attr( 'href', '#home' ).attr( 'title', title ).show();
				this.renderULById( id );
			} else {
				index = $(target).index() * 100;
				$masker.css({
					'-webkit-transition': '-webkit-transform 200ms',
					'-webkit-transform-origin': '0% 0%', 
					'-webkit-transform': 'translate('+index+'%, 0%) scale(1) translateZ(0px)'
				});
				if ( '#history' == tmpHref ) {
					this.showHistory();
				} else if ( '#favorite' == tmpHref ) {
					this.showFav();
				}
				$('#header #leftBtn').hide();
			}
			
			$header.find('#rightBtn').show();
			$header.find('#favBtn').hide();
			$header.show();
			listScroll.scrollTo( 0, 0, 100 );
		},
		
		onLeftBtnTap: function ( title, from, id, tmpHref, target ) {
			var $header = $('#header')
			if ( '#list' == tmpHref ) {
				$('#header #leftBtn').attr( 'href', '#home' ).attr( 'title', '' );
			} else {
				$('#header #leftBtn').hide();
			}
			$('#header label').text( title || appName );
			
			$header.find('#rightBtn').show();
			$header.find('#favBtn').hide();
			$('#header').show();
		},
		
		onRightBtnTap: function () {
			$('#header').hide();
		},
		
		initData: function () {
			var val;
			if ( ls ) {
				val = ls.getItem( 'v' );
			}
			
			$.getJSON( baseUrl + 'version.json?callback=?&t='+new Date().getTime(), function ( data ) {
				if ( !val || data > val ) {
					alert('系统发现新的知识库，请到设置模块更新！');
				}
			});
			
			// $.ajax({
				// url: baseUrl + 'version.json?jsonp=?&t='+new Date().getTime(),
				// dataType: 'jsonp',
    			// jsonp: 'jsonp',
				// success: function ( data, status, xhr ) {
					// alert(99)
					// data = JSON.parse( data );
					// if ( !val || data.v > val ) {
						// console.log( 'init data...' );
						// $.ajax({
							// url: baseUrl + 'data.js?t='+new Date().getTime(),
							// dataType: 'jsonp'
						// });
						// console.log( 'init data finish...' );
					// }
				// },
				// error: function (xhr, errorType, error) {
					// alert(88)
				// }
			// });
		},
		
		onUpdateBtnTap: function () {
			console.log( 'update data...' );
			$.getJSON( baseUrl + 'data.json?callback=?&t='+new Date().getTime(), function () {
				console.log( 'update data finish...' );
			});
			// $.ajax({
				// url: baseUrl + 'data.js?t='+new Date().getTime(),
				// dataType: 'jsonp'
			// });
		},
		
		renderULById: function ( id ) {
			var tmpArr,
				index = $.inArray( id, DATA_MAPPING ),
				str = '', i, length;
		
			if ( index > -1 ) {
				tmpArr = this.loadArrayByIndex( index );
				if ( tmpArr ) {
					length = tmpArr.length;
					for ( i=0; i<length; i++ ) {
						str += '<li><a href="#detail" title="'+index+'_'+tmpArr[i]+'" callback="onListItemTap">' + tmpArr[i] + '</a></li>';
					}
				}
				$('#list ul').html( str );
			}
		},
		
		loadArrayByIndex: function ( index ) {
			var length = ls.length, 
				i,
				tmpKey,
				tmpArr = [];
		
			for ( i=0; i<length; i++ ) {
				tmpKey = ls.key(i);
				if ( tmpKey.indexOf( index ) == 0 ) {
					tmpArr.push( this.reviseKey( tmpKey ) );				
				}
			}
			return tmpArr;
		},
		
		reviseKey: function ( key ) {
			return key.substring( key.indexOf('_') + 1 );
		},
		
		onListItemTap: function ( title, from, id, tmpHref, target ) {
			var val = this.getValueByKey( title ),
				$header = $('#header');
			$('#header #leftBtn').attr( 'href', '#list' );
			$header.find('#rightBtn').hide();
			$header.find('#favBtn').attr( 'title', title ).show();
			$('#header label').text( this.reviseKey( title ) || appName );
			$('#detail').html( '<p>' + val + '</p>' );
			this.addToHistory( title );
		},
		
		onFavTap: function ( title, from, id, tmpHref, target ) {
			var f = this.getValueByKey( 'f' ), fObj = JSON.parse( f ),
				key = $( target ).attr( 'title' ),
				tmpIndex = $.inArray( key, fObj );
			if ( tmpIndex > -1 ) {
				fObj.splice( tmpIndex, 1 );
			}
			fObj.unshift( key );
			this.setValueByKey( 'f', JSON.stringify( fObj ) );
		},
		
		showFav: function () {
			var arr = this.getValueArrayByKey( 'f' ), 
				i, len = arr.length, str = '';
			for ( i=0; i<len; i++ ) {
				str += '<li><a href="#detail" title="'+arr[i]+'">' + this.reviseKey( arr[i] ) + '</a></li>';
			}
			$('#favorite ul').html( str );
		},
		
		getValueByKey: function ( key ) {
			var val;
			if ( key ) {
				val = ls.getItem( key );
				return val;
			}
		},
		
		setValueByKey: function ( key, val ) {
			var ls = window.localStorage;
			ls.setItem( key, val );
		},
		
		addToHistory: function ( key ) {
			var h = this.getValueByKey( 'h' ), hObj = JSON.parse( h ),
				tmpIndex = $.inArray( key, hObj );
			if ( tmpIndex > -1 ) {
				hObj.splice( tmpIndex, 1 );
			}
			hObj.unshift( key );
			this.setValueByKey( 'h', JSON.stringify( hObj ) );
		},
		
		showHistory: function () {
			var arr = this.getValueArrayByKey( 'h' ), 
				i, len = arr.length, str = '';
			for ( i=0; i<len; i++ ) {
				str += '<li><a href="#detail" title="'+arr[i]+'">' + this.reviseKey( arr[i] ) + '</a></li>';
			}
			$('#history ul').html( str );
		},
		
		getValueArrayByKey: function ( key ) {
			var arr;
			arr = JSON.parse( ls.getItem( key ) );
			return arr;
		},
		
		initSearch: function () {
			var that = this;
			$('#searchBtn').on( 'click', function () {
				var val = $.trim( $('#searchTxt').val() ),
					arr, str = '';
				if ( val.length > 0 ) {
					arr = that.getSearchResults( val );
					if ( arr ) {
						length = arr.length;
						for ( i=0; i<length; i++ ) {
							str += '<li><a href="#detail" title="'+arr[i]+'" callback="onListItemTap">' + that.reviseKey( arr[i] ) + '</a></li>';
						}
					
					}
					$('#search ul').html( str );
				}
			});
		},
		
		getSearchResults: function ( txt ) {
			var length = ls.length, 
				i,
				tmpKey,
				tmpArr = [];
				
			for ( i=0; i<length; i++ ) {
				tmpKey = ls.key(i);
				if ( tmpKey.toLowerCase().indexOf( txt.toLowerCase() ) > -1 ) {
					tmpArr.push( tmpKey );				
				}
			}
			return tmpArr;
		}
	});
	
	$( document ).ready( function () {
		zside.init();
	});
})( window, Zepto, zside );