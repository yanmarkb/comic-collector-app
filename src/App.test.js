import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./App";

describe("App Component", () => {
	test("renders Home component by default", () => {
		render(<AppContent />);
		expect(screen.getByText(/Home/i)).toBeInTheDocument();
	});

	// test("renders Register component when navigating to /register", () => {
	// 	window.history.pushState({}, "Register Page", "/register");
	// 	render(<AppContent />);
	// 	expect(screen.getByText(/Register/i)).toBeInTheDocument();
	// });

	// test("renders Login component when navigating to /login", () => {
	// 	window.history.pushState({}, "Login Page", "/login");
	// 	render(<AppContent />);
	// 	expect(screen.getByText(/Login/i)).toBeInTheDocument();
	// });

	// test("renders Profile component when navigating to /profile", () => {
	// 	window.history.pushState({}, "Profile Page", "/profile");
	// 	render(<AppContent />);
	// 	expect(screen.getByText(/Profile/i)).toBeInTheDocument();
	// });

	// test("renders Collection component when navigating to /collection", () => {
	// 	window.history.pushState({}, "Collection Page", "/collection");
	// 	render(<AppContent />);
	// 	expect(screen.getByText(/Collection/i)).toBeInTheDocument();
	// });
});
