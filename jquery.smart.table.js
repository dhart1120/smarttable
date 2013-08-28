/* 
SmartTable Copyright (c) 2013 Dustin Hart
This code is released under the The MIT License
https://github.com/dhart1120/smarttable
*/

(function($) {

	$.fn.extend({
		smartTable: function(options) {
			options = $.extend( {}, $.SmartTable.defaults, options );

			this.each(function() {
				new $.SmartTable($(this),options);
			});

			return this;
		}
	});

    $.SmartTable = function(ele, options ) {
    	var table = ele;
    	var headers = options.headers;
    	var data = options.data;
    	var current_search = "";
    	var current_data = data;
    	var index = 0;
    	var rows = options.rows
    	var page_num = $("#" + options.page_num);
    	var next_btn = $("#" + options.next);
    	var prev_btn = $("#" + options.prev);
    	var search_field = $("#" + options.search);
    	
    	if(search_field.length > 0)
    		setupSearch();
    	if(prev_btn.length > 0)
    		setupPrevBtn();
    	if(next_btn.length > 0)
    		setupNextBtn();
    	if(page_num.length > 0)
    		updatePageNumber();

    	refreshTable();

    	function setupSearch() {
    		var action = function(){
    			var search = search_field.val();
    			if(search !== current_search){
    				current_search = search.toLowerCase();
    				onSearch();
    			}
    		}

    		search_field.bind('keyup', action);
    		search_field.bind("paste", action);
    	}

    	function setupPrevBtn(){
    		prev_btn.bind('click', onPrev);
    	}

    	function setupNextBtn(){
    		next_btn.bind('click', onNext);
    	}

    	function updatePageNumber() {
    		if(current_data.length == 0) {
    			page_num.html("");
    		} else {
    			var max_pages = Math.ceil(current_data.length / rows);
	    		var current_page = Math.floor(index / rows) + 1;
	    		page_num.html(current_page + " of " + max_pages);
    		}
    	}

    	function updateBtns() {
    		//show the prev button if needed
    		if(prev_btn.length > 0){
    			if(current_data.length > 0 && index > 0){
    				prev_btn.css({ 'visibility': 'visible'}); 
    			}else{
					prev_btn.css({ 'visibility': 'hidden'}); ;
    			}
    		}

    		//show the next button if needed
			if(next_btn.length > 0){
				if(index+rows < current_data.length){
    				next_btn.css({ 'visibility': 'visible'}); 
    			}else{
					next_btn.css({ 'visibility': 'hidden'}); ;
    			}
    		}
    	}	

    	function refreshTable() {
    		table.empty();

    		if(current_data.length > 0) {
	    		var header_row = getRow(headers, true);
	    		if(header_row)
	    			table.append(header_row);

	    		//show up to {rows} tr starting with the 
	    		for(var i=index; (i < current_data.length) && (i < (index + rows)); i++) {
	    			var row = getRow(current_data[i], false);
	    			if(row)
	    				table.append(row);
	    		}
	    	} else {
	    		table.append(getRow([{"text":"No Results Found", "class_name":"no_results"}], false))
	    	}

	    		updatePageNumber();
	    		updateBtns();
    	}

    	function getRow(data, is_header) {
    		if( ! data || data.length == 0)
    			return null;

	    	//make a single row
	    	var row = $("<tr></tr>")

			//add cells for each element in the data array
			for(var i=0; i<data.length; i++) {
				row.append(getCell(data[i], is_header));
			}
			return row;
		}

		function getCell(data, is_header) {
			var cell = null;
			if(is_header)
				cell = $("<th></th>");
			else
				cell = $("<td></td>");

			if(typeof data === 'string'){
				cell.html(data);
			}else{
				var text = data.text;
				var class_name = data.class_name;
				var options = data.options;
				var element = data.element;
				if( ! element )
					element = 'span';

				var inner = $("<" + element + "></" + element + ">");
				inner.html(text);
				if(class_name)
					inner.prop("class", class_name);
				
				if(options){
					for(var attr in options){
						inner.attr(attr, options[attr]);
					}
				}

				cell.append(inner);
			}
			return cell;
		}

		function onNext() {
			index += rows;

			if(index >= current_data.length)
				index = current_data.length - rows;
			
			refreshTable();
		}

		function onPrev() {
			index -= rows;
			if(index < 0)
				index = 0;
			refreshTable();
		}

		function onSearch() {
			current_data = [];

			for(var i=0; i<data.length; i++){
				var row = data[i];
				
				var text_string = "";
				for(var j=0; j<row.length; j++){

					var obj = row[j];
					if(typeof obj === 'string'){
						text_string += obj;
					}else{
						var text = obj.search_text;
						if( ! text )
							text = obj.text;
						if( ! text )
							text = obj.toString();
						text_string += text;
					}

				}

				text_string = text_string.toLowerCase();
				if(text_string.indexOf(current_search) > -1)
					current_data.push(row);
			}

			index = 0;
			refreshTable();
		}



	};

    // option defaults
    $.SmartTable.defaults = {
    	"headers" : [],
    	"data" : [],
    	"rows" : 10
    };

})(jQuery);