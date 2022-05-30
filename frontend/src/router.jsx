// External dependencies
import { StrictMode, useEffect, useState } from 'react';
import { Switch, Route, useLocation } from 'wouter';

// Internal dependencies
import { Home, LandingPage, Register, Login, PageNotFound } from './views';
import { UserContext } from './contexts';

export default function () {
	const [location] = useLocation();
	const [authenticated, setAuthenticated] = useState(false);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		(async () => {
			const request = await fetch('/api/');
			const response = await request.json();
			setAuthenticated(response.authenticated);
			setUserId(response.userId);
		})();
	}, [location]);

	if (authenticated) {
		return (
			<StrictMode>
				<Switch>
					<Route path="/">
						<UserContext.Provider value={{ userId }}>
							<Home />
						</UserContext.Provider>
					</Route>
					<Route>
						<PageNotFound />
					</Route>
				</Switch>
			</StrictMode>
		);
	} else {
		return (
			<StrictMode>
				<Switch>
					<Route path="/">
						<LandingPage />
					</Route>
					<Route path="/register">
						<Register />
					</Route>
					<Route path="/login">
						<Login />
					</Route>
					<Route>
						<PageNotFound />
					</Route>
				</Switch>
			</StrictMode>
		);
	}
}
