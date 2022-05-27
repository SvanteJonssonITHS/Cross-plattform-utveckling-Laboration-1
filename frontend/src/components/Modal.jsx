import { useEffect } from 'react';

const closeModal = (event, onClose) => {
	if (event.target === event.currentTarget) {
		onClose();
	}
};

export default (prop) => {
	useEffect(() => {
		if (typeof prop.onClose !== 'function') throw new Error('Prop onClose must be a function (Modal.jsx)');
	}, []);

	if (!prop.isOpen) return null;

	return (
		<div
			className="absolute grid h-screen w-screen items-center overflow-y-scroll bg-black/[.5]"
			onClick={(event) => closeModal(event, prop.onClose)}
		>
			{prop.children}
		</div>
	);
};
