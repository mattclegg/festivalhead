require([
	'$api/models',
	'$api/location#Location',
	'$api/search#Search',
	'$api/toplists#Toplist',
	'$views/buttons',
	'$views/list#List',
	'$views/image#Image'
], function(models, Location, Search, Toplist, buttons, List, Image) {
    'use strict';


	/* Returns proper interface to XMLHttpRequest for AJAX calls */
	function init_ajax() {
		var xmlhttp = false;

		//Test for IE
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (x) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (y) {
				xmlhttp = false;
			}
		}

		//Chrome/WebKit
		if (xmlhttp === false && typeof XMLHttpRequest !== 'undefined') {
			try {
				xmlhttp = new XMLHttpRequest();
			} catch (z) {
				xmlhttp = false;
			}
		}

		return xmlhttp;
	}
	
	function doFestvialCheck(curr,festivals){
		
		var toplist = Toplist.forCurrentUser();
		
		
		var xmlhttp = init_ajax();
		xmlhttp.open("GET", "json/"+festivals[curr]+".json", true);
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4) {	// request finished and response is ready
				if (xmlhttp.status === 200) {
					
					var jsonData = JSON.parse(xmlhttp.responseText);
					
					
					var festivallist_HTML = document.getElementById('festivallist');
					
					var atThisFestival = 0;
				
					
					var festivallist_HTML_inner = document.createElement('div');
					festivallist_HTML_inner.className = "sp-list sp-light";
					
					toplist.artists.snapshot().done(function(artists) {
						for (var i = 0; i < artists.length; i++) {
							var t = artists.get(i);
							var link = document.createElement('div');
							
							var a = document.createElement('a');
							a.href = t.uri;
							a.className = "sp-item";
							
							//a.innerHTML = t.name;
							
							var atFestivalCount = 0;
							for (var location in jsonData.locations) {
								
								//a.innerHTML += jsonData.locations[location].name;
								
								for (var event in jsonData.locations[location].events) {
									//a.innerHTML += jsonData.locations[location].events[event].name;
									if(jsonData.locations[location].events[event].name == t.name){
										
										//var list = List.forCollection(getTopTracks(t,1));
										
										a.innerHTML =
											'<span class="sp-track-field-artist"><a href="spotify:artist:2ye2Wgw4gimLv2eAKyk1NB">'+t.name+'</a></span>'+
											'<span class="sp-artist-stage">'+jsonData.locations[location].name+'</span>'+
											'<span class="sp-artist-time">'+jsonData.locations[location].events[event].start+'</span>';
										atFestivalCount ++;
										atThisFestival++;
									}
								}
							}
							
							if(atFestivalCount>0){
								
								festivallist_HTML_inner.appendChild(a);
								//list.init();
							}
						}
					});
					
					if(atThisFestival>0){
						var title = document.createElement('h3');
						title.innerHTML = jsonData.name;
						festivallist_HTML.appendChild(title);
						festivallist_HTML.appendChild(festivallist_HTML_inner);
					}
					
					if(curr < (festivals.length - 1)){
						curr++;
						doFestvialCheck(curr,festivals);
					}
					
				}
			}
		}
		xmlhttp.send(null);
	}
	

	function getTopTracks(artist,maxItems){
		console.log(artist.uri);
		var list = Toplist.forArtist(artist,"GB");
		console.log(list);
		list.tracks.snapshot().done(function(tracks) {
			console.log(tracks.length);
			for (var i = 0; i < tracks.length; i++) {
				console.log(tracks.get(i));
			}
		});
		return false;
		
		//return list.tracks.snapshot(0,maxItems);

	}
	
	
	
	var festivals = [
		"v2013",
		"biggreenweek2013",
		"g2013",
		"reading2013"
	];

	doFestvialCheck(0,festivals);

});
