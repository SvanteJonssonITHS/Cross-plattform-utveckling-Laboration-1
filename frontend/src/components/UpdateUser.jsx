// External dependencies
import { useContext, useState, useEffect } from 'react';
import { MdEdit, MdClose } from 'react-icons/md';
import { Field, ErrorMessage, Form, Formik } from 'formik';

// Internal dependencies
import { UserContext } from '../contexts';
import { Modal } from './';

export default (prop) => {
	const { userId } = useContext(UserContext);
	const [user, setUser] = useState(null);
	const [changeName, setChangeName] = useState(false);

	useEffect(() => {
		setChangeName(false);
		(async () => {
			const request = await fetch(`/api/user/?ids=${userId}`);
			const response = await request.json();
			if (response.success) {
				setUser(response.data[0]);
			} else {
				prop.onClose();
			}
		})();
	}, [prop.isOpen]);

	return (
		<Modal isOpen={prop.isOpen} onClose={prop.onClose}>
			{user && (
				<Formik
					initialValues={{
						name: user.name,
						submitError: '',
						submitSuccess: ''
					}}
					onSubmit={(values, { setErrors, setSubmitting }) => {
						(async () => {
							const request = await fetch('/api/user/', {
								method: 'PUT',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(values)
							});
							const response = await request.json();
							if (response.success) {
								setErrors({ submitSuccess: 'Update successful' });
							} else {
								setErrors({ submitError: 'Update unsuccessful' });
							}
							setSubmitting(false);
						})();
					}}
					validate={(values) => {
						const errors = {};

						if (values.name.trim() === '') {
							errors.name = 'A name is required';
						}

						return errors;
					}}
				>
					{({ isSubmitting, isValid, values }) => (
						<Form className="m-auto flex min-h-screen w-full flex-col rounded-none border-2 border-neutral-400 bg-white p-6 sm:min-h-fit sm:w-8/12 sm:rounded-md md:w-6/12 lg:w-4/12">
							<h2 className="mb-10 text-3xl font-semibold">Your profile</h2>
							<label className="flex flex-col">
								<p>
									<span>Name </span>
									<ErrorMessage
										component="span"
										name="name"
										className="text-sm italic text-red-500"
									/>
									<ErrorMessage
										component="span"
										name="submitError"
										className="mb-2 italic text-red-500"
									/>
									<ErrorMessage
										component="span"
										name="submitSuccess"
										className="mb-2 italic text-green-500"
									/>
								</p>
								{changeName ? (
									<div className="relative mb-5">
										<Field
											name="name"
											type="text"
											className="w-full rounded-md bg-neutral-200 px-2 py-1 pr-8 text-black focus:outline-none"
											placeholder="Search"
											autoComplete="off"
											autoFocus
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500 focus:text-neutral-900 focus:outline-none"
											onClick={() => setChangeName(false)}
										>
											<MdClose size="1.25em" />
										</button>
									</div>
								) : (
									<div className="relative mb-5">
										<input
											type="text"
											className="w-full rounded-md bg-neutral-200 px-2 py-1 pr-8 text-black focus:outline-none"
											disabled={true}
											value={values.name}
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500 focus:text-neutral-900 focus:outline-none"
											onClick={() => setChangeName(true)}
											autoFocus
										>
											<MdEdit size="1.25em" />
										</button>
									</div>
								)}
							</label>
							<label className="flex flex-col">
								<p>Email</p>
								<div className="mb-10">
									<input
										type="text"
										className="w-full rounded-md bg-neutral-200 px-2 py-1 pr-8 text-black focus:outline-none"
										disabled={true}
										value={user.email}
									/>
								</div>
							</label>
							<section className="flex justify-between">
								<input
									onClick={() => {
										prop.onClose();
									}}
									type="button"
									value="Close"
									className="mb-2 w-5/12 cursor-pointer rounded-md bg-neutral-200 py-2 font-semibold text-black hover:bg-neutral-300"
								/>
								<input
									disabled={isSubmitting || !isValid || user.name === values.name}
									type="submit"
									value="Update profile"
									className="mb-2 w-5/12 cursor-pointer rounded-md bg-green-500 py-2 font-semibold text-white hover:bg-green-600 disabled:bg-green-400"
								/>
							</section>
						</Form>
					)}
				</Formik>
			)}
		</Modal>
	);
};
