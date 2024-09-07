import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = ({ userId }) => {
	// `profile` stores the user profile data fetched from the backend.
	// `isEditingPassword` tracks whether the user is in the process of editing their password.
	// `oldPassword`, `newPassword`, and `confirmPassword` store the values entered in the password fields.
	// `message` holds any feedback messages for the user (like success or error messages).
	const [profile, setProfile] = useState({});
	const [isEditingPassword, setIsEditingPassword] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");

	// `username` and `email` are fetched from localStorage. This assumes the user data is stored locally when they log in.
	const username = localStorage.getItem("username");
	const email = localStorage.getItem("email");

	// This effect fetches the user's profile data from the backend when the component loads or the `userId` changes.
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				// The profile data is fetched by hitting the backend API, passing in the `userId` from the props.
				const response = await axios.get(
					`https://backend-comic-collector-app.onrender.com/api/user/${userId}`
				);
				// The fetched profile data is stored in the `profile` state.
				setProfile(response.data);
			} catch (error) {
				// If there’s an error while fetching, it logs it to the console.
				console.error("Error fetching profile:", error);
			}
		};

		// Call the function to fetch the profile when the component is mounted.
		fetchProfile();
	}, [userId]);

	// This function handles the password change logic.
	const handlePasswordChange = async () => {
		// If the new password and confirm password don't match, we stop and show an error message.
		if (newPassword !== confirmPassword) {
			setMessage("New passwords do not match");
			return; // No need to proceed further if passwords don't match.
		}

		try {
			// Makes a PUT request to change the user's password. The `userId` is used to identify the user, and the `oldPassword` and `newPassword` are sent in the request body.
			const response = await axios.put(
				`https://backend-comic-collector-app.onrender.com/api/user/${userId}/change-password`,
				{ oldPassword, newPassword }
			);
			// If the password change is successful, the server's message is shown.
			setMessage(response.data.message);
			// Reset the password form and stop showing the editing state.
			setIsEditingPassword(false);
			setOldPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			// If there's an error changing the password, log it and show an error message to the user.
			console.error("Error changing password:", error);
			setMessage("Error changing password. Please try again.");
		}
	};

	return (
		<div className="profile-container">
			<h1>Profile</h1>
			{/* Display the username and email fetched from localStorage */}
			<p>
				<strong>Username:</strong> {username}
			</p>
			<p>
				<strong>Email:</strong> {email}
			</p>

			{/* Button to toggle the password editing form on and off */}
			<button
				onClick={() => setIsEditingPassword(!isEditingPassword)}
				className="change-password-button">
				Change Password
			</button>

			{/* Show the password editing form if `isEditingPassword` is true */}
			{isEditingPassword && (
				<div className="password-change-form">
					<label>
						Old Password:
						{/* Input field for the old password */}
						<input
							type="password"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
					</label>
					<label>
						New Password:
						{/* Input field for the new password */}
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</label>
					<label>
						Confirm New Password:
						{/* Input field for confirming the new password */}
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</label>
					{/* Button to save the new password and trigger the `handlePasswordChange` function */}
					<button onClick={handlePasswordChange} className="save-button">
						Save
					</button>
				</div>
			)}

			{/* If there’s a message (error or success), display it here */}
			{message && <p className="message">{message}</p>}
		</div>
	);
};

export default Profile;
