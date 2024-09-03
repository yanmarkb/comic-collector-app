import React from "react";
import "./ComicDetails.css";

// Function to strip HTML tags from a string
const stripHtmlTags = (str) => {
	if (!str) return "";
	return str.replace(/<\/?[^>]+(>|$)/g, "");
};

const ComicDetails = ({ comic, onClose }) => {
	// If the comic or comic.image is undefined, return a simple message
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

	return (
		<div className="comic-details-page">
			<div className="comic-details-overlay" onClick={onClose}></div>
			<div className="comic-details-container">
				<button className="close-modal-button" onClick={onClose}>
					Close
				</button>
				<div className="comic-details-content">
					<img
						src={comic.image.original_url}
						alt={comic.name || "Comic cover"}
						className="comic-details-cover"
					/>
					<div className="comic-details-info">
						<h1>{comic.name}</h1>
						{comic.issue_number && (
							<p>
								<strong>Issue Number:</strong> {comic.issue_number}
							</p>
						)}
						{comic.publisher?.name && (
							<p>
								<strong>Publisher:</strong> {comic.publisher.name}
							</p>
						)}
						{comic.cover_date && (
							<p>
								<strong>Release Date:</strong> {comic.cover_date}
							</p>
						)}
						{comic.description && <p>{stripHtmlTags(comic.description)}</p>}
						{comic.character_credits?.length > 0 && (
							<p>
								<strong>Characters:</strong>{" "}
								{comic.character_credits
									.map((character) => character.name)
									.join(", ")}
							</p>
						)}
						{comic.story_arc_credits?.length > 0 && (
							<p>
								<strong>Story Arcs:</strong>{" "}
								{comic.story_arc_credits.map((arc) => arc.name).join(", ")}
							</p>
						)}
						{comic.team_credits?.length > 0 && (
							<p>
								<strong>Teams:</strong>{" "}
								{comic.team_credits.map((team) => team.name).join(", ")}
							</p>
						)}
						{comic.location_credits?.length > 0 && (
							<p>
								<strong>Locations:</strong>{" "}
								{comic.location_credits
									.map((location) => location.name)
									.join(", ")}
							</p>
						)}
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
