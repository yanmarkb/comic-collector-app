import React, { useState } from "react";
import axios from "axios";

const Login = ({ setAuth }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		console.log("Input Change:", { [e.target.name]: e.target.value });
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log("Form Submitted with Data:", formData); // Debugging

		try {
			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/login",
				formData
			);

			console.log("API Response:", response.data); // Debugging

			if (response.data && response.data.token) {
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("userId", response.data.id);
				localStorage.setItem("username", response.data.username);
				localStorage.setItem("email", response.data.email);
				console.log("LocalStorage set with token, userId, username, and email"); // Log the localStorage status
				setAuth(true);
				window.location.href = "/";
			} else {
				console.error("Incomplete response data:", response.data); // Log if the response is incomplete
			}
		} catch (error) {
			console.error("Error during login:", error); // Log any errors during login
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h3>Welcome back to Comic Collector!</h3>
			<input
				type="email"
				name="email"
				id="email"
				placeholder="Email"
				onChange={handleChange}
				required
			/>
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Password"
				onChange={handleChange}
				required
			/>
			<button type="submit">Login</button>
		</form>
	);
};

export default Login;
