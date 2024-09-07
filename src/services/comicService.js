import axios from "axios";

// The addComic function is responsible for adding a comic to the user's collection.
// It takes two parameters:
// 1. `comic`: This is the comic object that contains all the details about the comic.
// 2. `userId`: This is the ID of the user who is adding the comic to their collection.
export const addComic = async (comic, userId) => {
	// This line checks if the comic has a publisher. If not, it sets the publisher name to "Unknown Publisher".
	const publisherName = comic.publisher?.name || "Unknown Publisher";

	// Now we create an object that contains all the necessary comic data we want to send to the server.
	// If any of the comic fields (like title or issue number) are missing, it falls back to default values like "Unknown Title" or "N/A".
	const comicData = {
		id: comic.id, // Comic's unique ID.
		title: comic.name || "Unknown Title", // Comic title, defaults to "Unknown Title" if not provided.
		issue_number: comic.issue_number || "N/A", // Issue number, or "N/A" if it's not available.
		description: comic.description || "No description available.", // Comic description or a fallback message.
		cover_image_url: comic.image.original_url || "", // URL for the comic's cover image.
		publisher: publisherName, // The comic's publisher, or "Unknown Publisher" if not available.
		release_date: comic.cover_date || null, // Comic's release date, or null if it's missing.
		user_id: userId, // The ID of the user who's adding the comic.
		image_link: comic.image.original_url || "", // Fallback for the cover image link.
	};

	// This is where we make the actual API request to add the comic to the server.
	// The comicData object we built is sent to our API's `/comics` endpoint.
	const response = await axios.post(
		"https://backend-comic-collector-app.onrender.com/api/comics",
		comicData
	);

	// The response from the server is returned, which likely contains some confirmation data or the comic that was added.
	return response.data;
};

// The fetchComicDetails function handles fetching details of a specific comic using its ComicVine ID.
// It takes `comicVineId` as a parameter, which is the unique identifier for the comic in the ComicVine database.
const fetchComicDetails = async (comicVineId) => {
	try {
		// Here's the API call to get detailed information about the comic.
		// We use the ComicVine ID to request the specific comic details from the backend.
		const response = await axios.get(
			`https://backend-comic-collector-app.onrender.com/api/comics/${comicVineId}`
		);

		// If the request is successful, it returns the comic data from the API.
		return response.data;
	} catch (error) {
		// In case of any errors during the API request, we catch the error and log it.
		console.error("Error fetching comic details:", error);

		// Return null if the comic details couldn't be fetched due to an error.
		return null;
	}
};

// We export fetchComicDetails so that other parts of the app can use this function to retrieve comic details.
export default fetchComicDetails;
