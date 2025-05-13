const LASTFM_API_KEY = "d74f9fdb9c79a50ffac2ca0700892ca1"
const username = "yumenism"
const url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&extended=true&api_key=" + LASTFM_API_KEY + "&limit=1&user=" + username

// make API call
function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

var json = JSON.parse(httpGet(url));
var last_track = json.recenttracks.track[0]
var track = last_track.name
var trackLink = last_track.url
var artistLink = last_track.artist.url
var artist = last_track.artist.name




trackElem = document.getElementById('track')
artistElem = document.getElementById('artist')


trackLinkElem = document.createElement('a')
trackLinkElem.id = "track"
trackLinkElem.href = trackLink
trackLinkElem.target = "_blank"
trackLinkElem.textContent = track

artistLinkElem = document.createElement('a')
artistLinkElem.id = 'artist'
artistLinkElem.href = artistLink
artistLinkElem.target = "_blank"
artistLinkElem.textContent = artist

trackElem.appendChild(trackLinkElem)
artistElem.appendChild(artistLinkElem)


console.log(
    "Artist: " + artist + "\n" +
    "Track: " + track + "\n" +
    "Date: " + relative_time + "\n" +
    "Now playing: " + now_playing)
