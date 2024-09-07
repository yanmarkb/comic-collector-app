import axios from "axios";

// This function fetches the image link for a specific comic. It takes one parameter: comicId.
// comicId is the unique identifier for the comic we want to fetch the image for.
export const fetchImageLink = async (comicId) => {
	try {
		// The next part makes an asynchronous call to the Comic Vine API using axios.get.
		// We're building the URL dynamically by adding the comicId to the base API endpoint.
		// The API request also needs two parameters: the API key and the response format.
		// The API key is pulled from the environment variables, and format is set to 'json'.
		const response = await axios.get(
			`https://comicvine.gamespot.com/api/issue/${comicId}/`,
			{
				params: {
					api_key: process.env.REACT_APP_COMICVINE_API_KEY,
					format: "json", // We want the response in JSON format.
				},
			}
		);

		// Now, we get the image link from the response. The image URL is found in the results object.
		const imageLink = response.data.results.image.original_url;

		// Finally, return the image link so we can use it elsewhere in the app.
		return imageLink;
	} catch (error) {
		// If something goes wrong during the API call (like a bad comicId or a network issue),
		// this block will handle it and log the error to the console.
		console.error("Error fetching image link:", error);

		// We return null if there’s an error so that the calling code knows something went wrong.
		return null;
	}
};
