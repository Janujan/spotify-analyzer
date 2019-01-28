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
    var ids = [];
    var danceability = [];
    var playListStats = {};
    var playlist_name = '';
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
            limit: 100,
            fields: 'items'
        });
    })
    .then(function(data) {
        console.log(data.body);
        //console.log(data.body.items)        
        data.body.items.forEach(function(track, index) {
            results.push(track.track);
            ids.push(track.track.id);
        });

        spotifyApi.getAudioFeaturesForTracks(ids)
        .then(function(data) {
            return data
        }, function(err) {
            done(err);
        })
        .then(function(data){
            audio_features= data.body.audio_features
            sum_dance = 0;
            sum_energy = 0;
            sum_loudness = 0;
            sum_speechiness=0;
            sum_acousticness=0;
            sum_instrumental=0;
            sum_liveness=0;
            sum_valence=0;
            sum_tempo=0;

            for(i = 0; i < audio_features.length; i++){
                sum_dance += audio_features[i].danceability;
                sum_energy += audio_features[i].energy;
                sum_loudness += audio_features[i].loudness;
                sum_speechiness += audio_features[i].speechiness;
                sum_acousticness += audio_features[i].acousticness;
                sum_liveness += audio_features[i].liveness;
                sum_instrumental += audio_features[i].instrumentalness;
                sum_valence += audio_features[i].valence;
                sum_tempo += audio_features[i].tempo;
            }
            playListStats['average_dance'] = (sum_dance/audio_features.length).toPrecision(3);
            playListStats['average_energy'] = (sum_energy/audio_features.length).toPrecision(3);
            playListStats['average_loudness'] = (sum_loudness/audio_features.length).toPrecision(3);
            playListStats['average_speechiness'] = (sum_speechiness/audio_features.length).toPrecision(3);
            playListStats['average_acousticness'] = (sum_acousticness/audio_features.length).toPrecision(3);
            playListStats['average_instrumental'] = (sum_instrumental/audio_features.length).toPrecision(3);
            playListStats['average_liveness'] = (sum_liveness/audio_features.length).toPrecision(3);
            playListStats['average_valence'] = (sum_valence/audio_features.length).toPrecision(3);
            playListStats['average_tempo'] = (sum_tempo/audio_features.length).toPrecision(3);
            console.log(playListStats);
            console.log(sum_acousticness);
            res.render('results', {title: 'Results', data: results, analyze: danceability, stats: playListStats});
        })
    })
    .catch(function(err) {
        console.log('Unfortunately, something has gone wrong.', err.message);
    });
};
