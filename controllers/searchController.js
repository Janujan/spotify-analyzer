var url = require('url');

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
    console.log('recieved data ' + passedVariable);
    res.render('results', {title: 'Results'});
};
