import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent} from '@testing-library/react';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
	test('<BlogForm /> updates parent state and calls onSubmit', () => {
		const sampleBlogForm = {
			title: 'Component testing is done with react-testing-library',
			author: 'Harry Potter',
			url: 'www.harrypotter.com',
		};

		const createBlog = jest.fn();

		const component = render(<BlogForm createBlog={createBlog} />);

		const title = component.container.querySelector('#title');
		const author = component.container.querySelector('#author');
		const url = component.container.querySelector('#url');
		const form = component.container.querySelector('form');

		fireEvent.change(title, {
			target: {value: sampleBlogForm.title},
		});
		fireEvent.change(author, {
			target: {value: sampleBlogForm.author},
		});
		fireEvent.change(url, {
			target: {value: sampleBlogForm.url},
		});
		//component.debug();
		fireEvent.submit(form);

		expect(createBlog.mock.calls).toHaveLength(1);

		expect(createBlog.mock.calls[0][0].title).toBe(sampleBlogForm.title);
		expect(createBlog.mock.calls[0][0].author).toBe(sampleBlogForm.author);
		expect(createBlog.mock.calls[0][0].url).toBe(sampleBlogForm.url);
	});
});
