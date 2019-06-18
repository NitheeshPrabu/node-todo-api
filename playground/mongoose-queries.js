const {ObjectID} = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

var id = '5d08a7dd9993134b778f743a';

if (!ObjectID.isValid(id)) {
	console.log('Id is not valid');
}

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todo by find', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo by findOne', todo);
// });

Todo.findById(id).then((todo) => {
	console.log('Todo by id', todo);
}).catch((e) => console.log(e));