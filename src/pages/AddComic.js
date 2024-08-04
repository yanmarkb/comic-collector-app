import React, { useState } from "react";
import axios from "axios";

const AddComic = ({ userId }) => {
	const [comicId, setComicId] = useState("");
	const [comic, setComic] = useState(null);

	const handleSearch = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/comic/${comicId}`
			);
			setComic(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleAdd = async () => {
		try {
			await axios.post("http://localhost:5000/api/comics", {
				...comic,
				user_id: userId,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<input
				type="text"
				value={comicId}
				onChange={(e) => setComicId(e.target.value)}
				placeholder="Comic ID"
			/>
			<button onClick={handleSearch}>Search</button>

			{comic && (
				<div>
					<h2>{comic.name}</h2>
					<img src={comic.image.original_url} alt={comic.name} />
					<button onClick={handleAdd}>Add to Collection</button>
				</div>
			)}
		</div>
	);
};

export default AddComic;
