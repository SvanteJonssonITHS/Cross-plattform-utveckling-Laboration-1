// External dependencies
import { useEffect } from 'react';

// Internal dependencies
import { Modal } from './';

export default (prop) => {
	const title = prop.title || 'Confirm action';
	const description = prop.description || 'Are you sure you want to do this?';
	const dismissText = prop.dismissText || 'Cancel';
	const confirmText = prop.confirmText || 'Confirm';

	useEffect(() => {
		if (typeof prop.onDismiss !== 'function')
			throw new Error('Prop onDismiss must be a function (ConfirmAction.jsx)');
		if (typeof prop.onConfirm !== 'function')
			throw new Error('Prop onConfirm must be a function (ConfirmAction.jsx)');
	}, []);

	return (
		<Modal isOpen={prop.isOpen} onClose={prop.onDismiss}>
			<section className="m-auto flex min-h-screen w-full flex-col rounded-none border-2 border-neutral-400 bg-white p-6 text-center sm:min-h-fit sm:w-8/12 sm:rounded-md md:w-6/12 lg:w-4/12">
				<h2 className="mb-10 text-3xl font-semibold">{title}</h2>
				<p className="mb-10">{description}</p>
				<section className="flex justify-between">
					<input
						onClick={() => prop.onDismiss()}
						type="button"
						value={dismissText}
						className="mb-2 w-5/12 cursor-pointer rounded-md bg-neutral-200 py-2 font-semibold text-black hover:bg-neutral-300"
					/>
					<input
						onClick={() => prop.onConfirm()}
						type="button"
						value={confirmText}
						className="mb-2 w-5/12 cursor-pointer rounded-md bg-green-500 py-2 font-semibold text-white hover:bg-green-600 disabled:bg-green-400"
					/>
				</section>
			</section>
		</Modal>
	);
};
