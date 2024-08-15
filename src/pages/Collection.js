import React, { useEffect, useState } from "react";
import axios from "axios";

const Collection = ({ userId }) => {
	const [comics, setComics] = useState([]);

	useEffect(() => {
		const fetchComics = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/collection/${userId}`
				);
				setComics(response.data);
			} catch (error) {
				console.error("Error fetching collection:", error);
			}
		};

		fetchComics();
	}, [userId]);

	return (
		<div>
			<h1>My Collection</h1>
			<ul>
				{comics.map((comic) => (
					<li key={comic.id}>
						<h2>
							{comic.title} - Issue #{comic.issue_number}
						</h2>
						<img src={comic.cover_image_url} alt={comic.title} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default Collection;
