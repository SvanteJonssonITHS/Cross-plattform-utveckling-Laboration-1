// External dependencies
import { StrictMode } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Internal dependencies
import Home from './views/Home';

export default function () {
	return (
		<StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</StrictMode>
	);
}
