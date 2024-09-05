import axios from "axios";

export const addComic = async (comic, userId) => {
	const publisherName = comic.publisher?.name || "Unknown Publisher";
	const comicData = {
		id: comic.id,
		title: comic.name || "Unknown Title",
		issue_number: comic.issue_number || "N/A",
		description: comic.description || "No description available.",
		cover_image_url: comic.image.original_url || "",
		publisher: publisherName,
		release_date: comic.cover_date || null,
		user_id: userId,
		image_link: comic.image.original_url || "",
	};

	const response = await axios.post(
		"https://backend-comic-collector-app.onrender.com/api/comics",
		comicData
	);
	return response.data;
};

const fetchComicDetails = async (comicVineId) => {
	try {
		const response = await axios.get(
			`https://backend-comic-collector-app.onrender.com/api/comics/${comicVineId}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching comic details:", error);
		return null;
	}
};

export default fetchComicDetails;
