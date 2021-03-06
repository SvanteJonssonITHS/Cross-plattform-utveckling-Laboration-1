// Dependencies
import { useEffect, useState } from 'react';

String.prototype.toRGB = function () {
	let hash = 0;
	if (this.length === 0) return hash;

	// Use each character's Unicode value to create a hash
	for (const char of this) {
		hash = char.charCodeAt() + ((hash << 5) - hash);
		hash &= hash;
	}

	// Return a rgb color code in form of an array using the hash
	return [0, 0, 0].map((_, i) => (hash >> (i * 8)) & 0xff);
};

export default (prop) => {
	const name = prop.name || null;
	const user = prop.user || null;
	const message = prop.message || null;
	const time = prop.time || null;

	const [color, setColor] = useState([163, 163, 163]);
	const [textColor, setTextColor] = useState('black');

	useEffect(() => {
		const rgb = name.toRGB();
		if (rgb) {
			const brightness = Math.round((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000);
			setTextColor(brightness > 125 ? 'black' : 'white');
			setColor(rgb);
		}
	}, []);

	return (
		<>
			{name && (
				<button
					className="flex h-full min-h-[64px] w-full items-center rounded-md p-2 text-left hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-none"
					onClick={prop.onClick}
				>
					<div
						className="flex aspect-square w-10 rounded-full"
						style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
					>
						<p className="m-auto text-lg font-semibold" style={{ color: textColor }}>
							{name.charAt(0)}
						</p>
					</div>
					<div className="w-11/12 px-2">
						<h3 className="flex items-center text-lg font-semibold">
							<span className="w-9/12 truncate" title={name}>
								{name}
							</span>
							{time && <span className="w-3/12 text-right text-sm text-neutral-500">{time}</span>}
						</h3>
						{user && message && (
							<p className="truncate text-sm" title={`${user}: ${message}`}>
								<span className="font-semibold">{user}:</span> {message}
							</p>
						)}
					</div>
				</button>
			)}
		</>
	);
};
