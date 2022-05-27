import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useLocation } from 'wouter';

export default function () {
	const [, setLocation] = useLocation();

	return (
		<main className="flex min-h-screen w-screen bg-gray-900">
			<Formik
				initialValues={{
					name: '',
					email: new URLSearchParams(window.location.search).get('email') || '',
					password: '',
					confirmPassword: '',
					submitError: ''
				}}
				onSubmit={(values, { setErrors, setSubmitting }) => {
					(async () => {
						const request = await fetch('/api/user/register', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(values)
						});
						const response = await request.json();
						if (response.success) {
							setLocation(`/login${values.email ? `?email=${values.email}` : ''}`);
						} else {
							setErrors({ submitError: response.message });
						}
						setSubmitting(false);
					})();
				}}
				validate={(values) => {
					const errors = {};

					if (values.name.trim() === '') {
						errors.name = 'A name is required';
					}

					if (values.email.trim() === '') {
						errors.email = 'An email is required';
					} else if (new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(values.email) === false) {
						errors.email = 'Invalid email address';
					}

					if (values.password.trim() === '') {
						errors.password = 'A password is required';
					}

					if (values.confirmPassword !== values.password) {
						errors.confirmPassword = 'Passwords must match';
					}

					return errors;
				}}
			>
				{({ isSubmitting, isValid }) => (
					<Form className="m-auto flex min-h-screen w-full flex-col rounded-none border-2 border-neutral-400 bg-white p-6 sm:min-h-fit sm:w-fit sm:rounded-md">
						<h2 className="mb-10 text-3xl font-semibold">Sign up to start texting!</h2>
						<label className="flex flex-col">
							<p>
								<span>Name </span>
								<ErrorMessage component="span" name="name" className="text-sm italic text-red-500" />
							</p>
							<Field
								name="name"
								type="text"
								className="mb-5 rounded-md border-2 border-neutral-400 p-1"
								autoFocus
							/>
						</label>
						<label className="flex flex-col">
							<p>
								<span>Email </span>
								<ErrorMessage component="span" name="email" className="text-sm italic text-red-500" />
							</p>
							<Field
								name="email"
								type="email"
								className="mb-5 rounded-md border-2 border-neutral-400 p-1"
							/>
						</label>
						<label className="flex flex-col">
							<p>
								<span>Password </span>
								<ErrorMessage
									component="span"
									name="password"
									className="text-sm italic text-red-500"
								/>
							</p>
							<Field
								name="password"
								type="password"
								className="mb-5 rounded-md border-2 border-neutral-400 p-1"
							/>
						</label>
						<label className="flex flex-col">
							<p>
								<span>Confirm Password </span>
								<ErrorMessage
									component="span"
									name="confirmPassword"
									className="text-sm italic text-red-500"
								/>
							</p>
							<Field
								name="confirmPassword"
								type="password"
								className="mb-5 rounded-md border-2 border-neutral-400 p-1"
							/>
						</label>
						<input
							disabled={isSubmitting || !isValid}
							type="submit"
							value="Register"
							className="mb-2 cursor-pointer rounded-md bg-green-500 px-7 py-2 font-semibold text-white hover:bg-green-600 disabled:bg-green-400"
						/>
						<ErrorMessage component="span" name="submitError" className="mb-2 italic text-red-500" />
						<span>
							<p>
								Already have an account?{' '}
								<Link href="/login">
									<a className="font-semibold text-green-500 hover:underline">Login here!</a>
								</Link>
							</p>
						</span>
					</Form>
				)}
			</Formik>
		</main>
	);
}
