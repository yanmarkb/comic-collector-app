import React, { useState } from "react";
import axios from "axios";

const AddComic = ({ userId }) => {
	const [comicName, setComicName] = useState("");
	const [comics, setComics] = useState([]);

	const handleSearch = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/comics/search/${comicName}`
			);
			setComics(response.data);
		} catch (error) {
			console.error("Error fetching comics:", error);
		}
	};

	const handleAdd = async (comic) => {
		try {
			await axios.post("http://localhost:5000/api/comics", {
				...comic,
				user_id: userId,
			});
		} catch (error) {
			console.error("Error adding comic:", error);
		}
	};

	return (
		<div>
			<input
				type="text"
				value={comicName}
				onChange={(e) => setComicName(e.target.value)}
				placeholder="Comic Name"
			/>
			<button onClick={handleSearch}>Search</button>

			{comics.length > 0 && (
				<div>
					{comics.map((comic) => (
						<div key={comic.id}>
							<h2>{comic.name}</h2>
							<img src={comic.image.original_url} alt={comic.name} />
							<button onClick={() => handleAdd(comic)}>
								Add to Collection
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AddComic;
