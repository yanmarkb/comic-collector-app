import React from "react";
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

const isAuthenticated = () => {
	return !!localStorage.getItem("token");
};

const handleLogout = () => {
	localStorage.removeItem("token");
	window.location.href = "/login";
};

function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						{!isAuthenticated() && (
							<>
								<li>
									<Link to="/register">Register</Link>
								</li>
								<li>
									<Link to="/login">Login</Link>
								</li>
							</>
						)}
						{isAuthenticated() && (
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
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/profile"
						element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
					/>
					<Route
						path="/add-comic"
						element={
							isAuthenticated() ? <AddComic /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/collection"
						element={
							isAuthenticated() ? <Collection /> : <Navigate to="/login" />
						}
					/>
					<Route
						path="/wishlist"
						element={
							isAuthenticated() ? <Wishlist /> : <Navigate to="/login" />
						}
					/>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
