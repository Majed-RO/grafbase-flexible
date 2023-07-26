import { ProjectInterface, UserProfile } from '@/common.types';
import Image from 'next/image';

import Link from 'next/link';
import Button from './Button';
import ProjectCard from './ProjectCard';

type Props = {
	user: UserProfile;
};

const ProfilePage = ({ user }: Props) => (
	<section className="flex-col w-full mx-auto mb-10 flexCenter max-w-10xl paddings">
		<section className="w-full gap-10 flexBetween max-lg:flex-col">
			<div className="flex flex-col items-start w-full">
				<Image
					src={user?.avatarUrl}
					width={100}
					height={100}
					className="rounded-full"
					alt="user image"
				/>
				<p className="mt-10 text-4xl font-bold">
					{user?.name}
				</p>
				<p className="max-w-lg mt-5 text-3xl font-extrabold md:text-5xl md:mt-10">
					I’m Software Engineer at JSM 👋
				</p>

				<div className="flex flex-wrap w-full gap-5 mt-8">
					<Button
						title="Follow"
						leftIcon="/plus-round.svg"
						bgColor="bg-light-white-400 !w-max"
						textColor="text-black-100"
					/>
					<Link href={`mailto:${user?.email}`}>
						<Button
							title="Hire Me"
							leftIcon="/email.svg"
						/>
					</Link>
				</div>
			</div>

			{user?.projects?.edges?.length > 0 ? (
				<Image
					src={
						user?.projects?.edges[0]?.node
							?.image
					}
					alt="project image"
					width={739}
					height={554}
					className="object-contain rounded-xl"
				/>
			) : (
				<Image
					src="/profile-post.png"
					width={739}
					height={554}
					alt="project image"
					className="rounded-xl"
				/>
			)}
		</section>

		<section className="flex-col w-full mt-16 flexStart lg:mt-28">
			<p className="w-full text-lg font-semibold text-left">
				Recent Work
			</p>

			<div className="profile_projects">
				{user?.projects?.edges?.map(
					({
						node
					}: {
						node: ProjectInterface;
					}) => (
						<ProjectCard
							key={`${node?.id}`}
							id={node?.id}
							image={node?.image}
							title={node?.title}
							name={user.name}
							avatarUrl={
								user.avatarUrl
							}
							userId={user.id}
						/>
					)
				)}
			</div>
		</section>
	</section>
);

export default ProfilePage;
