import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddComic = ({ userId }) => {
	const [comicName, setComicName] = useState("");
	const [comics, setComics] = useState([]);
	const [page, setPage] = useState(1);

	const handleSearch = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/comics/search/${comicName}?page=${page}`
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

	const handleNextPage = () => {
		setPage(page + 1);
		handleSearch();
	};

	const handlePreviousPage = () => {
		if (page > 1) {
			setPage(page - 1);
			handleSearch();
		}
	};

	return (
		<div className="comic-search-container">
			<input
				type="text"
				value={comicName}
				onChange={(e) => setComicName(e.target.value)}
				placeholder="Comic Name"
				className="search-input"
			/>
			<button onClick={handleSearch} className="search-button">
				Search
			</button>

			<div className="comics-shelf">
				{comics.length > 0 &&
					comics.map((comic) => (
						<div key={comic.id} className="comic-item">
							<Link to={`/comic/${comic.id}`}>
								<img
									src={comic.image.original_url}
									alt={comic.name}
									className="comic-cover"
								/>
							</Link>
							<h3>{comic.name}</h3>
							<button onClick={() => handleAdd(comic)} className="add-button">
								Add to Collection
							</button>
						</div>
					))}
			</div>

			{comics.length > 0 && (
				<div className="pagination-controls">
					{page > 1 && (
						<button onClick={handlePreviousPage} className="pagination-button">
							Previous
						</button>
					)}
					<button onClick={handleNextPage} className="pagination-button">
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default AddComic;
