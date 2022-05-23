// External dependencies
import { StrictMode, useEffect, useState } from 'react';
import { Switch, Route, useLocation } from 'wouter';

// Internal dependencies
import { Home, LandingPage, Register, Login } from './views';

export default function () {
	const [location] = useLocation();
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		(async () => {
			const request = await fetch('/api/');
			const response = await request.json();
			setAuthenticated(response.authenticated);
		})();
	}, [location]);

	return (
		<StrictMode>
			<Switch>
				<Route path="/">{authenticated ? <Home /> : <LandingPage />}</Route>
				{!authenticated && (
					<Route path="/register">
						<Register />
					</Route>
				)}
				{!authenticated && (
					<Route path="/login">
						<Login />
					</Route>
				)}
				<Route>404, Not Found!</Route>
			</Switch>
		</StrictMode>
	);
}
