import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Home from "./Home";
import { BrowserRouter as Router } from "react-router-dom";

// Mock axios
jest.mock("axios");

const mockComics = [
	{
		id: 1,
		name: "Mock Comic 1",
		image: { original_url: "http://example.com/comic1.jpg" },
	},
	{
		id: 2,
		name: "Mock Comic 2",
		image: { original_url: "http://example.com/comic2.jpg" },
	},
];

beforeEach(() => {
	axios.get.mockResolvedValue({ data: mockComics });
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("Home Component", () => {
	test("renders without crashing", () => {
		render(
			<Router>
				<Home userId={1} />
			</Router>
		);
	});

	test("displays loading component initially", () => {
		render(
			<Router>
				<Home userId={1} />
			</Router>
		);
		expect(
			screen.getByText((content, element) => {
				return (
					element.tagName.toLowerCase() === "p" && /One Second/.test(content)
				);
			})
		).toBeInTheDocument();
	});

	// test("fetches and displays comics", async () => {
	// 	render(
	// 		<Router>
	// 			<Home userId={1} />
	// 		</Router>
	// 	);
	// 	await waitFor(() => {
	// 		const comics = screen.getAllByAltText("Mock Comic 1");
	// 		expect(comics.length).toBeGreaterThan(0);
	// 	});
	// 	expect(screen.getByAltText("Mock Comic 2")).toBeInTheDocument();
	// });

	// test("toggles between login and register", () => {
	// 	render(
	// 		<Router>
	// 			<Home userId={1} />
	// 		</Router>
	// 	);
	// 	const toggleButton = screen.getByText("Already a user? Log in here");
	// 	fireEvent.click(toggleButton);
	// 	expect(screen.getByText("Not a user? Register here")).toBeInTheDocument();
	// });

	// test("search functionality works", async () => {
	// 	render(
	// 		<Router>
	// 			<Home userId={1} />
	// 		</Router>
	// 	);
	// 	const searchInput = screen.getByPlaceholderText("Comic Name");
	// 	fireEvent.change(searchInput, { target: { value: "Mock Comic" } });
	// 	fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
	// 	await waitFor(() => screen.getByAltText("Mock Comic 1"));
	// 	expect(screen.getByAltText("Mock Comic 1")).toBeInTheDocument();
	// });
});
