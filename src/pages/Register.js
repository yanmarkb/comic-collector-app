import React, { useState } from "react";
import axios from "axios";

const Register = () => {
	const [formData, setFormData] = useState({
		username: "",
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
				"http://localhost:5000/api/register",
				formData
			);
			localStorage.setItem("token", response.data.token);
			window.location.href = "/profile"; // Redirect to the protected page
		} catch (error) {
			if (error.response) {
				console.error("Error during registration:", error.response.data);
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
				type="text"
				name="username"
				placeholder="Username"
				onChange={handleChange}
			/>
			<input
				type="email"
				name="email"
				placeholder="Email"
				onChange={handleChange}
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				onChange={handleChange}
			/>
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
