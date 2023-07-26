'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
	id: string;
	image: string;
	title: string;
	name: string;
	avatarUrl: string;
	userId: string;
};

const ProjectCard = ({ id, image, title, name, avatarUrl, userId }: Props) => {
  
  const [randomLikes, setRandomLikes] = useState(0);
  const [randomViews, setRandomViews] = useState('');

  useEffect(() => {
    setRandomLikes(Math.floor(Math.random() * 10000))

    setRandomViews(String((Math.floor(Math.random() * 10000) / 1000).toFixed(1) + 'k'))
  }, []);
  
	return (
		<div className="flex-col rounded flexCenter-2xl drop-shadow-card">
			<Link
				href={`/project/${id}`}
				className="relative w-full h-full flexCenter group"
			>
				<Image
					src={image}
					alt="Project Image"
					width={414}
					height={314}
					className="object-cover w-full h-full rounded-2xl"
				/>

				<div className="hidden group-hover:flex profile_card-title">
					<p className="w-full ">{title}</p>
				</div>
			</Link>

			<div className="w-full px-2 mt-3 text-sm font-semibold flexBetween">
				<Link href={`/profile/${userId}`}>
					<div className="gap-2 flexCenter">
						<Image
							src={avatarUrl}
							width={24}
							height={24}
							className="rounded-full"
							alt="Profile Image"
						/>
            <p>{name}</p>
					</div>
				</Link>
				<div className="gap-3 flexCenter">
					<div className="gap-2 flexCenter">
						<Image
							src={'/hearth.svg'}
							width={13}
							height={12}
							alt=""
						/>
						<p className="text-sm">{randomLikes}</p>
					</div>

					<div className="gap-2 flexCenter">
						<Image
							src={'/eye.svg'}
							width={13}
							height={12}
							alt=""
						/>
						<p className="text-sm">{randomViews}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectCard;
