import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Collection from "./Collection";

// Mock axios
jest.mock("axios");

const mockComics = [
	{
		comic_id: 1,
		collection_name: "Comic 1",
		collection_number: "1",
		library_name: "Library 1",
		cover_image_url: "http://example.com/comic1.jpg",
	},
];

const mockLibraries = [
	{
		id: 1,
		library_name: "Library 1",
	},
];

beforeEach(() => {
	axios.get.mockImplementation((url) => {
		if (url.includes("/api/collection/")) {
			return Promise.resolve({ data: mockComics });
		}
		if (url.includes("/api/libraries/")) {
			return Promise.resolve({ data: mockLibraries });
		}
		return Promise.reject(new Error("not found"));
	});
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("Collection Page", () => {
	test("renders collection title", async () => {
		render(<Collection />);
		expect(screen.getByText("My Collection")).toBeInTheDocument();
	});

	test("fetches and displays comics", async () => {
		render(<Collection />);
		await waitFor(() => screen.getByText("Comic 1"));
		expect(screen.getByText("Comic 1")).toBeInTheDocument();
		expect(screen.getByText("Issue #1")).toBeInTheDocument();
	});

	test("fetches and displays libraries", async () => {
		render(<Collection />);
		await waitFor(() => screen.getByText("Library 1"));
		expect(screen.getByText("Library 1")).toBeInTheDocument();
	});

	test("opens and closes create library modal", async () => {
		render(<Collection />);
		fireEvent.click(screen.getByRole("button", { name: /add library/i }));
		expect(screen.getByText("Create New Library")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Cancel"));
		expect(screen.queryByText("Create New Library")).not.toBeInTheDocument();
	});

	test("opens and closes edit comic modal", async () => {
		render(<Collection />);
		await waitFor(() => screen.getByText("Comic 1"));
		fireEvent.click(screen.getByRole("button", { name: /edit/i }));
		expect(screen.getByText("Edit Comic")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Cancel"));
		expect(screen.queryByText("Edit Comic")).not.toBeInTheDocument();
	});
});
