import React, { useState } from "react";
import axios from "axios";

const Login = ({ setAuth }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/api/login",
				formData
			);
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("userId", response.data.id); // Save userId in localStorage
			setAuth(true);
			window.location.href = "/profile";
		} catch (error) {
			if (error.response) {
				console.error("Error during login:", error.response.data);
			} else if (error.request) {
				console.error("No response received:", error.request);
			} else {
				console.error("Error setting up request:", error.message);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				name="email"
				placeholder="Email"
				onChange={handleChange}
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				onChange={handleChange}
				required
			/>
			<button type="submit">Login</button>
		</form>
	);
};

export default Login;
