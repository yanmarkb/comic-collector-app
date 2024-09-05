import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WelcomePopup.css";

const WelcomePopup = ({ onClose, onComicClick }) => {
	const [randomComic, setRandomComic] = useState(null);

	useEffect(() => {
		const fetchRandomComic = async () => {
			try {
				const response = await axios.get(
					"https://backend-comic-collector-app.onrender.com/api/comics/random"
				);
				setRandomComic(response.data);
			} catch (error) {
				console.error("Error fetching random comic:", error);
			}
		};

		fetchRandomComic();
	}, []);

	return (
		<div className="welcome-popup">
			<div className="welcome-popup-content">
				<h2>Welcome to Collector's Corner</h2>
				<p>Start searching above!</p>
				{randomComic && randomComic.image?.original_url ? (
					<div
						className="random-comic-thumbnail"
						onClick={() => onComicClick(randomComic)}>
						<img
							src={randomComic.image.original_url}
							alt={randomComic.name || "Comic cover"}
							className="comic-thumbnail"
						/>
						<p>Click to view a random comic!</p>
					</div>
				) : (
					<p>No random comic available</p>
				)}
				<button className="close-popup-button" onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default WelcomePopup;
