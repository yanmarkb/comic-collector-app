import React, { useState } from "react";
import axios from "axios";

const Register = ({ setAuth }) => {
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
		console.log("Submitting form data:", formData);
		try {
			const response = await axios.post(
				"http://localhost:5000/api/register",
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// Store the token in localStorage
			localStorage.setItem("token", response.data.token);
			// Set authentication state to true
			setAuth(true);
			// Redirect to profile page
			window.location.href = "/profile";
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
				required
			/>
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
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
