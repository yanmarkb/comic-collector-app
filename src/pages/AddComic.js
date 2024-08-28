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
	const [selectedComic, setSelectedComic] = useState(null); // State for selected comic

	const handleSearch = async (reset = false) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/comics/search/${comicName}?page=${page}`
			);
			const fetchedComics = response.data;

			if (reset) {
				setComics(fetchedComics);
				setHasMore(fetchedComics.length === 18);
			} else {
				setComics((prevComics) => [...prevComics, ...fetchedComics]);
				setHasMore(fetchedComics.length === 18);
			}
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

			console.log("User ID:", userId); // Debugging line to check userId
			console.log("Comic Data:", comic); // Debugging line to check comic data being sent

			// Check if comic.publisher is defined, and use a fallback value if it's not
			const publisherName = comic.publisher?.name || "Unknown Publisher";

			// Check other fields as well, provide fallbacks if necessary
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
				"http://localhost:5000/api/comics",
				comicData
			);

			console.log("Server response:", response.data); // Debugging line to check server response
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

	React.useEffect(() => {
		if (page > 1) {
			handleSearch();
		}
		// eslint-disable-next-line
	}, [page]);

	return (
		<div className="comic-search-container">
			{selectedComic ? (
				<ComicDetails comic={selectedComic} /> // Render ComicDetails if a comic is selected
			) : (
				<>
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
									<Link to="#" onClick={() => handleComicClick(comic)}>
										<img
											src={comic.image.original_url}
											alt={comic.name}
											className="comic-cover"
										/>
									</Link>
									<h3>{comic.name}</h3>
									<button
										onClick={() => handleAdd(comic)}
										className="add-button">
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
				</>
			)}
		</div>
	);
};

export default AddComic;
