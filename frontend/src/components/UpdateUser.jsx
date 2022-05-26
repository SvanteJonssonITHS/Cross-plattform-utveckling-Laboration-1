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
						<Form className="flex flex-col m-auto w-full min-h-screen sm:w-8/12 md:w-6/12 lg:w-4/12 sm:min-h-fit rounded-none sm:rounded-md bg-white p-6 border-2 border-neutral-400">
							<h2 className="text-3xl font-semibold mb-10">Your profile</h2>
							<label className="flex flex-col">
								<p>
									<span>Name </span>
									<ErrorMessage
										component="span"
										name="name"
										className="text-red-500 text-sm italic"
									/>
									<ErrorMessage
										component="span"
										name="submitError"
										className="text-red-500 italic mb-2"
									/>
									<ErrorMessage
										component="span"
										name="submitSuccess"
										className="text-green-500 italic mb-2"
									/>
								</p>
								{changeName ? (
									<div className="relative mb-5">
										<Field
											name="name"
											type="text"
											className="w-full bg-neutral-200 text-black rounded-md px-2 pr-8 py-1 focus:outline-none"
											placeholder="Search"
											autoComplete="off"
											autoFocus
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500 focus:outline-none focus:text-neutral-900"
											onClick={() => setChangeName(false)}
										>
											<MdClose size="1.25em" />
										</button>
									</div>
								) : (
									<div className="relative mb-5">
										<input
											type="text"
											className="w-full bg-neutral-200 text-black rounded-md px-2 pr-8 py-1 focus:outline-none"
											disabled={true}
											value={values.name}
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500 focus:outline-none focus:text-neutral-900"
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
										className="w-full bg-neutral-200 text-black rounded-md px-2 pr-8 py-1 focus:outline-none"
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
									className="text-black w-5/12 py-2 mb-2 rounded-md bg-neutral-200 hover:bg-neutral-300 font-semibold cursor-pointer"
								/>
								<input
									disabled={isSubmitting || !isValid || user.name === values.name}
									type="submit"
									value="Update profile"
									className="w-5/12 py-2 mb-2 rounded-md bg-green-500 disabled:bg-green-400 hover:bg-green-600 text-white font-semibold cursor-pointer"
								/>
							</section>
						</Form>
					)}
				</Formik>
			)}
		</Modal>
	);
};
