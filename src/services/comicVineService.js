import axios from "axios";

const fetchComics = async () => {
	try {
		const response = await axios.get(
			"https://backend-comic-collector-app.onrender.com/api/comics"
		);
		console.log("API Response:", response.data); // Debugging
		return response.data;
	} catch (error) {
		console.error("Error fetching comics:", error);
		return [];
	}
};

export { fetchComics };
