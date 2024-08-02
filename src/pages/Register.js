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
			await axios.post("http://localhost:5000/api/register", formData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="username"
				onChange={handleChange}
				placeholder="Username"
			/>
			<input
				type="email"
				name="email"
				onChange={handleChange}
				placeholder="Email"
			/>
			<input
				type="password"
				name="password"
				onChange={handleChange}
				placeholder="Password"
			/>
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
