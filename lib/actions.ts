import { ProjectForm } from '@/common.types';
import {
	createProjectMutation,
	createUserMutation,
	deleteProjectMutation,
	getProjectByIdQuery,
	getProjectsOfUserQuery,
	getUserQuery,
	projectsQuery,
	updateProjectMutation
} from '@/graphql';
import { GraphQLClient } from 'graphql-request';

const isProduction = process.env.NODE_ENV === 'production';

const apiUrl = isProduction
	? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ''
	: 'http://127.0.0.1:4000/graphql';

const apiKey = isProduction
	? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ''
	: '1234';

const serverUrl = isProduction
	? process.env.NEXT_PUBLIC_SERVER_URL
	: 'http://localhost:3000';

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
	try {
		return await client.request(query, variables);
	} catch (error) {
		throw error;
	}
};

export const getUser = (email: string) => {
	client.setHeader('x-api-key', apiKey);
	return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
	client.setHeader('x-api-key', apiKey);

	const variables = {
		input: {
			name: name,
			email: email,
			avatarUrl: avatarUrl
		}
	};

	return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
	try {
		const response = await fetch(`${serverUrl}/api/auth/token`);

		return response.json();
	} catch (error) {
		throw error;
	}
};

const uploadImage = async (imagePath: string) => {
	try {
		const response = await fetch(`${serverUrl}/api/upload`, {
			method: 'POST',
			body: JSON.stringify({ path: imagePath })
		});

		return response.json();
	} catch (error) {
		throw error;
	}
};

// the token to ensure that the creator of this project can actually create one!
export const createNewProject = async (
	form: ProjectForm,
	creatorId: string,
	token: string
) => {
	const imageUrl = await uploadImage(form.image);

	if (imageUrl.url) {
		client.setHeader('Authorization', `Bearer ${token}`);

		const variables = {
			input: {
				...form,
				image: imageUrl.url,
				createdBy: {
					link: creatorId
				}
			}
		};
		return makeGraphQLRequest(createProjectMutation, variables);
	}
};

export const updateProject = async (
	form: ProjectForm,
	projectId: string,
	token: string
) => {
	function isBase64DataURL(value: string) {
		const base64Regex = /^data:image\/[a-z]+;base64,/;
		return base64Regex.test(value);
	}

	let updatedForm = { ...form };

	// if the url in format of base64, then it's new image, otherwise it will be cloudinary url
	const isUploadingNewImage = isBase64DataURL(form.image);

	if (isUploadingNewImage) {
		const imageUrl = await uploadImage(form.image);

		if (imageUrl.url) {
			updatedForm = { ...updatedForm, image: imageUrl.url };
		}
	}

	client.setHeader('Authorization', `Bearer ${token}`);

	const variables = {
		id: projectId,
		input: updatedForm
	};

	return makeGraphQLRequest(updateProjectMutation, variables);
};

export const fetchAllProjects = async (
	category?: string | null,
	endCursor?: string | null
) => {
	client.setHeader('x-api-key', apiKey);

	return makeGraphQLRequest(projectsQuery, {
		category: category,
		endCursor
	});
};

export const getProjectDetails = (id: string) => {
	client.setHeader('x-api-key', apiKey);
	return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const deleteProject = (id: string, token: string) => {
	client.setHeader('Authorization', `Bearer ${token}`);
	return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const getUserProjects = (id: string, last?: number) => {
	client.setHeader('x-api-key', apiKey);
	return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};