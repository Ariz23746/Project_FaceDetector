const handleRegister = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;
	if(!name || !email || !password) {
		return res.json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			email: email,
			hash: hash
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joining: new Date()
				})
				.then(user => {
					console.log(user[0]);
					res.json(user[0]);
				})
			})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json(err));	
}

module.exports = {
	handleRegister: handleRegister
};
