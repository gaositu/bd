;( function ( window, $, zside ) {
	var myScroll, listScroll, historyScroll,
		searchScroll, favScroll, detailScroll,
		appName = '面试宝典',
		baseUrl = 'http://baodian.duapp.com/data/',
		ls = window.localStorage,
		DATA_MAPPING = [ 'v', 'css', 'css3', 'js', 'jquery', 'html5', 'php', 'sql', 'new', 'about' ];
		
	$.extend( zside, {
		init: function () {
			this.initScroll();
			// this.initData();
			this.initSearch();
		},
		
		initScroll: function () {
			myScroll = new iScroll( 'home', { checkDOMChanges: true } );
			listScroll = new iScroll( 'list', { checkDOMChanges: true } );
			historyScroll = new iScroll( 'history', { checkDOMChanges: true } );
			searchScroll = new iScroll( 'search', { checkDOMChanges: true } );
			favScroll = new iScroll( 'favorite', { checkDOMChanges: true } );
			detailScroll = new iScroll( 'detail', { checkDOMChanges: true } );
		},
		
		onHomeIconTap: function ( title, from, id, tmpHref, target ) {
			var index, $header = $('#header'),
				$activeTab = $('#footer a');
				/*$masker = $( '#footer .masker');*/
			$('#header label').text( title || appName );
			if ( 'tabbar' != from ) {
				$('#header #leftBtn').attr( 'href', '#home' ).attr( 'title', title ).show();
				this.renderULById( id );
			} else {
				index = $(target).index();
				$activeTab.eq( index ).addClass( 'on' ).siblings().removeClass( 'on' );
				/*index = $(target).index() * 100;
				$masker.css({
					'-webkit-transition': '-webkit-transform 200ms',
					'-webkit-transform-origin': '0% 0%', 
					'-webkit-transform': 'translate('+index+'%, 0%) scale(1) translateZ(0px)'
				});*/
				if ( '#history' == tmpHref ) {
					this.showHistory();
				} else if ( '#favorite' == tmpHref ) {
					this.showFav();
				} else if ( '#config' == tmpHref ) {
					this.showVersion();
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
			
			if ( '#home' == tmpHref ) {
				$('#header label').text( appName );
			} 
			
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
		},
		
		loadNewVersion: function () {
			var $updateBtn = $('#updateBtn');
			$updateBtn.text( '知识库更新中...' );
			try {
				$.getJSON( baseUrl + 'data.json?callback=?&t='+new Date().getTime(), function () {
					$updateBtn.removeAttr( 'href' ).text( '已更新,最新版本[v' + ls.getItem('v') + ']' );
				});
			} catch(e) {};
		},
		
		onUpdateBtnTap: function () {
			var val, $updateBtn = $('#updateBtn'), 
				$clearHistoryBtn = $('#clearHistoryBtn'),
				$clearFavBtn = $('#clearFavBtn');
			if ( ls ) {
				val = ls.getItem( 'v' );
			}
			$.getJSON( baseUrl + 'version.json?callback=?&t='+new Date().getTime(), function ( data ) {
				if ( !val || data > val ) {
					$updateBtn.attr( 'callback', 'loadNewVersion' ).text( '发现新知识库,请点击更新' );
				} else {
					$updateBtn.removeAttr( 'href' ).text( '已经是最新知识库' );
				}
			});
		},
		
		clearHistoryBtnTap: function ( title, from, id, tmpHref, target ) {
			var $target = $( target ),
				hasTitle = $target.attr( 'title' );
			if ( hasTitle ) {
				ls.setItem( 'h', '[]');
				$( target ).removeAttr( 'href' ).css( 'background', '' ).text( '成功清空历史记录' );
			} else {
				$target.css( 'background', 'red' ).text( '数据删除确认，再次点击清空历史记录' ).attr( 'title', 'confirm' );
			}
		},
		
		clearFavBtnTap: function ( title, from, id, tmpHref, target ) {
			var $target = $( target ),
				hasTitle = $target.attr( 'title' );
			if ( hasTitle ) {
				ls.setItem( 'f', '[]');
				$( target ).removeAttr( 'href' ).css( 'background', '' ).text( '成功清空我的收藏' );
			} else {
				$target.css( 'background', 'red' ).text( '数据删除确认，再次点击清空我的收藏' ).attr( 'title', 'confirm' );
			}
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
			$('#detail .area').html( '<p>' + val + '</p>' );
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
				i, len, str = '';
			if ( arr ) {
				len = arr.length;
				for ( i=0; i<len; i++ ) {
					str += '<li><a href="#detail" title="'+arr[i]+'">' + this.reviseKey( arr[i] ) + '</a></li>';
				}
				$('#favorite ul').html( str );
			}
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
				i, len, str = '';
			if ( arr ) {
				len = arr.length
				for ( i=0; i<len; i++ ) {
					str += '<li><a href="#detail" title="'+arr[i]+'" callback="onListItemTap">' + this.reviseKey( arr[i] ) + '</a></li>';
				}
				$('#history ul').html( str );
			}
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
		},
		
		showVersion: function () {
			$('#config label').text( ls.getItem( 'v' ) || '0' );
		}
	});
	
	$( document ).ready( function () {
		zside.init();
	});
})( window, Zepto, zside );