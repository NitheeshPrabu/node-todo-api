require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;

// set up middleware to allow body-parser to send JSON to mongoose
app.use(bodyParser.json());
app.use((req, res, next) => {
	if (process.env.NODE_ENV !== "test") {
		var now = new Date().toString();
		var log = `${now}: ${req.method} ${req.url}`;
		console.log(log);
	}

	// must call this so that rest of the file is read
	next();
});

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		return res.send(doc);
	}).catch((err) => {
		if (err)
			res.status(400).send(err);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		return res.send({todos});
	}).catch((err) => {
		if (err)
			res.status(400).send(err);
	});
});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id))
		return res.status(404).send();
	
	Todo.findById(id).then((todo) => {
		if (!todo)
			return res.status(404).send();

		res.send({todo});
	}).catch((err) => {
		if (err)
			res.status(400).send(err);
	});
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id))
		return res.status(404).send();

	Todo.findByIdAndDelete(id).then((todo) => {
		if (!todo)
			return res.status(404).send();

		res.send({todo});
	}).catch((err) => {
		if (err)
			res.send(400).send(err);
	})
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);
	if (!ObjectID.isValid(id))
		return res.status(404).send();
	
	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true, useFindAndModify: false}).then((todo) => {
		if (!todo)
			return res.status(404).send();
		
			res.send({todo});
	}).catch((err) => {
		if (err)
			res.status(400).send(err);
	})
});


app.get('/users', (req, res) => {
	User.find().then((users) => {
		return res.send({users});
	}).catch((err) => {
		if (err)
			res.status(400).send(err);
	});
});

app.post('/users',(req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);
	
	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((err) => {
		res.status(400).send(err);
	})
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	User.findByCredentials(body.email, body.password).then((user) => {
		user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch ((err) => {
		res.status(400).send(err);
	});
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, (err) => {
		res.status(400).send(err);
	});
});

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

module.exports = { app };