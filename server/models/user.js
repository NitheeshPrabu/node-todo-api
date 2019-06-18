const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

// adds as instance method
// gets called with the individual document
UserSchema.methods.toJSON = function() {
	var user = this;
	var userObjects = user.toObject();

	return _.pick(user, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

	user.tokens.push({ access, token });
	return user.save().then(() => {
		return token;
	});
}

// adds as a model method
// gets called with the model
UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch (err) {
		return Promise.reject();
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
}

var User = mongoose.model('User', UserSchema);

module.exports = { User };