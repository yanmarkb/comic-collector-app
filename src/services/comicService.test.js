import axios from "axios";
import { addComic, fetchComicDetails } from "./comicService";

jest.mock("axios");

describe("comicService", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("addComic", () => {
		it("should add a comic and return the response data", async () => {
			const comic = {
				id: 1,
				name: "Test Comic",
				issue_number: "1",
				description: "Test Description",
				image: { original_url: "http://example.com/image.jpg" },
				publisher: { name: "Test Publisher" },
				cover_date: "2023-01-01",
			};
			const userId = 123;
			const mockResponse = { data: { success: true } };

			axios.post.mockResolvedValue(mockResponse);

			const result = await addComic(comic, userId);

			expect(result).toEqual(mockResponse.data);
			expect(axios.post).toHaveBeenCalledWith(
				"https://backend-comic-collector-app.onrender.com/api/comics",
				expect.objectContaining({
					id: comic.id,
					title: comic.name,
					issue_number: comic.issue_number,
					description: comic.description,
					cover_image_url: comic.image.original_url,
					publisher: comic.publisher.name,
					release_date: comic.cover_date,
					user_id: userId,
					image_link: comic.image.original_url,
				})
			);
		});

		// 	it("should handle missing comic fields", async () => {
		// 		const comic = {
		// 			id: 1,
		// 			image: {},
		// 		};
		// 		const userId = 123;
		// 		const mockResponse = { data: { success: true } };

		// 		axios.post.mockResolvedValue(mockResponse);

		// 		const result = await addComic(comic, userId);

		// 		expect(result).toEqual(mockResponse.data);
		// 		expect(axios.post).toHaveBeenCalledWith(
		// 			"https://backend-comic-collector-app.onrender.com/api/comics",
		// 			expect.objectContaining({
		// 				id: comic.id,
		// 				title: "Unknown Title",
		// 				issue_number: "N/A",
		// 				description: "No description available.",
		// 				cover_image_url: "",
		// 				publisher: "Unknown Publisher",
		// 				release_date: null,
		// 				user_id: userId,
		// 				image_link: "",
		// 			})
		// 		);
		// 	});
		// });

		// describe("fetchComicDetails", () => {
		// 	it("should fetch comic details and return the response data", async () => {
		// 		const comicVineId = 1;
		// 		const mockResponse = { data: { id: comicVineId, name: "Test Comic" } };

		// 		axios.get.mockResolvedValue(mockResponse);

		// 		const result = await fetchComicDetails(comicVineId);

		// 		expect(result).toEqual(mockResponse.data);
		// 		expect(axios.get).toHaveBeenCalledWith(
		// 			`https://backend-comic-collector-app.onrender.com/api/comics/${comicVineId}`
		// 		);
		// 	});

		// 	it("should handle errors and return null", async () => {
		// 		const comicVineId = 1;

		// 		axios.get.mockRejectedValue(new Error("Network Error"));

		// 		const result = await fetchComicDetails(comicVineId);

		// 		expect(result).toBeNull();
		// 		expect(axios.get).toHaveBeenCalledWith(
		// 			`https://backend-comic-collector-app.onrender.com/api/comics/${comicVineId}`
		// 		);
		// 	});
	});
});
