// External dependencies
import { useEffect } from 'react';

// Internal dependencies
import { Modal } from './';

export default (prop) => {
	const title = prop.title || 'Confirm action';
	const description = prop.description || 'Are you sure you want to do this?';
	const dissmissText = prop.dissmissText || 'Cancel';
	const confirmText = prop.confirmText || 'Confirm';

	useEffect(() => {
		if (typeof prop.onDissmiss !== 'function')
			throw new Error('Prop onDissmiss must be a function (ConfirmAction.jsx)');
		if (typeof prop.onConfirm !== 'function')
			throw new Error('Prop onConfirm must be a function (ConfirmAction.jsx)');
	}, []);

	return (
		<Modal isOpen={prop.isOpen} onClose={prop.onDissmiss}>
			<section className="flex flex-col m-auto w-full min-h-screen sm:w-8/12 md:w-6/12 lg:w-4/12 sm:min-h-fit rounded-none sm:rounded-md bg-white p-6 border-2 border-neutral-400 text-center">
				<h2 className="text-3xl font-semibold mb-10">{title}</h2>
				<p className="mb-10">{description}</p>
				<section className="flex justify-between">
					<input
						onClick={() => prop.onDissmiss()}
						type="button"
						value={dissmissText}
						className="text-black w-5/12 py-2 mb-2 rounded-md bg-neutral-200 hover:bg-neutral-300 font-semibold cursor-pointer"
					/>
					<input
						onClick={() => prop.onConfirm()}
						type="button"
						value={confirmText}
						className="w-5/12 py-2 mb-2 rounded-md bg-green-500 disabled:bg-green-400 hover:bg-green-600 text-white font-semibold cursor-pointer"
					/>
				</section>
			</section>
		</Modal>
	);
};
