// External dependencies
import { StrictMode, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Internal dependencies
import { Home, LandingPage } from './views';

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
				<Routes>
					{authenticated ? (
						<Route path="/" element={<Home />} />
					) : (
						<Route path="/" element={<LandingPage />} />
					)}
				</Routes>
			</BrowserRouter>
		</StrictMode>
	);
}
