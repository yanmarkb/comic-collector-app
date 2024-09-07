import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import AddComic from "./AddComic";
import "@testing-library/jest-dom";

const mockAxios = new MockAdapter(axios);

describe("AddComic Component", () => {
	beforeEach(() => {
		mockAxios.reset();
	});

	test("renders initial component", () => {
		render(<AddComic userId="1" />);
		expect(screen.getByPlaceholderText("Comic Name")).toBeInTheDocument();
		expect(screen.getByText("Search")).toBeInTheDocument();
	});

	// test("searches for comics and displays results", async () => {
	// 	const comics = [
	// 		{
	// 			id: 1,
	// 			name: "Comic 1",
	// 			image: { original_url: "http://example.com/comic1.jpg" },
	// 		},
	// 		{
	// 			id: 2,
	// 			name: "Comic 2",
	// 			image: { original_url: "http://example.com/comic2.jpg" },
	// 		},
	// 	];

	// 	mockAxios
	// 		.onGet(
	// 			"https://backend-comic-collector-app.onrender.com/api/comics/search/Comic?page=1"
	// 		)
	// 		.reply(200, comics);

	// 	render(<AddComic userId="1" />);

	// 	const searchInput = screen.getByPlaceholderText("Comic Name");
	// 	const searchButton = screen.getByText("Search");

	// 	userEvent.type(searchInput, "Comic");
	// 	userEvent.click(searchButton);

	// 	await waitFor(() => {
	// 		console.log("Comics:", screen.getByText("Comic 1").textContent);
	// 		expect(screen.getByText("Comic 1")).toBeInTheDocument();
	// 		expect(screen.getByText("Comic 2")).toBeInTheDocument();
	// 	});
	// });

	// test("adds a comic to the collection", async () => {
	// 	const comic = {
	// 		id: 1,
	// 		name: "Comic 1",
	// 		image: { original_url: "http://example.com/comic1.jpg" },
	// 	};

	// 	mockAxios
	// 		.onGet(
	// 			"https://backend-comic-collector-app.onrender.com/api/comics/search/Comic?page=1"
	// 		)
	// 		.reply(200, [comic]);

	// 	mockAxios
	// 		.onPost("https://backend-comic-collector-app.onrender.com/api/comics")
	// 		.reply(200, { message: "Comic added successfully" });

	// 	render(<AddComic userId="1" />);

	// 	const searchInput = screen.getByPlaceholderText("Comic Name");
	// 	const searchButton = screen.getByText("Search");

	// 	userEvent.type(searchInput, "Comic");
	// 	userEvent.click(searchButton);

	// 	await waitFor(() => {
	// 		console.log("Comic 1:", screen.getByText("Comic 1").textContent);
	// 		expect(screen.getByText("Comic 1")).toBeInTheDocument();
	// 	});

	// 	const addButton = screen.getByText("Add to Collection");
	// 	userEvent.click(addButton);

	// 	await waitFor(() => {
	// 		expect(mockAxios.history.post.length).toBe(1);
	// 	});
	// });

	// test("shows more comics on pagination", async () => {
	// 	const comicsPage1 = [
	// 		{
	// 			id: 1,
	// 			name: "Comic 1",
	// 			image: { original_url: "http://example.com/comic1.jpg" },
	// 		},
	// 	];

	// 	const comicsPage2 = [
	// 		{
	// 			id: 2,
	// 			name: "Comic 2",
	// 			image: { original_url: "http://example.com/comic2.jpg" },
	// 		},
	// 	];

	// 	mockAxios
	// 		.onGet(
	// 			"https://backend-comic-collector-app.onrender.com/api/comics/search/Comic?page=1"
	// 		)
	// 		.reply(200, comicsPage1);

	// 	mockAxios
	// 		.onGet(
	// 			"https://backend-comic-collector-app.onrender.com/api/comics/search/Comic?page=2"
	// 		)
	// 		.reply(200, comicsPage2);

	// 	render(<AddComic userId="1" />);

	// 	const searchInput = screen.getByPlaceholderText("Comic Name");
	// 	const searchButton = screen.getByText("Search");

	// 	userEvent.type(searchInput, "Comic");
	// 	userEvent.click(searchButton);

	// 	await waitFor(() => {
	// 		console.log("Comic 1:", screen.getByText("Comic 1").textContent);
	// 		expect(screen.getByText("Comic 1")).toBeInTheDocument();
	// 	});

	// 	const showMoreButton = screen.getByText("Show More...");
	// 	userEvent.click(showMoreButton);

	// 	await waitFor(() => {
	// 		console.log("Comic 2:", screen.getByText("Comic 2").textContent);
	// 		expect(screen.getByText("Comic 2")).toBeInTheDocument();
	// 	});
	// });
});
