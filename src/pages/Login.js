import React, { useState } from "react";
import axios from "axios";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:5000/api/login", formData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input tpye="email" placeholder="Email" onChange={handleChange} />
			<input
				type="password"
				name="password"
				placeholder="Password"
				onChange={handleChange}
			/>
			<button type="submit">Login</button>
		</form>
	);
};

export default Login;
