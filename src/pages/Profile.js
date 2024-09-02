import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = ({ userId }) => {
	const [profile, setProfile] = useState({});
	const [isEditingPassword, setIsEditingPassword] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");

	const username = localStorage.getItem("username");
	const email = localStorage.getItem("email");

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/user/${userId}`
				);
				setProfile(response.data);
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};

		fetchProfile();
	}, [userId]);

	const handlePasswordChange = async () => {
		if (newPassword !== confirmPassword) {
			setMessage("New passwords do not match");
			return;
		}

		try {
			const response = await axios.put(
				`http://localhost:5000/api/user/${userId}/change-password`,
				{ oldPassword, newPassword }
			);
			setMessage(response.data.message);
			setIsEditingPassword(false);
			setOldPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			console.error("Error changing password:", error);
			setMessage("Error changing password. Please try again.");
		}
	};

	return (
		<div className="profile-container">
			<h1>Profile</h1>
			<p>
				<strong>Username:</strong> {username}
			</p>
			<p>
				<strong>Email:</strong> {email}
			</p>

			<button
				onClick={() => setIsEditingPassword(!isEditingPassword)}
				className="change-password-button">
				Change Password
			</button>

			{isEditingPassword && (
				<div className="password-change-form">
					<label>
						Old Password:
						<input
							type="password"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
					</label>
					<label>
						New Password:
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</label>
					<label>
						Confirm New Password:
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</label>
					<button onClick={handlePasswordChange} className="save-button">
						Save
					</button>
				</div>
			)}

			{message && <p className="message">{message}</p>}
		</div>
	);
};

export default Profile;
