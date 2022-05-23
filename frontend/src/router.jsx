// External dependencies
import { StrictMode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Internal dependencies
import Home from './views/Home';

const authenticated = async () => {
	const request = await fetch('/api/');
	const response = await request.json();
	return response.authenticated;
};

export default function () {
	return (
		<StrictMode>
			<BrowserRouter>
				<Routes>
					<Route index element={authenticated() ? <Home /> : <Navigate to="/tjotahejti" />} />
				</Routes>
			</BrowserRouter>
		</StrictMode>
	);
}
