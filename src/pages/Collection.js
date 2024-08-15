import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Collection.css";

const Collection = ({ userId }) => {
	const [comics, setComics] = useState([]);

	useEffect(() => {
		const fetchComics = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/collection/${userId}`
				);
				console.log("API Response Data:", response.data);
				setComics(response.data);
			} catch (error) {
				console.error("Error fetching collection:", error);
			}
		};

		fetchComics();
	}, [userId]);

	// Helper function to format the issue number correctly
	const formatIssueNumber = (issueNumber) => {
		return issueNumber ? issueNumber.replace(/\D/g, "") : "N/A";
	};

	// Group comics by series
	const groupedComics = comics.reduce((acc, comic) => {
		const seriesName = comic.title || "Unknown Title";
		if (!acc[seriesName]) {
			acc[seriesName] = [];
		}
		acc[seriesName].push(comic);
		return acc;
	}, {});

	const handleAddToCollection = (seriesName, nextIssueNumber) => {
		console.log(`Add ${seriesName} - Issue #${nextIssueNumber} to collection`);
	};

	return (
		<div className="collection-container">
			<h1>My Collection</h1>
			{Object.keys(groupedComics).map((seriesName) => {
				const seriesComics = groupedComics[seriesName];
				const lastComic = seriesComics[seriesComics.length - 1];
				const nextIssueNumber = lastComic.issue_number
					? parseInt(lastComic.issue_number, 10) + 1
					: "N/A";

				return (
					<div key={seriesName} className="series-row">
						<h2>{seriesName}</h2>
						<div className="comics-series-shelf">
							{seriesComics.map((comic) => (
								<div key={comic.id} className="comic-item">
									<img
										src={comic.cover_image_url}
										alt={comic.title || "Unknown Title"}
										className="comic-cover"
									/>
									<h3>
										{comic.title || "Unknown Title"} - Issue #
										{formatIssueNumber(comic.issue_number)}
									</h3>
								</div>
							))}
							{/* Placeholder for the next comic in the series */}
							{nextIssueNumber !== "N/A" && (
								<div className="comic-item next-comic-placeholder">
									<div
										className="next-comic-overlay"
										onClick={() =>
											handleAddToCollection(seriesName, nextIssueNumber)
										}>
										<button className="add-to-collection-button">
											Add to Collection
										</button>
									</div>
									<h3>
										{seriesName} - Issue #{nextIssueNumber}
									</h3>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Collection;
