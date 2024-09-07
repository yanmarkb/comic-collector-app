import axios from "axios";

// The fetchComics function is responsible for fetching a list of comics from the API.
// This is an asynchronous function, which means it performs the API call in the background without freezing the rest of the app.
const fetchComics = async () => {
	try {
		// The axios.get method is used here to make a GET request to the API endpoint that provides the list of comics.
		// This is the URL where the API call is made. When you call this function, it's going to hit this specific endpoint to get the data.
		const response = await axios.get(
			"https://backend-comic-collector-app.onrender.com/api/comics"
		);

		// Here, we're logging the data that comes back from the API so we can see what we're working with.
		// This is useful for debugging to check if we're getting the expected results.
		console.log("API Response:", response.data);

		// After the API call is successful, we return the comic data back to wherever this function is called.
		// So this line makes the comic data available for further use in the app.
		return response.data;
	} catch (error) {
		// If there’s any issue (like the API is down or the URL is wrong), we catch the error and log it to the console.
		// This helps in debugging why the API call failed.
		console.error("Error fetching comics:", error);

		// Returning an empty array if something goes wrong so that the app doesn’t break.
		// This ensures we handle errors gracefully by returning an empty result instead of crashing.
		return [];
	}
};

export { fetchComics };
