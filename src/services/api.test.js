import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchImageLink } from "./api";

describe("fetchImageLink", () => {
	let mock;

	beforeEach(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.restore();
	});

	test("returns the correct image link on a successful API call", async () => {
		const comicId = "12345";
		const mockResponse = {
			results: {
				image: {
					original_url: "https://example.com/image.jpg",
				},
			},
		};

		mock
			.onGet(`https://comicvine.gamespot.com/api/issue/${comicId}/`)
			.reply(200, mockResponse);

		const imageLink = await fetchImageLink(comicId);
		expect(imageLink).toBe("https://example.com/image.jpg");
	});

	test("returns null when the API call fails", async () => {
		const comicId = "12345";

		mock
			.onGet(`https://comicvine.gamespot.com/api/issue/${comicId}/`)
			.reply(500);

		const imageLink = await fetchImageLink(comicId);
		expect(imageLink).toBeNull();
	});

	test("handles missing comicId correctly", async () => {
		const comicId = "";

		mock
			.onGet(`https://comicvine.gamespot.com/api/issue/${comicId}/`)
			.reply(404);

		const imageLink = await fetchImageLink(comicId);
		expect(imageLink).toBeNull();
	});
});
