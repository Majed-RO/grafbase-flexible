import { SessionInterface, UserProfile } from '@/common.types';
import { NextAuthOptions, User, getServerSession } from 'next-auth';

import GoogleProvider from 'next-auth/providers/google';
import { createUser, getUser } from './actions';
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		})
	],
	jwt: {
		encode: ({ secret, token }) => {
			const encodedToken = jsonwebtoken.sign(
				{
					...token,
					iss: 'grafbase',
					exp:
						Math.floor(Date.now() / 1000) +
						60 * 60
				},
				secret
			);

			return encodedToken;
		},
		decode: ({ secret, token }) => {
			const decodedToken = jsonwebtoken.verify(
				token!,
				secret
			) as JWT;

			return decodedToken;
		}
	},
	theme: {
		colorScheme: 'light',
		logo: '/logo.png'
	},
	callbacks: {
		async session({ session }) {
			// here we merge the session returned from google with the user info saved in grafbase
			const email = session?.user?.email as string;

			try {
				const data = (await getUser(email)) as {
					user?: UserProfile;
				};

				const newSession = {
					...session,
					user: {
						...session.user,
						...data?.user
					}
				};

				return newSession;
			} catch (error) {
				console.log(
					'Error retrieving user data',
					error
				);
				return session;
			}
		},
		async signIn({ user }) {
			try {
				// get the user if they exist
				const userExists = (await getUser(
					user?.email as string
				)) as { user?: UserProfile };

				// if they don't exist, create them
				if (!userExists.user) {
					await createUser(
						user.name as string,
						user.email as string,
						user.image as string
					);
				}

				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		}
	}
};

export async function getCurrentUser() {
	const session = (await getServerSession(
		authOptions
	)) as SessionInterface;

	return session;
}