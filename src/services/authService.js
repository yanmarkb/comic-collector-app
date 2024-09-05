import axios from "axios";

const API_URL = "https://backend-comic-collector-app.onrender.com";

export const login = async (email, password) => {
	try {
		const response = await axios.post(`${API_URL}/api/login`, {
			email,
			password,
		});
		if (response.data.token) {
			localStorage.setItem("token", response.data.token);
		}
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const logout = () => {
	localStorage.removeItem("token");
	window.location.href = "/";
};
