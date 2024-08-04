import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AddComic from "./pages/AddComic";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";

function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/register">Register</Link>
						</li>
						<li>
							<Link to="/login">Login</Link>
						</li>
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
					</ul>
				</nav>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/add-comic" element={<AddComic />} />
					<Route path="/collection" element={<Collection />} />
					<Route path="/wishlist" element={<Wishlist />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
