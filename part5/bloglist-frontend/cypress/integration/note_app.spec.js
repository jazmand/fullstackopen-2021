describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3003/api/testing/reset');
		const user = {
			name: 'Matti Luukkainen',
			username: 'mluukkai',
			password: 'salainen',
		};
		cy.request('POST', 'http://localhost:3003/api/users/', user);
		cy.visit('http://localhost:3000');
	});

	it('Login form is shown', function () {
		cy.contains('Log in to application');
		cy.contains('username');
		cy.contains('password');
		cy.contains('login');
	});

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.contains('Log in to application');

			cy.get('#username').type('mluukkai');
			cy.get('#password').type('salainen');
			cy.get('#login-button').click();

			cy.contains('Matti Luukkainen logged in');
		});

		it('fails with wrong credentials', function () {
			cy.contains('Log in to application').click();

			cy.get('#username').type('mluukkai');
			cy.get('#password').type('wrong');
			cy.get('#login-button').click();

			cy.get('.message')
				.should('contain', 'wrong username or password')
				.and('have.css', 'color', 'rgb(255, 0, 0)')
				.and('have.css', 'border-style', 'solid');

			cy.get('html').should('not.contain', 'Matti Luukkainen logged in');
		});
	});

	describe('When logged in', function () {
		beforeEach(function () {
			cy.login({
				name: 'Matti Luukkainen',
				username: 'mluukkai',
				password: 'salainen',
			});
		});

		it('A blog can be created', function () {
			cy.contains('new blog').click();
			cy.get('#title').type('This is a blog title');
			cy.get('#author').type('AuthorFirst AuthorLast');
			cy.get('#url').type('www.thisisaurl.com');
			cy.contains('Create').click();
			cy.contains('This is a blog title');
			cy.contains('AuthorFirst AuthorLast');
		});

		describe('and a blog exists', function () {
			beforeEach(function () {
				cy.createBlog({
					title: 'This is a blog title',
					author: 'AuthorFirst AuthorLast',
					url: 'www.thisisaurl.com',
				});
			});

			it('it can be liked', function () {
				cy.contains('view').click();
				cy.contains('like').click();
				cy.contains('likes 1');
			});

			it('it can be deleted', function () {
				cy.contains('view').click();
				cy.contains('remove').click();
				cy.get('html').should('not.contain', 'This is a blog title');
			});

			it.only('it can be deleted', function () {
				const user = {
					name: 'Other User',
					username: 'otherUser',
					password: 'salainen',
				};
				cy.request('POST', 'http://localhost:3003/api/users/', user);
				cy.login({
					username: 'otherUser',
					password: 'salainen',
				});
				cy.contains('view').click();
				cy.should('not.contain', 'remove').parent().find('button');
				cy.contains('This is a blog title');
				cy.contains('AuthorFirst AuthorLast');
			});
		});
	});
});
