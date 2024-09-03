import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "../SearchContext";
import { logout } from "../services/authService";
import "./App.css";

const Navbar = ({ auth, setAuth }) => {
	const { searchQuery, setSearchQuery, setSearchPerformed } =
		useContext(SearchContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		setAuth(false);
		navigate("/login");
	};

	const handleSearchButtonClick = () => {
		setSearchPerformed(true);
		navigate(`/search?query=${searchQuery}`);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			setSearchPerformed(true);
			navigate(`/search?query=${searchQuery}`);
		}
	};

	const handleChange = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
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
	);
};

export default Navbar;
