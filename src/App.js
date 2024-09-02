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
import ComicDetails from "./pages/ComicDetails";
import { logout } from "./services/authService";
import "./App.css";

const isAuthenticated = () => {
	return !!localStorage.getItem("token");
};

const getUserId = () => {
	return localStorage.getItem("userId");
};

function App() {
	const [auth, setAuth] = useState(isAuthenticated());
	const userId = getUserId();
	const [searchQuery, setSearchQuery] = useState("");
	const [comicName, setComicName] = useState("");

	useEffect(() => {
		setAuth(isAuthenticated());
	}, []);

	const handleLogout = () => {
		logout();
		setAuth(false);
	};

	const handleSearchButtonClick = () => {
		setComicName(searchQuery);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			setComicName(searchQuery);
		}
	};

	return (
		<Router>
			<div>
				<nav className="navbar">
					<ul>
						<li>
							<Link to="/" onClick={() => (window.location.href = "/")}>
								Home
							</Link>
						</li>
						{auth && (
							<>
								<li>
									<Link to="/collection">Collections</Link>
								</li>
								<li>
									<Link to="/profile">Profile</Link>
								</li>
							</>
						)}
					</ul>
					<div className="search-bar">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Comic Name"
							className="navbar-search-input"
							onKeyDown={handleKeyDown}
						/>
						<button
							onClick={handleSearchButtonClick}
							className="navbar-search-button">
							Search
						</button>
					</div>
					{auth && <button onClick={handleLogout}>Logout</button>}
				</nav>
				<Routes>
					<Route
						path="/"
						element={<Home userId={userId} comicName={comicName} />}
					/>
					<Route
						path="/profile"
						element={
							auth ? <Profile userId={userId} /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/collection"
						element={
							auth ? <Collection userId={userId} /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/wishlist"
						element={
							auth ? <Wishlist userId={userId} /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/comic/:id"
						element={auth ? <ComicDetails /> : <Navigate to="/login" />}
					/>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
