// External dependencies
import { useState, useEffect, useContext } from 'react';
import { Field, ErrorMessage, Form, Formik } from 'formik';
import Select from 'react-select';

// Internal dependencies
import { Modal } from './';
import { UserContext } from '../contexts';

const getChat = async (id) => {
	const request = await fetch(`/api/chat/?ids=${id}`);
	const response = await request.json();
	if (response.success) {
		return response.data[0];
	} else {
		return null;
	}
};

const getUsers = async () => {
	const request = await fetch(`/api/user/`);
	const response = await request.json();
	if (response.success) {
		return response.data;
	} else {
		return [];
	}
};

export default (prop) => {
	const { userId } = useContext(UserContext);
	const [chat, setChat] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		(async () => {
			const chat = await getChat(prop.chatId);
			if (chat) {
				setChat(chat);
			} else {
				prop.onClose();
			}

			const users = await getUsers();
			if (users && chat) {
				setUsers(
					users
						.map((user) => {
							if (user.id === userId) return null;
							const member = { value: user.id, label: `${user.name} (${user.email})` };
							chat.users.forEach((chatUser) => {
								if (chatUser.id === user.id) {
									member.isSelected = true;
								}
							});
							return member;
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
				enableReinitialize={true}
				initialValues={{
					id: prop.chatId,
					name: chat.name,
					members: users.filter((user) => user.isSelected),
					submitError: ''
				}}
				onSubmit={(values, { setErrors, setSubmitting }) => {
					values.members = values.members.map((user) => user.value);
					(async () => {
						const request = await fetch('/api/chat/', {
							method: 'PUT',
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
					<Form className="m-auto flex min-h-screen w-full flex-col rounded-none border-2 border-neutral-400 bg-white p-6 sm:min-h-fit sm:w-8/12 sm:rounded-md md:w-6/12 lg:w-4/12">
						<h2 className="mb-10 text-3xl font-semibold">Update chat</h2>
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
								value={users.filter((user) => user.isSelected)}
								onChange={(values) => {
									setFieldValue(
										'members',
										values.map((value) => value.value)
									);
								}}
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
								value="Update profile"
								className="mb-2 w-5/12 cursor-pointer rounded-md bg-green-500 py-2 font-semibold text-white hover:bg-green-600 disabled:bg-green-400"
							/>
						</section>
					</Form>
				)}
			</Formik>
		</Modal>
	);
};
