import { Link, useLocation } from 'wouter';

export default function () {
	const [, setLocation] = useLocation();

	return (
		<main className="w-screen min-h-screen flex bg-gray-900 text-white">
			<section className="w-1/2 flex flex-col justify-center items-center">
				<div>
					<h1 className="text-5xl font-bold mb-2">Texting has never been easier!</h1>
					<p className="text-2xl text-white/[.75] mb-2">One-on-one or groups, we&#39;ve got you covered!</p>
					<form
						className="mb-1"
						onSubmit={(event) => {
							event.preventDefault();

							const redirect = event.target.email.value
								? `/register?email=${event.target.email.value}`
								: '/register';

							setLocation(redirect);
						}}
					>
						<input
							name="email"
							type="email"
							placeholder="Email address"
							className="pl-2 pr-10 py-2 rounded-md mr-2 text-black outline-none"
							autoFocus
						/>
						<button className="px-7 py-2 rounded-md bg-green-500 hover:bg-green-600 font-semibold">
							Sign Up
						</button>
					</form>
					<span>
						<p>
							Already have an account?{' '}
							<Link href="/login">
								<a className="text-green-500 font-semibold hover:underline">Login here!</a>
							</Link>
						</p>
					</span>
				</div>
			</section>
			<section className="w-1/2">Image here</section>
		</main>
	);
}
