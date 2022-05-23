// External dependencies
import { StrictMode, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Internal dependencies
import { Home, LandingPage, Register, Login } from './views';

export default function () {
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		(async () => {
			const request = await fetch('/api/');
			const response = await request.json();
			setAuthenticated(response.authenticated);
		})();
	}, []);

	return (
		<StrictMode>
			<BrowserRouter>
				{authenticated ? (
					<Routes>
						<Route path="/" element={<Home />} />
					</Routes>
				) : (
					<Routes>
						<Route path="/" element={<LandingPage />} />
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
					</Routes>
				)}
			</BrowserRouter>
		</StrictMode>
	);
}
