const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

// set up middleware to allow body-parser to send JSON to mongoose
app.use(bodyParser.json());

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

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

module.exports = { app };