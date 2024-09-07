import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Register from "./Register";

// Mock axios
jest.mock("axios");

describe("Register Component", () => {
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

	test("renders without crashing", () => {
		render(<Register setAuth={setAuthMock} />);
	});

	test("renders input fields", () => {
		render(<Register setAuth={setAuthMock} />);
		expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
	});

	test("form submission works and calls the API", async () => {
		const mockResponse = {
			data: {
				token: "mockToken",
			},
		};
		axios.post.mockResolvedValue(mockResponse);

		render(<Register setAuth={setAuthMock} />);

		fireEvent.change(screen.getByPlaceholderText("Username"), {
			target: { value: "testuser" },
		});
		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByText("Register"));

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				"https://backend-comic-collector-app.onrender.com/api/register",
				{
					username: "testuser",
					email: "test@example.com",
					password: "password",
				}
			);
		});
	});

	test("form submission handles errors correctly", async () => {
		axios.post.mockRejectedValue(new Error("Registration failed"));

		render(<Register setAuth={setAuthMock} />);

		fireEvent.change(screen.getByPlaceholderText("Username"), {
			target: { value: "testuser" },
		});
		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByText("Register"));

		await waitFor(() => {
			expect(screen.queryByText("Registration failed")).not.toBeInTheDocument();
		});
	});

	test("form submission sets the authentication state", async () => {
		const mockResponse = {
			data: {
				token: "mockToken",
			},
		};
		axios.post.mockResolvedValue(mockResponse);

		render(<Register setAuth={setAuthMock} />);

		fireEvent.change(screen.getByPlaceholderText("Username"), {
			target: { value: "testuser" },
		});
		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: { value: "password" },
		});
		fireEvent.click(screen.getByText("Register"));

		await waitFor(() => {
			expect(localStorage.setItem).toHaveBeenCalledWith("token", "mockToken");
			expect(setAuthMock).toHaveBeenCalledWith(true);
		});
	});
});
