import axios from "axios";

export const fetchImageLink = async (comicId) => {
	try {
		const response = await axios.get(
			`https://comicvine.gamespot.com/api/issue/${comicId}/`,
			{
				params: {
					api_key: process.env.REACT_APP_COMICVINE_API_KEY,
					format: "json",
				},
			}
		);
		const imageLink = response.data.results.image.original_url;
		return imageLink;
	} catch (error) {
		console.error("Error fetching image link:", error);
		return null;
	}
};
