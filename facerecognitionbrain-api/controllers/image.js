const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '939526fe79d54ecdbdb57da4574c4d2b'
});

const handleApiCall = (req, res) => {
	app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
    	res.json(data);
    })
    .catch(err => res.status(400).json('unable to connect to API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where({id: id})
	  .increment('entries', 1)
	  .returning('entries')
	  .then(entries => {
	  	res.json(entries[0]);
	  })
	  .catch(err => res.status(400).json('error entries not found'));
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}