import React, { useState } from "react";
import axios from "axios";

const Register = ({ setAuth }) => {
	// We start by setting up the form data state, which keeps track of what the user types into the registration form.
	// The formData object has three fields: username, email, and password.
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	// The handleChange function gets called every time the user types in any of the form fields.
	// It updates the corresponding field in the formData state with whatever the user typed.
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// The handleSubmit function is triggered when the user submits the form.
	// e.preventDefault() is used to stop the default behavior of the form, which would refresh the page.
	// Instead, we handle everything right here in the function.
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent the form from refreshing the page.

		try {
			// We make an API call to the backend to register the user.
			// This sends the formData (username, email, and password) to the /register endpoint on the backend.
			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/register",
				formData
			);

			// After a successful registration, the server sends back a token.
			// We store this token in the local storage to keep the user logged in.
			localStorage.setItem("token", response.data.token);

			// setAuth(true) is called to update the authentication state, letting the app know the user is logged in.
			setAuth(true);

			// Then, we redirect the user to the homepage.
			window.location.href = "/"; // Navigates the user to the homepage after registering.
		} catch (error) {
			// If there's an error during registration, it gets logged in the console.
			console.error("Error during registration:", error);
		}
	};

	// This is the registration form. When the form is submitted, handleSubmit gets triggered.
	return (
		<form onSubmit={handleSubmit}>
			<h3>Welcome to Comic Collector!</h3> <h4>Sign up below to continue!</h4>
			{/* The input field for the username. */}
			<input
				type="text"
				name="username"
				id="username"
				placeholder="Username"
				onChange={handleChange} // handleChange gets triggered every time the user types something.
				required
			/>
			{/* The input field for the email. */}
			<input
				type="email"
				name="email"
				id="email"
				placeholder="Email"
				onChange={handleChange} // handleChange gets triggered every time the user types something.
				required
			/>
			{/* The input field for the password. */}
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Password"
				onChange={handleChange} // handleChange gets triggered every time the user types something.
				required
			/>
			{/* The button to submit the form and trigger the handleSubmit function. */}
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
