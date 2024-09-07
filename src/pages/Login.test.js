import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "./Login";

jest.mock("axios");

const setAuthMock = jest.fn();

beforeEach(() => {
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
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("Login Component", () => {
	test("renders without crashing", () => {
		render(<Login setAuth={setAuthMock} />);
	});

	test("renders input fields", () => {
		render(<Login setAuth={setAuthMock} />);
		expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
	});

	test("form submission works and calls the API", async () => {
		const mockResponse = {
			data: {
				token: "mockToken",
				id: "mockId",
				username: "mockUsername",
				email: "mockEmail",
			},
		};
		axios.post.mockResolvedValue(mockResponse);

		render(<Login setAuth={setAuthMock} />);

		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByText("Login"));

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				"https://backend-comic-collector-app.onrender.com/api/login",
				{
					email: "test@example.com",
					password: "password",
				}
			);
		});
	});

	test("form submission handles errors correctly", async () => {
		axios.post.mockRejectedValue(new Error("Login failed"));

		render(<Login setAuth={setAuthMock} />);

		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByText("Login"));

		await waitFor(() => {
			expect(screen.queryByText("Login failed")).not.toBeInTheDocument();
		});
	});

	test("form submission sets the authentication state", async () => {
		const mockResponse = {
			data: {
				token: "mockToken",
				id: "mockId",
				username: "mockUsername",
				email: "mockEmail",
			},
		};
		axios.post.mockResolvedValue(mockResponse);

		render(<Login setAuth={setAuthMock} />);

		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByText("Login"));

		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith("token", "mockToken");
			expect(localStorage.setItem).toHaveBeenCalledWith("userId", "mockId");
			expect(localStorage.setItem).toHaveBeenCalledWith(
				"username",
				"mockUsername"
			);
			expect(localStorage.setItem).toHaveBeenCalledWith("email", "mockEmail");
			expect(setAuthMock).toHaveBeenCalledWith(true);
		});
	});
});
