import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ComicDetails from "./ComicDetails";
import Loading from "./Loading";
import "./Home.css";
import { fetchComics } from "../services/comicVineService";

const Home = ({ userId }) => {
	const [comics, setComics] = useState([]);
	const [loading, setLoading] = useState(true);
	const [comicName, setComicName] = useState("");
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [selectedComic, setSelectedComic] = useState(null);
	const [searchPerformed, setSearchPerformed] = useState(false);

	// Fetch initial comics on component mount
	useEffect(() => {
		const getComics = async () => {
			setLoading(true); // Show loading screen
			const comicCovers = await fetchComics(); // Assuming fetchComics is used to fetch initial comics
			setComics(shuffleArray(comicCovers));
			setLoading(false); // Hide loading screen
		};

		getComics();
	}, []);

	// Shuffle the array of comics for initial display
	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	// Handle search functionality
	const handleSearch = async (reset = false) => {
		setLoading(true); // Show loading screen
		try {
			const response = await axios.get(
				`http://localhost:5000/api/comics/search/${comicName}?page=${page}`
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
		} finally {
			setLoading(false); // Hide loading screen
		}
	};

	// Handle adding a comic to the user's collection
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

	// Handle pagination for showing more comics
	const handleShowMore = () => {
		setPage((prevPage) => prevPage + 1);
	};

	// Fetch more comics when the page changes
	useEffect(() => {
		if (page > 1) {
			handleSearch();
		}
	}, [page]);

	// Handle search button click
	const handleSearchButtonClick = () => {
		setPage(1);
		handleSearch(true);
	};

	// Handle comic click to show details
	const handleComicClick = (comic) => {
		setSelectedComic(comic);
	};

	// Handle enter key press for search
	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			handleSearchButtonClick();
		}
	};

	// Render a row of comics
	const renderRow = (comics, speed) => (
		<div className="comic-row" style={{ animationDuration: `${speed}s` }}>
			{comics.concat(comics).map((comic, index) => (
				<img key={index} src={comic.image.original_url} alt={comic.name} />
			))}
		</div>
	);

	// Render loading screen if data is being fetched
	if (loading) {
		return <Loading />;
	}

	return (
		<div className={`home ${searchPerformed ? "scrollable" : ""}`}>
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
						onKeyPress={handleKeyPress}
					/>
					<button onClick={handleSearchButtonClick} className="search-button">
						Search
					</button>

					{searchPerformed ? (
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
					) : (
						<>
							{renderRow(comics.slice(0, 10), 30)}
							{renderRow(comics.slice(10, 20), 35)}
							{renderRow(comics.slice(20, 30), 40)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Home;
