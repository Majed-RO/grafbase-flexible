import { NavLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import AuthProviders from './AuthProviders';
import { getCurrentUser } from '@/lib/session';
import { signOut } from 'next-auth/react';
import ProfileMenu from './ProfileMenu';

const Navbar = async () => {
	const session = await getCurrentUser();
	return (
		<nav className="flexBetween navbar ">
			<div className="flex-1 gap-10 flexStart">
				<Link href={'/'}>
					<Image
						src={'/logo.svg'}
						width={115}
						height={43}
						alt="Flexible"
					/>
				</Link>
				<ul className="hidden xl:flex text-small gap-7">
					{NavLinks.map(link => (
						<Link
							href={link.href}
							key={link.key}
						>
							{link.text}
						</Link>
					))}
				</ul>
			</div>

			<div className="gap-4 flexCenter">
				{session?.user ? (
					<>
						
            <ProfileMenu session={session} />

						<Link href={'/create-project'}>
							Share Work
						</Link>
            
            
					</>
				) : (
					<AuthProviders />
				)}
			</div>
		</nav>
	);
};

export default Navbar;
