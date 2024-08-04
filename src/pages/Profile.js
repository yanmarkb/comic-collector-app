import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = ({ userId }) => {
	const [profile, setProfile] = useState({});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/user/${userId}"
				);
				setProfile(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchProfile();
	}, []);

	return (
		<div>
			<h1>{profile.username}</h1>
			<p>{profile.email}</p>
		</div>
	);
};

export default Profile;
