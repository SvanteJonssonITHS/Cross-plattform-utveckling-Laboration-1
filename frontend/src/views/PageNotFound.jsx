import { Link } from 'wouter';

export default function () {
	return (
		<main className="w-screen min-h-screen flex bg-gray-900 text-white flex flex-col justify-center items-center">
			<h2 className="text-7xl mb-5">404</h2>
			<h3 className="text-4xl mb-5">Page not found</h3>
			<p className="text-lg">
				Sorry but the page you are looking for does not exist. To go back to the homepage,{' '}
				<Link href="/">
					<a className="text-green-500 font-semibold hover:underline">click here</a>
				</Link>
			</p>
		</main>
	);
}
