var url = require('url');
var SpotifyWebApi = require('spotify-web-api-node');

exports.index = function(req,res){
    res.render('index', {title: 'Spotify Playlist Analyzer'})
};

//TO DO: validate data passed then redirect to results page
exports.post_index = function(req, res){
    console.log('playlist_id ' + req.body.playlist_id );
    res.redirect(url.format({
        pathname:"/search/results/",
        query: {
           "playlist":req.body.playlist_id,
         }
      }));
};
exports.results = function(req, res) {
    var passedVariable = req.query.playlist;
    var results = [];
    var spotifyApi = new SpotifyWebApi({
        clientId: 'a1d89dc9d68c43d095e3a6d44fbfc76a',
        clientSecret: 'bd17f8a23a3c45a18bfa1b593cd0977e',
        redirectUri: 'http://www.example.com/callback',
      });
    // Retrieve an access token
    spotifyApi
    .clientCredentialsGrant()
    .then(function(data) {
        // Set the access token on the API object so that it's used in all future requests
        spotifyApi.setAccessToken(data.body['access_token']);
        // Get the most popular tracks by David Bowie in Great Britain
        return spotifyApi.getPlaylistTracks(passedVariable, {
            offset: 0,
            limit: 20,
            fields: 'items'
        });
        //return spotifyApi.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB');

    })
    .then(function(data) {
        console.log(data.body.items)        
        data.body.items.forEach(function(track, index) {
            results.push(track.track);
            console.log(
              index +
                1 +
                '. ' +
                track.track.name +
                ' (id: ' +
                track.track.id +
                ')'
            );
        });
        //console.log(results)

        console.log(results)
        console.log('recieved data ' + passedVariable);
        res.render('results', {title: 'Results', data: results});
    })
    .catch(function(err) {
        console.log('Unfortunately, something has gone wrong.', err.message);
    });
};
