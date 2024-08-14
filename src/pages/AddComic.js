import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AddComic.css"; // Import the CSS file

const AddComic = ({ userId }) => {
	const [comicName, setComicName] = useState("");
	const [comics, setComics] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const handleSearch = async (reset = false) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/comics/search/${comicName}?page=${page}`
			);
			const fetchedComics = response.data;

			if (reset) {
				setComics(fetchedComics);
				setHasMore(fetchedComics.length === 14);
			} else {
				setComics((prevComics) => [...prevComics, ...fetchedComics]);
				setHasMore(fetchedComics.length === 14);
			}
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

	const handleShowMore = () => {
		setPage((prevPage) => prevPage + 1);
	};

	const handleSearchButtonClick = () => {
		setPage(1);
		handleSearch(true);
	};

	React.useEffect(() => {
		if (page > 1) {
			handleSearch();
		}
		// eslint-disable-next-line
	}, [page]);

	return (
		<div className="comic-search-container">
			<input
				type="text"
				value={comicName}
				onChange={(e) => setComicName(e.target.value)}
				placeholder="Comic Name"
				className="search-input"
			/>
			<button onClick={handleSearchButtonClick} className="search-button">
				Search
			</button>

			<div className="comics-shelf">
				{comics.length > 0 &&
					comics.map((comic, index) => (
						<div key={index} className="comic-item">
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

			{hasMore && comics.length > 0 && (
				<div className="pagination-controls">
					<button onClick={handleShowMore} className="pagination-button">
						Show More...
					</button>
				</div>
			)}
		</div>
	);
};

export default AddComic;
