import { Link, useLocation } from 'wouter';

export default function () {
	const [, setLocation] = useLocation();

	return (
		<main className="flex min-h-screen w-screen bg-gray-900 text-white">
			<section className="flex w-full flex-col items-center justify-center p-3 md:w-1/2">
				<div>
					<h1 className="mb-2 text-3xl font-bold md:text-5xl">Texting has never been easier!</h1>
					<p className="mb-2 text-xl text-white/[.75] md:text-2xl">
						One-on-one or groups, we&#39;ve got you covered!
					</p>
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
							className="mr-2 rounded-md py-2 pl-2 pr-10 text-black outline-none"
							autoFocus
						/>
						<button className="rounded-md bg-green-500 px-7 py-2 font-semibold hover:bg-green-600">
							Sign Up
						</button>
					</form>
					<span className="text-sm md:text-base">
						<p>
							Already have an account?{' '}
							<Link href="/login">
								<a className="font-semibold text-green-500 hover:underline">Login here!</a>
							</Link>
						</p>
					</span>
				</div>
			</section>
			<section className="hidden w-1/2 md:block">Image here</section>
		</main>
	);
}
