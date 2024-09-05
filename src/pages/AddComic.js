import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ComicDetails from "./ComicDetails";
import "./AddComic.css";

const AddComic = ({ userId }) => {
	const [comicName, setComicName] = useState("");
	const [comics, setComics] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [selectedComic, setSelectedComic] = useState(null);
	const [searchPerformed, setSearchPerformed] = useState(false);

	const handleSearch = async (reset = false) => {
		try {
			const response = await axios.get(
				`https://backend-comic-collector-app.onrender.com/api/comics/search/${comicName}?page=${page}`
			);
			const fetchedComics = response.data;

			if (reset) {
				setComics(fetchedComics);
			} else {
				setComics((prevComics) => [...prevComics, ...fetchedComics]);
			}
			setHasMore(fetchedComics.length === 18);
			setSearchPerformed(true);
		} catch (error) {
			console.error("Error fetching comics:", error);
		}
	};

	const handleAdd = async (comic) => {
		try {
			const userId = localStorage.getItem("userId");

			if (!userId) {
				console.error("User ID is missing, cannot add comic.");
				return;
			}

			const publisherName = comic.publisher?.name || "Unknown Publisher";

			const comicData = {
				id: comic.id,
				title: comic.name || "Unknown Title",
				issue_number: comic.issue_number || "N/A",
				description: comic.description || "No description available.",
				cover_image_url: comic.image.original_url || "",
				publisher: publisherName,
				release_date: comic.cover_date || null,
				user_id: userId,
			};

			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/comics",
				comicData
			);

			console.log("Server response:", response.data);
		} catch (error) {
			console.error("Error adding comic:", error);
		}
	};

	const handleShowMore = () => {
		setPage((prevPage) => prevPage + 1);
	};

	React.useEffect(() => {
		if (page > 1) {
			handleSearch();
		}
		// eslint-disable-next-line
	}, [page]);

	const handleSearchButtonClick = () => {
		setPage(1);
		handleSearch(true);
	};

	const handleComicClick = (comic) => {
		setSelectedComic(comic);
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			handleSearchButtonClick();
		}
	};

	return (
		<div
			className={`comic-search-container ${
				searchPerformed ? "scrollable" : ""
			}`}>
			{selectedComic ? (
				<ComicDetails comic={selectedComic} />
			) : (
				<>
					<input
						type="text"
						value={comicName}
						onChange={(e) => setComicName(e.target.value)}
						placeholder="Comic Name"
						className="search-input"
						onKeyPress={handleKeyPress} // Add key press event handler
					/>
					<button onClick={handleSearchButtonClick} className="search-button">
						Search
					</button>

					{searchPerformed && (
						<div className="comics-shelf">
							{comics.length > 0 &&
								comics.map((comic, index) => (
									<div key={index} className="comic-item">
										<Link to="#" onClick={() => handleComicClick(comic)}>
											<img
												src={comic.image.original_url}
												alt={comic.name}
												className="comic-cover"
											/>
										</Link>
										{/* <h3>{comic.name}</h3> */}
										<button
											onClick={() => handleAdd(comic)}
											className="add-button">
											Add to Collection
										</button>
									</div>
								))}

							{hasMore && (
								<div className="pagination-controls">
									<button
										onClick={handleShowMore}
										className="pagination-button">
										Show More...
									</button>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AddComic;
