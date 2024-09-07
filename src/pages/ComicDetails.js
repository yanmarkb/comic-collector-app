import React from "react";
import "./ComicDetails.css";

// This function removes any HTML tags from the description text.
// It's helpful because sometimes the comic descriptions may contain HTML,
// and we want to display plain text.
const stripHtmlTags = (str) => {
	if (!str) return ""; // If there's no string passed, return an empty string.
	return str.replace(/<\/?[^>]+(>|$)/g, ""); // This regex removes all HTML tags.
};

const ComicDetails = ({ comic, onClose }) => {
	// This part handles cases where either the comic object or comic.image is missing.
	// If that's the case, it just shows a simple message saying "No comic details available."
	if (!comic || !comic.image) {
		return (
			<div className="comic-details-page">
				<div className="comic-details-overlay" onClick={onClose}></div>
				<div className="comic-details-container">
					<p>No comic details available.</p>
					<button className="close-modal-button" onClick={onClose}>
						Close
					</button>
				</div>
			</div>
		);
	}

	// If the comic object is valid, we move on to display all the comic details.
	// The modal itself is split into an overlay and a container for the content.
	// You can close the modal by clicking the "Close" button or the overlay.
	return (
		<div className="comic-details-page">
			{/* Clicking the overlay will also close the modal */}
			<div className="comic-details-overlay" onClick={onClose}></div>
			<div className="comic-details-container">
				{/* This button allows the user to close the modal */}
				<button className="close-modal-button" onClick={onClose}>
					Close
				</button>

				{/* Main content of the comic details */}
				<div className="comic-details-content">
					{/* Display the comic cover image */}
					<img
						src={comic.image.original_url} // Fetches the image URL from the comic object
						alt={comic.name || "Comic cover"} // Shows either the comic name or a generic "Comic cover" if the name is missing
						className="comic-details-cover"
					/>

					{/* Info section where all the details about the comic are shown */}
					<div className="comic-details-info">
						{/* Display the comic name as the title */}
						<h1>{comic.name}</h1>

						{/* If the comic has an issue number, display it here */}
						{comic.issue_number && (
							<p>
								<strong>Issue Number:</strong> {comic.issue_number}
							</p>
						)}

						{/* If the publisher is available, display the publisher's name */}
						{comic.publisher?.name && (
							<p>
								<strong>Publisher:</strong> {comic.publisher.name}
							</p>
						)}

						{/* If there's a release date, display it here */}
						{comic.cover_date && (
							<p>
								<strong>Release Date:</strong> {comic.cover_date}
							</p>
						)}

						{/* If the comic has a description, display it after stripping out any HTML tags */}
						{comic.description && <p>{stripHtmlTags(comic.description)}</p>}

						{/* If the comic features characters, list them here */}
						{comic.character_credits?.length > 0 && (
							<p>
								<strong>Characters:</strong>{" "}
								{comic.character_credits
									.map((character) => character.name) // Map through the characters and list their names
									.join(", ")}{" "}
								{/* Join the names with a comma */}
							</p>
						)}

						{/* If the comic is part of any story arcs, display them here */}
						{comic.story_arc_credits?.length > 0 && (
							<p>
								<strong>Story Arcs:</strong>{" "}
								{comic.story_arc_credits.map((arc) => arc.name).join(", ")}
							</p>
						)}

						{/* If the comic features teams, list them here */}
						{comic.team_credits?.length > 0 && (
							<p>
								<strong>Teams:</strong>{" "}
								{comic.team_credits.map((team) => team.name).join(", ")}
							</p>
						)}

						{/* If the comic features specific locations, display them here */}
						{comic.location_credits?.length > 0 && (
							<p>
								<strong>Locations:</strong>{" "}
								{comic.location_credits
									.map((location) => location.name)
									.join(", ")}
							</p>
						)}

						{/* If the comic introduces any concepts, list them here */}
						{comic.concept_credits?.length > 0 && (
							<p>
								<strong>Concepts:</strong>{" "}
								{comic.concept_credits
									.map((concept) => concept.name)
									.join(", ")}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComicDetails;
