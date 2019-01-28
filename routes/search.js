var express = require('express');
var router = express.Router();

var search_controller = require('../controllers/searchController');

router.get('/', search_controller.index);

router.post('/', search_controller.post_index);

router.get('/results', search_controller.results);

module.exports = router;