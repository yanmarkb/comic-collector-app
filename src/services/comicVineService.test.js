import axios from "axios";
import { fetchComics } from "./comicVineService";

jest.mock("axios");

describe("fetchComics", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should fetch comics and return the response data", async () => {
		const mockResponse = { data: [{ id: 1, title: "Comic 1" }] };
		axios.get.mockResolvedValue(mockResponse);

		const result = await fetchComics();
		expect(result).toEqual(mockResponse.data);
		expect(axios.get).toHaveBeenCalledWith(
			"https://backend-comic-collector-app.onrender.com/api/comics"
		);
	});

	it("should handle errors and return an empty array", async () => {
		axios.get.mockRejectedValue(new Error("Network Error"));

		const result = await fetchComics();
		expect(result).toEqual([]);
		expect(axios.get).toHaveBeenCalledWith(
			"https://backend-comic-collector-app.onrender.com/api/comics"
		);
	});

	it("should return an empty array if response data is empty", async () => {
		const mockResponse = { data: [] };
		axios.get.mockResolvedValue(mockResponse);

		const result = await fetchComics();
		expect(result).toEqual(mockResponse.data);
		expect(axios.get).toHaveBeenCalledWith(
			"https://backend-comic-collector-app.onrender.com/api/comics"
		);
	});

	it("should log API response on success", async () => {
		const mockResponse = { data: [{ id: 1, title: "Comic 1" }] };
		axios.get.mockResolvedValue(mockResponse);
		console.log = jest.fn();

		await fetchComics();
		expect(console.log).toHaveBeenCalledWith(
			"API Response:",
			mockResponse.data
		);
	});

	it("should log error on failure", async () => {
		const error = new Error("Network Error");
		axios.get.mockRejectedValue(error);
		console.error = jest.fn();

		await fetchComics();
		expect(console.error).toHaveBeenCalledWith("Error fetching comics:", error);
	});
});
