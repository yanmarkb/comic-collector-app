import React, { useState, useEffect } from "react";
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
	const [allowScroll, setAllowScroll] = useState(false);

	useEffect(() => {
		const storedComics = JSON.parse(localStorage.getItem("comics"));
		const storedComicName = localStorage.getItem("comicName");

		if (storedComics && storedComicName) {
			setComics(storedComics);
			setComicName(storedComicName);
		}
	}, []);

	const handleSearch = async (reset = false) => {
		try {
			const excludeIds = comics.map((comic) => comic.id);
			const response = await axios.get(
				`http://localhost:5000/api/comics/search/${comicName}?page=${page}&excludeIds=${excludeIds.join(
					","
				)}`
			);
			const fetchedComics = response.data;

			let updatedComics;
			if (reset) {
				updatedComics = fetchedComics;
				setPage(1);
				setHasMore(fetchedComics.length === 18);
			} else {
				updatedComics = [...comics, ...fetchedComics];
				setHasMore(fetchedComics.length === 18);
			}

			setComics(updatedComics);
			localStorage.setItem("comics", JSON.stringify(updatedComics));
			localStorage.setItem("comicName", comicName);
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
				"http://localhost:5000/api/comics",
				comicData
			);

			console.log("Server response:", response.data);
		} catch (error) {
			console.error("Error adding comic:", error);
		}
	};

	const handleShowMore = () => {
		setPage((prevPage) => prevPage + 1);
		setAllowScroll(true);
	};

	useEffect(() => {
		if (page > 1) {
			handleSearch();
		}
	}, [page]);

	const handleSearchButtonClick = () => {
		setPage(1);
		handleSearch(true);
		setAllowScroll(false);
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
			className={`comic-search-container ${allowScroll ? "allow-scroll" : ""}`}>
			{selectedComic ? (
				<ComicDetails comic={selectedComic} />
			) : (
				<>
					<input
						type="text"
						value={comicName}
						onChange={(e) => setComicName(e.target.value)}
						onKeyPress={handleKeyPress}
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
