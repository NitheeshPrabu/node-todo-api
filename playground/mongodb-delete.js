const MongoClient = require('mongodb').MongoClient;

// AWS or Heroku URL in production
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to mongodb server');
	}

	console.log('Connected to mongodb server');

	var db = client.db('TodoApp');

	// deleteMany
	// db.collection('Todos').deleteMany({test: 'Something to do'}).then((result) => {
	// 	console.log(result);
	// });

	// deleteOne
	// db.collection('Todos').deleteOne({test: 'Something to not do'}).then((result) => {
	// 	console.log(result);
	// })

	// findOneAndDelete
	// gets document back and then deletes
	db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
		console.log(result);
	})

	client.close();
});
