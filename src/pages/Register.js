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
				"http://localhost:5000/api/register",
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
