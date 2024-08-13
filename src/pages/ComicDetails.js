import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ComicDetails = () => {
	const { id } = useParams(); // Get the comic ID from the URL
	const [comic, setComic] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchComic = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/comic/${id}`
				);
				setComic(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching comic details:", error);
				setError("Failed to fetch comic details.");
				setLoading(false);
			}
		};

		fetchComic();
	}, [id]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (!comic) {
		return <div>No comic found.</div>;
	}

	return (
		<div className="comic-details-container">
			<h1>{comic.name}</h1>
			<img
				src={comic.image.original_url}
				alt={comic.name}
				className="comic-details-cover"
			/>
			<p>
				<strong>Issue Number:</strong> {comic.issue_number}
			</p>
			<p>
				<strong>Publisher:</strong> {comic.publisher?.name}
			</p>
			<p>
				<strong>Release Date:</strong> {comic.cover_date}
			</p>
			<p>{comic.description}</p>
		</div>
	);
};

export default ComicDetails;
