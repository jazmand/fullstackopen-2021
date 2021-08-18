import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent} from '@testing-library/react';
import Blog from './Blog';

test("component displaying a blog renders the blog's title and author", () => {
	const sampleBlog = {
		title: 'Component testing is done with react-testing-library',
		author: 'Harry Potter',
	};

	const component = render(<Blog blog={sampleBlog} />);

	component.debug();

	expect(component.container).toHaveTextContent(sampleBlog.title);
	expect(component.container).toHaveTextContent(sampleBlog.author);
});
