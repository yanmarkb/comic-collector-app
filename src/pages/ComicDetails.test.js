import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ComicDetails from "./ComicDetails";

const mockComic = {
	name: "Mock Comic",
	issue_number: "1",
	publisher: { name: "Mock Publisher" },
	cover_date: "2023-01-01",
	description: "<p>Mock <strong>Description</strong></p>",
	character_credits: [{ name: "Character 1" }, { name: "Character 2" }],
	story_arc_credits: [{ name: "Arc 1" }],
	team_credits: [{ name: "Team 1" }],
	location_credits: [{ name: "Location 1" }],
	concept_credits: [{ name: "Concept 1" }],
	image: { original_url: "http://example.com/comic.jpg" },
};

describe("ComicDetails Component", () => {
	test("renders without crashing", () => {
		render(<ComicDetails comic={mockComic} onClose={jest.fn()} />);
	});

	test('displays "No comic details available" when no comic is provided', () => {
		render(<ComicDetails comic={null} onClose={jest.fn()} />);
		expect(screen.getByText("No comic details available.")).toBeInTheDocument();
	});

	test("displays comic details when a comic is provided", () => {
		// Your test implementation here
	});
});
