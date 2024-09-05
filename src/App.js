import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Link,
	Navigate,
	useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";
import ComicDetails from "./pages/ComicDetails";
import { logout } from "./services/authService";
import "./App.css";

// Function to check if user is authenticated
const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	console.log("Token from localStorage:", token); // Debugging log to check token
	return !!token; // Return true if token exists
};

// Function to retrieve user ID from localStorage
const getUserId = () => {
	const userId = localStorage.getItem("userId");
	console.log("UserID from localStorage:", userId); // Debugging log to check userId
	return userId;
};

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

function AppContent() {
	const [auth, setAuth] = useState(isAuthenticated()); // State to track if the user is authenticated
	const userId = getUserId(); // Get the userId from localStorage
	const [comicName, setComicName] = useState("");
	const navigate = useNavigate();

	// Check for authentication changes on component mount
	useEffect(() => {
		setAuth(isAuthenticated()); // Update auth state if token changes
	}, []);

	// Handle logging out the user
	const handleLogout = () => {
		logout();
		setAuth(false); // Reset auth state after logging out
		console.log("User logged out, token removed"); // Log logout action
	};

	// Handle search button click
	const handleSearchButtonClick = () => {
		navigate(`/?search=${comicName}`); // Navigate to search results
	};

	// Handle search input key down (enter key for search)
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			handleSearchButtonClick(); // Trigger search when enter is pressed
		}
	};

	// Handle input change
	const handleChange = (event) => {
		setComicName(event.target.value); // Update the comic search term
	};

	return (
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
						value={comicName}
						onChange={handleChange}
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
	);
}

export default App;
