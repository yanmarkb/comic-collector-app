import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading Component", () => {
	test("renders without crashing", () => {
		render(<Loading />);
	});

	test("displays loading text", () => {
		render(<Loading />);
		expect(
			screen.getByText((content, element) => {
				return (
					element.tagName.toLowerCase() === "p" && /One Second/.test(content)
				);
			})
		).toBeInTheDocument();
	});

	test("displays the correct number of dots", () => {
		render(<Loading />);
		const dots = screen.getAllByText(".", { exact: false });
		expect(dots.length).toBe(3);
	});

	test("loading container has the correct class", () => {
		render(<Loading />);
		const container = screen
			.getByText((content, element) => {
				return (
					element.tagName.toLowerCase() === "p" && /One Second/.test(content)
				);
			})
			.closest("div");
		expect(container).toHaveClass("loading-container");
	});

	test("dots have the correct class", () => {
		render(<Loading />);
		const dots = screen.getAllByText(".", { exact: false });
		dots.forEach((dot) => {
			expect(dot).toHaveClass("dot");
		});
	});
});
