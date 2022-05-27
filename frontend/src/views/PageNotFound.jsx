import { Link } from 'wouter';

export default function () {
	return (
		<main className="flex flex min-h-screen w-screen flex-col items-center justify-center bg-gray-900 text-white">
			<h2 className="mb-5 text-7xl">404</h2>
			<h3 className="mb-5 text-4xl">Page not found</h3>
			<p className="text-lg">
				Sorry but the page you are looking for does not exist. To go back to the homepage,{' '}
				<Link href="/">
					<a className="font-semibold text-green-500 hover:underline">click here</a>
				</Link>
			</p>
		</main>
	);
}
