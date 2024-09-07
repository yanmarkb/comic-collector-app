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

// This function checks if the user is authenticated by looking for a token in localStorage.
// If the token exists, the user is authenticated, otherwise, they're not.
const isAuthenticated = () => {
	const token = localStorage.getItem("token"); // Grab the token from localStorage.
	console.log("Token from localStorage:", token); // Log the token to check if it's there.
	return !!token; // Returns true if token exists, false if it doesn't.
};

// This function retrieves the user ID from localStorage.
// The userId is needed for identifying the logged-in user and their related data.
const getUserId = () => {
	const userId = localStorage.getItem("userId"); // Grab the userId from localStorage.
	console.log("UserID from localStorage:", userId); // Log the userId to see if it's been retrieved.
	return userId; // Return the userId to be used elsewhere in the app.
};

function App() {
	// We use React Router's `<Router>` to wrap the whole app, so we can handle page navigation.
	return (
		<Router>
			<AppContent /> {/* Load the main app content */}
		</Router>
	);
}

function AppContent() {
	const [auth, setAuth] = useState(isAuthenticated()); // This state keeps track of whether the user is logged in or not.
	const userId = getUserId(); // Get the userId from localStorage.
	const [comicName, setComicName] = useState(""); // This state holds the comic name the user types in the search bar.
	const navigate = useNavigate(); // `useNavigate` allows us to programmatically navigate to different pages.

	// This `useEffect` runs when the component mounts and anytime the `auth` state changes.
	// It checks if the user is authenticated by looking at the token.
	useEffect(() => {
		setAuth(isAuthenticated()); // If the token is valid, it updates the `auth` state.
	}, []); // Empty array means this effect only runs once on component mount.

	// This function handles logging the user out.
	// It clears the user’s session by removing the token and setting `auth` to false.
	const handleLogout = () => {
		logout(); // Call the logout function, which removes the token.
		setAuth(false); // Update the `auth` state to reflect the user is logged out.
		console.log("User logged out, token removed"); // Log the logout action for debugging.
	};

	// This function handles when the user clicks the search button.
	// It navigates to the home page with the search query as a URL parameter.
	const handleSearchButtonClick = () => {
		navigate(`/?search=${comicName}`); // This navigates to the home page and adds the search term to the URL.
	};

	// This function listens for when the user presses the Enter key to trigger a search.
	// If the user hits Enter while typing in the search bar, it runs the search.
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			handleSearchButtonClick(); // If Enter is pressed, it triggers the search just like clicking the button.
		}
	};

	// This function keeps track of what the user types in the search bar.
	// It updates the `comicName` state with whatever is typed.
	const handleChange = (event) => {
		setComicName(event.target.value); // Set the state to the current input value in the search bar.
	};

	return (
		<div>
			<nav className="navbar">
				<ul>
					{/* This is the home link that takes the user back to the homepage */}
					<li>
						<Link to="/" onClick={() => (window.location.href = "/")}>
							Home
						</Link>
					</li>
					{/* If the user is authenticated, show these additional links */}
					{auth && (
						<>
							<li>
								{/* Link to the user’s collections */}
								<Link to="/collection">Collections</Link>
							</li>
							<li>
								{/* Link to the user’s profile page */}
								<Link to="/profile">Profile</Link>
							</li>
						</>
					)}
				</ul>
				{/* The search bar and button for the comic search feature */}
				<div className="search-bar">
					<input
						type="text"
						value={comicName}
						onChange={handleChange} // Update the comic name in state as the user types.
						placeholder="Comic Name" // Placeholder text in the search bar.
						className="navbar-search-input"
						onKeyDown={handleKeyDown} // Trigger search when the user presses Enter.
					/>
					{/* Button to trigger the search */}
					<button
						onClick={handleSearchButtonClick}
						className="navbar-search-button">
						Search
					</button>
				</div>
				{/* Show the logout button if the user is authenticated */}
				{auth && <button onClick={handleLogout}>Logout</button>}
			</nav>

			{/* Here we define the routes for different pages in the app */}
			<Routes>
				{/* Route to the home page, passing the userId and comicName as props */}
				<Route
					path="/"
					element={<Home userId={userId} comicName={comicName} />}
				/>
				{/* Route to the profile page, which only shows if the user is authenticated.
				    If they’re not, redirect them to the login page */}
				<Route
					path="/profile"
					element={
						auth ? <Profile userId={userId} /> : <Navigate to="/login" />
					}
				/>
				{/* Route to the collections page, again checking if the user is logged in.
				    If not, redirect them to the login page */}
				<Route
					path="/collection"
					element={
						auth ? <Collection userId={userId} /> : <Navigate to="/login" />
					}
				/>
				{/* Route to the wishlist page with authentication check */}
				<Route
					path="/wishlist"
					element={
						auth ? <Wishlist userId={userId} /> : <Navigate to="/login" />
					}
				/>
				{/* Route to view the details of a specific comic, checking if the user is authenticated */}
				<Route
					path="/comic/:id"
					element={auth ? <ComicDetails /> : <Navigate to="/login" />}
				/>
				{/* Catch-all route: If the user tries to access a non-existent page, redirect them to the home page */}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</div>
	);
}

export default App;
