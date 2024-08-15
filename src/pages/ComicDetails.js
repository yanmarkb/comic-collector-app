import React from "react";

const ComicDetails = ({ comic }) => {
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
