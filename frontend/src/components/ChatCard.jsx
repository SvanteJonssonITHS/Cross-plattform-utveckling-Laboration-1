import { useEffect, useState } from 'react';

String.prototype.toRGB = function () {
	let hash = 0;
	if (this.length === 0) return hash;

	for (let i = 0; i < this.length; i++) {
		hash = this.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}

	const rgb = [0, 0, 0];

	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 255;
		rgb[i] = value;
	}

	return rgb;
};

export default (prop) => {
	const name = prop.name || null;
	const user = prop.user || null;
	const message = prop.message || null;
	const time = prop.time || null;

	const [color, setColor] = useState([163, 163, 163]);
	const [textColor, setTextColor] = useState('white');

	useEffect(() => {
		setColor(prop.name.toRGB());
		const brightness = Math.round((color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000);
		setTextColor(brightness > 125 ? 'black' : 'white');
	}, []);

	return (
		<>
			{name && (
				<button
					className="w-full h-full p-2 min-h-[64px] flex items-center hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-none rounded-md text-left"
					onClick={prop.onClick}
				>
					<div
						className="w-1/12 aspect-square rounded-full flex"
						style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
					>
						<p className="m-auto font-semibold text-lg" style={{ color: textColor }}>
							{name.charAt(0)}
						</p>
					</div>
					<div className="px-2 w-11/12">
						<h3 className="font-semibold text-lg flex items-center">
							<span className="w-9/12 truncate" title={name}>
								{name}
							</span>
							{time && (
								<span className="text-sm font-base text-neutral-500 w-3/12 text-right">{time}</span>
							)}
						</h3>
						{user && message && (
							<p className="text-sm truncate" title={`${user}: ${message}`}>
								<span className="font-semibold">{user}:</span> {message}
							</p>
						)}
					</div>
				</button>
			)}
		</>
	);
};
