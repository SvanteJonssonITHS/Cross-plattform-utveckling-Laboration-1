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
			className="absolute w-screen h-screen bg-black/[.5] grid items-center overflow-y-scroll"
			onClick={(event) => closeModal(event, prop.onClose)}
		>
			{prop.children}
		</div>
	);
};
