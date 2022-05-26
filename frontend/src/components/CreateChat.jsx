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
									label: user.email
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

					if (values.members.length < 1) {
						errors.members = 'At least one member is required';
					}

					return errors;
				}}
			>
				{({ isSubmitting, isValid, setFieldValue }) => (
					<Form className="flex flex-col m-auto w-full min-h-screen sm:w-8/12 md:w-6/12 lg:w-4/12 sm:min-h-fit rounded-none sm:rounded-md bg-white p-6 border-2 border-neutral-400">
						<h2 className="text-3xl font-semibold mb-10">New chat</h2>
						<label className="flex flex-col">
							<p>
								<span>Name </span>
								<ErrorMessage component="span" name="name" className="text-red-500 text-sm italic" />
							</p>
							<Field
								name="name"
								type="text"
								className="rounded-md border-2 border-neutral-400 mb-5 p-1"
								autoFocus
							/>
						</label>
						<label className="flex flex-col">
							<p>
								<span>Members </span>
								<ErrorMessage component="span" name="members" className="text-red-500 text-sm italic" />
							</p>
							<Field
								name="members"
								component={Select}
								isMulti={true}
								options={users}
								onChange={(values) => {
									setFieldValue(
										'members',
										values.map((value) => value.value)
									);
								}}
								className="rounded-md border-2 border-neutral-400 mb-10"
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
								className="text-black w-5/12 py-2 mb-2 rounded-md bg-neutral-200 hover:bg-neutral-300 font-semibold cursor-pointer"
							/>
							<input
								disabled={isSubmitting || !isValid}
								type="submit"
								value="Update profile"
								className="w-5/12 py-2 mb-2 rounded-md bg-green-500 disabled:bg-green-400 hover:bg-green-600 text-white font-semibold cursor-pointer"
							/>
						</section>
					</Form>
				)}
			</Formik>
		</Modal>
	);
};
