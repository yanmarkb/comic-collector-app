import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { login, logout } from "./authService";

describe("authService", () => {
	let mock;

	beforeEach(() => {
		mock = new MockAdapter(axios);
		// Mock localStorage
		Object.defineProperty(window, "localStorage", {
			value: {
				getItem: jest.fn(),
				setItem: jest.fn(),
				removeItem: jest.fn(),
				clear: jest.fn(),
			},
			writable: true,
		});
		// Mock window.location.href
		delete window.location;
		window.location = { href: jest.fn() };
	});

	afterEach(() => {
		mock.restore();
		jest.clearAllMocks();
	});

	// test("login makes a successful API call and stores the token in localStorage", async () => {
	// 	const email = "test@example.com";
	// 	const password = "password";
	// 	const mockResponse = {
	// 		data: {
	// 			token: "mockToken",
	// 		},
	// 	};

	// 	mock
	// 		.onPost("https://backend-comic-collector-app.onrender.com/api/login")
	// 		.reply(200, mockResponse);

	// 	const response = await login(email, password);

	// 	// Expect the entire response object
	// 	expect(response).toEqual(mockResponse);
	// 	expect(localStorage.setItem).toHaveBeenCalledWith("token", "mockToken");
	// });

	test("login throws an error when the API call fails", async () => {
		const email = "test@example.com";
		const password = "password";

		mock
			.onPost("https://backend-comic-collector-app.onrender.com/api/login")
			.reply(500);

		await expect(login(email, password)).rejects.toThrow();
	});

	test("logout removes the token from localStorage", () => {
		logout();
		expect(localStorage.removeItem).toHaveBeenCalledWith("token");
	});

	test("logout redirects to the home page", () => {
		logout();
		expect(window.location.href).toBe("/");
	});
});
