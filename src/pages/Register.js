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
		try {
			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/register",
				formData
			);
			localStorage.setItem("token", response.data.token);
			setAuth(true);
			window.location.href = "/";
		} catch (error) {
			console.error("Error during registration:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h3>Welcome to Comic Collector!</h3>{" "}
			<h4>Sign up to below to conitnue!</h4>
			<input
				type="text"
				name="username"
				id="username"
				placeholder="Username"
				onChange={handleChange}
				required
			/>
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
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
