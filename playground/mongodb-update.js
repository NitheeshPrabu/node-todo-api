const { MongoClient, ObjectID } = require('mongodb');

// AWS or Heroku URL in production
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to mongodb server');
	}

	console.log('Connected to mongodb server');

	var db = client.db('TodoApp');

	db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID('5d088c9100724b3657a32d09')
	}, {
		$set: {
			completed: false
		}
	}, {
		returnOriginal: false
	}).then(result => {
		console.log(result);
	});

	client.close();
});
