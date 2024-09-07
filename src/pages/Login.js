import React, { useState } from "react";
import axios from "axios";

const Login = ({ setAuth }) => {
	// The formData state stores the email and password input by the user.
	// We initialize it as an object with two empty strings.
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// handleChange is responsible for updating the formData state whenever the user types in the input fields.
	// It takes the event (e) as the parameter to access the name and value of the input that triggered the change.
	// We log the change to debug and see which input is being updated.
	const handleChange = (e) => {
		console.log("Input Change:", { [e.target.name]: e.target.value });
		// We use the spread operator to keep the existing values in formData and only update the field that changed.
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// handleSubmit takes care of what happens when the form is submitted.
	// It prevents the default form behavior (which would reload the page) and sends a POST request to the backend.
	// We also log the formData to make sure we're sending the correct data.
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevents the default form submit behavior.
		console.log("Form Submitted with Data:", formData); // Logging form data for debugging.

		try {
			// Here we make an async POST request to the backend using axios.
			// We send the formData (email and password) as the body of the request.
			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/login",
				formData
			);

			// We log the API response to check if it’s coming through as expected.
			console.log("API Response:", response.data);

			// This next part checks if we got a valid token in the response.
			// If we do, we store the token, userId, username, and email in localStorage so the user stays logged in.
			// We also log the localStorage status to verify the values are being saved correctly.
			if (response.data && response.data.token) {
				// Store the token and user info in localStorage for persistent authentication.
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("userId", response.data.id);
				localStorage.setItem("username", response.data.username);
				localStorage.setItem("email", response.data.email);
				console.log("LocalStorage set with token, userId, username, and email");

				// Call setAuth(true) to update the parent component's state and mark the user as authenticated.
				setAuth(true);
				// Redirect the user to the homepage after successful login.
				window.location.href = "/";
			} else {
				// If the response data is incomplete (no token or missing info), log an error.
				console.error("Incomplete response data:", response.data);
			}
		} catch (error) {
			// If something goes wrong during the login process (e.g., incorrect credentials, server error), we catch it here and log the error.
			console.error("Error during login:", error);
		}
	};

	// The return block renders the login form. It has two input fields (email and password) and a submit button.
	// We bind the handleSubmit function to the form’s onSubmit event and handleChange to the input fields’ onChange event.
	return (
		<form onSubmit={handleSubmit}>
			<h3>Welcome back to Comic Collector!</h3>
			{/* Input for the user’s email */}
			<input
				type="email"
				name="email"
				id="email"
				placeholder="Email"
				onChange={handleChange} // Calls handleChange when the user types in this input.
				required // Ensures the user can’t submit the form without entering an email.
			/>
			{/* Input for the user’s password */}
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Password"
				onChange={handleChange} // Calls handleChange when the user types in this input.
				required // Ensures the user can’t submit the form without entering a password.
			/>
			{/* The button submits the form, which triggers handleSubmit */}
			<button type="submit">Login</button>
		</form>
	);
};

export default Login;
