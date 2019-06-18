const MongoClient = require('mongodb').MongoClient;

// AWS or Heroku URL in production
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to mongodb server');
	}

	console.log('Connected to mongodb server');

	var db = client.db('TodoApp');

	// insertTodo(db);

	findTodo(db);
	client.close();
});

findTodo = (db) => {
	db.collection('Todos').find({completed: false}).toArray().then((docs) => {

		console.log('Todos');
		console.log(JSON.stringify(docs, undefined, 2));

	}, (err) => {
		if (err) {
			return console.log('Unable to fetch todos', err);
		}
	});
}


insertTodo = (db) => {
	db.collection('Todos').insertOne({
		text: 'Something to learn',
		completed: false
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert todo', err);
		}

		// id is a 12 byte unique identifier made up to a timestamp, the
		// machine identifer in which document was created, a process id,
		// and a random value
		// you can also give custom _id value
		console.log(result.ops[0]._id.getTimestamp())
		console.log(JSON.stringify(result.ops, undefined, 2));
	});
}