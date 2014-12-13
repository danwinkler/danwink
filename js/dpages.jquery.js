(function( $ ) {
	$.fn.firstAdded = false;
	
	$.fn.dpage = function( button, condition ) {
		if( button )
		{
			button.dpageButton( this );
		}
		if( !condition )
		{
			condition = function() { return true; };
		}
		if( !$.fn.firstAdded )
		{
			this.addClass( "dpagevis" );
			$.fn.firstAdded = true;
		}
		else
		{
			this.hide();
		}
		this.addClass( "dpage" );
		this.data( "dpagecond", condition );
		return this;
	};
	
	$.fn.dpageButton = function( page ) {
		this.click( function() { page.dpagetrigger(); } );
	};
	
	$.fn.dpageCondition = function( page ) {
		this.data( "dpagecond", condition );
	};
	
	$.fn.dpagetrigger = function() {
		if( this.data( "dpagecond" )() )
		{
			var current = this;
			if( this.hasClass( "dpagevis" ) )
			{
				return this;
			}
			$( ".dpage" ).each( function(i) {
				if( $(this).hasClass( "dpagevis" ) )
				{
					$(this).removeClass( "dpagevis" );
					$(this).fadeOut( 400, function() {
						current.addClass( "dpagevis" );
						current.fadeIn( 400 );
					});
				}
			});
			
		}
		return this;
	};
})( jQuery );