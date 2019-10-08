const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json())
// jkjk
const DataBase = {
	user: [
	  {
	  	id: '123',
	  	name: 'kaif',
	  	email: 'kaif7@gmail.com',
	  	password: 'messi',
	  	entries: 0,
	  	joining: new Date()
	  },
	  {
	  	id: '124',
	  	name: 'azhar',
	  	email: 'azhar@gmail.com',
	  	password: 'behtreen',
	  	entries: 0,
	  	joining: new Date()

	  }
    ]
}

app.get('/',(req, res) => {
	res.json(DataBase.user);
})

app.post('/signin',(req, res) => {
	if(req.body.email === DataBase.user[0].email && req.body.password === DataBase.user[0].password) {
		res.json(DataBase.user[0]);
	}
	else {
		res.status(400).json("something is wrong")
	}
})

app.post('/register',(req, res) => {
	const { name, email, password } = req.body;
	DataBase.user.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joining: new Date()
	});
	res.json(DataBase.user[DataBase.user.length - 1]);
})

app.post('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	DataBase.user.forEach(users => {
		if(users.id === id) {
			found = true;
			return res.json(users);
		}
	})
	if(found === false) {
		res.status(400).json('user not found');
	}
})

app.put('/image',(req, res) => {
	const { id } = req.body;
	let found = false;
	DataBase.user.forEach(users => {
		if(users.id === id) {
			found = true;
			users.entries++;
			return res.json(users.entries);
		}
	})
	if(found === false) {
		res.status(400).json('user not found');
	}
})

app.listen(3000);

