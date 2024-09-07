import axios from "axios"; // Import axios to handle HTTP requests.

// This is the base URL for the API that our app will interact with.
// The backend is hosted at this URL, and we use it to construct requests.
const API_URL = "https://backend-comic-collector-app.onrender.com";

// The `login` function handles user login. It takes two parameters: email and password.
// When a user submits their login information, this function sends the credentials to the backend.
export const login = async (email, password) => {
	try {
		// We're using axios here to make a POST request to the login endpoint of the API.
		// This sends the email and password in the body of the request.
		const response = await axios.post(`${API_URL}/api/login`, {
			email,
			password,
		});

		// If the response contains a token, we store it in localStorage.
		// This token is what keeps the user logged in, and we’ll use it to authenticate future requests.
		if (response.data.token) {
			localStorage.setItem("token", response.data.token); // Save the token in localStorage.
		}

		// Return the response data, which will include the token and user info.
		return response.data;
	} catch (error) {
		// If something goes wrong with the login request, the error is thrown here.
		// This could be things like invalid credentials or a network error.
		throw error;
	}
};

// The `logout` function logs the user out.
// It removes the token from localStorage, which essentially logs out the user by clearing their session.
export const logout = () => {
	localStorage.removeItem("token"); // Remove the token from localStorage.
	window.location.href = "/"; // Redirect the user to the homepage after logging out.
};
