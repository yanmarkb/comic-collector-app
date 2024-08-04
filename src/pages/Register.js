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
			alert("Registration successful!");
			console.log(response.data); // You can use this data to set state or handle post-registration actions
		} catch (error) {
			console.error(
				"Error during registration:",
				error.response ? error.response.data : error.message
			);
			alert(
				"Registration failed: " +
					(error.response ? error.response.data.error : error.message)
			);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="username"
				placeholder="Username"
				value={formData.username}
				onChange={handleChange}
				required
			/>
			<input
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
				required
			/>
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
