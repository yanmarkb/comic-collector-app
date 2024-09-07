import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Profile from "./Profile";

// Mock axios
jest.mock("axios");

describe("Profile Component", () => {
	const userId = "mockUserId";

	beforeEach(() => {
		// Mock localStorage
		Object.defineProperty(window, "localStorage", {
			value: {
				getItem: jest.fn((key) => {
					if (key === "username") return "mockUsername";
					if (key === "email") return "mockEmail";
					return null;
				}),
				setItem: jest.fn(),
				removeItem: jest.fn(),
				clear: jest.fn(),
			},
			writable: true,
		});
	});

	test("renders without crashing", () => {
		render(<Profile userId={userId} />);
	});

	test("displays username and email correctly", () => {
		render(<Profile userId={userId} />);
		expect(screen.getByText("mockUsername")).toBeInTheDocument();
		expect(screen.getByText("mockEmail")).toBeInTheDocument();
	});

	test("displays password change form when button is clicked", () => {
		render(<Profile userId={userId} />);
		fireEvent.click(screen.getByText("Change Password"));
		expect(screen.getByLabelText("Old Password:")).toBeInTheDocument();
		expect(screen.getByLabelText("New Password:")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm New Password:")).toBeInTheDocument();
	});

	test("handles input changes in password change form", () => {
		render(<Profile userId={userId} />);
		fireEvent.click(screen.getByText("Change Password"));

		const oldPasswordInput = screen.getByLabelText("Old Password:");
		const newPasswordInput = screen.getByLabelText("New Password:");
		const confirmPasswordInput = screen.getByLabelText("Confirm New Password:");

		fireEvent.change(oldPasswordInput, { target: { value: "oldPassword" } });
		fireEvent.change(newPasswordInput, { target: { value: "newPassword" } });
		fireEvent.change(confirmPasswordInput, {
			target: { value: "newPassword" },
		});

		expect(oldPasswordInput.value).toBe("oldPassword");
		expect(newPasswordInput.value).toBe("newPassword");
		expect(confirmPasswordInput.value).toBe("newPassword");
	});

	test("displays error message when passwords do not match", async () => {
		render(<Profile userId={userId} />);
		fireEvent.click(screen.getByText("Change Password"));

		const newPasswordInput = screen.getByLabelText("New Password:");
		const confirmPasswordInput = screen.getByLabelText("Confirm New Password:");
		const saveButton = screen.getByText("Save");

		fireEvent.change(newPasswordInput, { target: { value: "newPassword1" } });
		fireEvent.change(confirmPasswordInput, {
			target: { value: "newPassword2" },
		});
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(
				screen.getByText("New passwords do not match")
			).toBeInTheDocument();
		});
	});
});
