// External dependencies
import { useState, useEffect, useContext } from 'react';
import { Field, ErrorMessage, Form, Formik } from 'formik';
import Select from 'react-select';

// Internal dependencies
import { Modal } from './';
import { UserContext } from '../contexts';

export default (prop) => {
	const { userId } = useContext(UserContext);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		(async () => {
			const request = await fetch(`/api/user/`);
			const response = await request.json();
			if (response.success) {
				setUsers(
					response.data
						.map((user) => {
							if (user.id === userId) {
								return null;
							} else {
								return {
									value: user.id,
									label: `${user.name} (${user.email})`
								};
							}
						})
						.filter((user) => user !== null)
				);
			} else {
				prop.onClose();
			}
		})();
	}, [prop.isOpen]);

	return (
		<Modal isOpen={prop.isOpen} onClose={prop.onClose}>
			<Formik
				initialValues={{
					name: '',
					members: [],
					submitError: ''
				}}
				onSubmit={(values, { setErrors, setSubmitting }) => {
					values.members = values.members.map((user) => user.value);
					(async () => {
						const request = await fetch('/api/chat/', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(values)
						});
						const response = await request.json();
						if (response.success) {
							prop.onClose(response.data[0]);
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

					if (values.members.length < 1) {
						errors.members = 'At least one member is required';
					}

					return errors;
				}}
			>
				{({ isSubmitting, isValid, setFieldValue }) => (
					<Form className="m-auto flex min-h-screen w-full flex-col rounded-none border-2 border-neutral-400 bg-white p-6 sm:min-h-fit sm:w-8/12 sm:rounded-md md:w-6/12 lg:w-4/12">
						<h2 className="mb-10 text-3xl font-semibold">New chat</h2>
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
								<span>Members </span>
								<ErrorMessage component="span" name="members" className="text-sm italic text-red-500" />
							</p>
							<Field
								name="members"
								component={Select}
								isMulti={true}
								options={users}
								onChange={(value) => setFieldValue('members', value)}
								className="mb-10 rounded-md border-2 border-neutral-400"
								styles={{
									control: () => ({
										border: 'none',
										display: 'flex'
									})
								}}
							/>
						</label>
						<section className="flex justify-between">
							<input
								onClick={() => {
									prop.onClose(null);
								}}
								type="button"
								value="Close"
								className="mb-2 w-5/12 cursor-pointer rounded-md bg-neutral-200 py-2 font-semibold text-black hover:bg-neutral-300"
							/>
							<input
								disabled={isSubmitting || !isValid}
								type="submit"
								value="Create"
								className="mb-2 w-5/12 cursor-pointer rounded-md bg-green-500 py-2 font-semibold text-white hover:bg-green-600 disabled:bg-green-400"
							/>
						</section>
						<ErrorMessage component="span" name="submitError" className="mb-2 italic text-red-500" />
					</Form>
				)}
			</Formik>
		</Modal>
	);
};
