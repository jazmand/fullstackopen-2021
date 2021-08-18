import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent} from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
	let component;
	const sampleBlog = {
		title: 'Component testing is done with react-testing-library',
		author: 'Harry Potter',
		url: 'www.harrypotter.com',
		likes: 0,
		user: {
			username: 'test',
			name: 'test test',
		},
	};

	const sampleUser = {
		username: 'test',
		name: 'test test',
	};

	let mockHandler = jest.fn();

	beforeEach(() => {
		component = render(
			<Blog blog={sampleBlog} user={sampleUser} handleLikes={mockHandler} />
		);
	});

	test("component displaying a blog renders the blog's title and author", () => {
		// component.debug();

		expect(component.container).toHaveTextContent(sampleBlog.title);
		expect(component.container).toHaveTextContent(sampleBlog.author);
		expect(component.container).not.toHaveTextContent(sampleBlog.likes);
		expect(component.container).not.toHaveTextContent(sampleBlog.url);
	});

	test("blog's url and number of likes are shown when the button controlling the shown details has been clicked", () => {
		const button = component.getByText('view');
		fireEvent.click(button);

		expect(component.container).toHaveTextContent(sampleBlog.url);
		expect(component.container).toHaveTextContent(sampleBlog.likes);
	});

	test('like button is clicked twice', () => {
		const viewButton = component.getByText('view');
		fireEvent.click(viewButton);

		const likeButton = component.getByText('like');
		fireEvent.click(likeButton);
		fireEvent.click(likeButton);

		expect(mockHandler.mock.calls).toHaveLength(2);
	});
});
