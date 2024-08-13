import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Link,
	Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AddComic from "./pages/AddComic";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";
import { logout } from "./services/authService";

const isAuthenticated = () => {
	return !!localStorage.getItem("token");
};

function App() {
	const [auth, setAuth] = useState(isAuthenticated());

	useEffect(() => {
		setAuth(isAuthenticated());
	}, []);

	const handleLogout = () => {
		logout();
		setAuth(false);
	};

	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						{!auth && (
							<>
								<li>
									<Link to="/register">Register</Link>
								</li>
								<li>
									<Link to="/login">Login</Link>
								</li>
							</>
						)}
						{auth && (
							<>
								<li>
									<Link to="/profile">Profile</Link>
								</li>
								<li>
									<Link to="/add-comic">Add Comic</Link>
								</li>
								<li>
									<Link to="/collection">Collections</Link>
								</li>
								<li>
									<Link to="/wishlist">Wishlist</Link>
								</li>
								<li>
									<button onClick={handleLogout}>Logout</button>
								</li>
							</>
						)}
					</ul>
				</nav>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<Register setAuth={setAuth} />} />
					<Route path="/login" element={<Login setAuth={setAuth} />} />
					<Route
						path="/profile"
						element={auth ? <Profile /> : <Navigate to="/login" />}
					/>
					<Route
						path="/add-comic"
						element={auth ? <AddComic /> : <Navigate to="/login" />}
					/>
					<Route
						path="/collection"
						element={auth ? <Collection /> : <Navigate to="/login" />}
					/>
					<Route
						path="/wishlist"
						element={auth ? <Wishlist /> : <Navigate to="/login" />}
					/>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
