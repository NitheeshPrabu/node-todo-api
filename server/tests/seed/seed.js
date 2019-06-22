const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	email: 'test_user@example.com',
	password: 'abc123',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}],
},
{
	_id: userTwoId,
	email: 'test_user2@example.com',
	password: 'abc123',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
	}],
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 1560857040482,
	_creator: userTwoId
}];

const populateTodos = (done) => {
	Todo.deleteMany({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
}

const populateUsers = (done) => {
	User.deleteMany({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(() => done());
}

module.exports = { todos, populateTodos, users, populateUsers };