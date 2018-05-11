jquery.formatNumber
===================

jQuery plugin for formatting numbers, good for currencies. Option to choose the cents and thousands digit. Defaults to US' 9,999.00.

Usage: `$('.number').formatNumber();`

This will make `<span class="number">2932389423</span>` for e.g., be formatted into `<span class="number">29,323,894.23</span>`.

##Options


	//produces 29,323,894.23 (e.g. US standard)
	$('.number').formatNumber({
	  cents: '.',
	  decimal: ','
	});
	
	//produces 29.323.894,23 (e.g. Brazil standard)
	$('.number').formatNumber({
	  cents: ',',
	  decimal: '.'
	});
	
