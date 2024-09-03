import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ComicDetails from "./ComicDetails";
import Loading from "./Loading";
import Register from "./Register";
import Login from "./Login";
import WelcomePopup from "./WelcomePopup";
import "./Home.css";
import { fetchComics } from "../services/comicVineService";

const Home = ({ userId, comicName }) => {
	const [comics, setComics] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [selectedComic, setSelectedComic] = useState(null);
	const [searchPerformed, setSearchPerformed] = useState(false);
	const [auth, setAuth] = useState(!!localStorage.getItem("token"));
	const [showLogin, setShowLogin] = useState(false);
	const [showWelcomePopup, setShowWelcomePopup] = useState(true);
	const [searchQuery, setSearchQuery] = useState(comicName || "");
	const searchTimeoutRef = useRef(null);
	const isFetchingRef = useRef(false);

	// Fetch initial comics or search comics on component mount
	useEffect(() => {
		const getComics = async () => {
			setLoading(true);
			if (comicName) {
				await handleSearch(true, comicName);
			} else {
				const comicCovers = await fetchComics();
				setComics(shuffleArray(comicCovers));
			}
			setLoading(false);
		};

		const delaySearch = () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
			searchTimeoutRef.current = setTimeout(() => {
				getComics();
			}, 500);
		};

		delaySearch();

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [comicName]);

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const handleSearch = async (reset = false, query = "", pageNumber = 1) => {
		if (isFetchingRef.current) return; // Prevent multiple API calls
		isFetchingRef.current = true; // Set fetching flag to true
		setLoading(true);
		try {
			const response = await axios.get(
				`http://localhost:5000/api/comics/search/${query}?page=${pageNumber}`
			);
			const fetchedComics = response.data;

			if (reset) {
				setComics(fetchedComics);
				setPage(1); // Reset page to 1 on new search
				setSearchQuery(query); // Save the search term
			} else {
				// Filter out duplicates
				const newComics = fetchedComics.filter(
					(comic) =>
						!comics.some((existingComic) => existingComic.id === comic.id)
				);
				setComics((prevComics) => [...prevComics, ...newComics]);
			}
			setHasMore(fetchedComics.length === 18);
			setSearchPerformed(true);
		} catch (error) {
			console.error("Error fetching comics:", error);
		} finally {
			setLoading(false);
			isFetchingRef.current = false; // Reset fetching flag
		}
	};

	const handleAdd = async (comic) => {
		try {
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
		const nextPage = page + 1;
		setPage(nextPage);
		handleSearch(false, searchQuery, nextPage);
	};

	useEffect(() => {
		if (page > 1) {
			handleSearch(false, searchQuery, page);
		}
	}, [page]);

	const handleComicClick = (comic) => {
		setSelectedComic(comic);
	};

	const closeModal = () => {
		setSelectedComic(null);
	};

	const closePopup = () => {
		setShowWelcomePopup(false);
	};

	const toggleLogin = () => {
		setShowLogin(!showLogin);
	};

	const handleSearchButtonClick = () => {
		handleSearch(true, searchQuery);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			handleSearch(true, searchQuery);
		}
	};

	const handleInputChange = (e) => {
		setSearchQuery(e.target.value);
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}
		searchTimeoutRef.current = setTimeout(() => {
			handleSearch(true, e.target.value);
		}, 2000);
	};

	const renderRow = (comics, speed) => (
		<div className="comic-row" style={{ animationDuration: `${speed}s` }}>
			{comics.concat(comics).map((comic, index) => (
				<img key={index} src={comic.image.original_url} alt={comic.name} />
			))}
		</div>
	);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className={`home ${searchPerformed ? "scrollable" : ""}`}>
			{/* Background scrolling comics */}
			{!searchPerformed && (
				<div className="background-comics">
					{renderRow(comics.slice(0, 10), 30)}
					{renderRow(comics.slice(10, 20), 35)}
					{renderRow(comics.slice(20, 30), 40)}
				</div>
			)}

			{/* Foreground content */}
			<div className="foreground-content">
				{auth ? (
					<>
						{selectedComic ? (
							<div className="comic-details-modal">
								<div
									className="comic-details-overlay"
									onClick={closeModal}></div>
								<div className="comic-details-content">
									<ComicDetails comic={selectedComic} onClose={closeModal} />
								</div>
							</div>
						) : null}

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
						) : null}
					</>
				) : (
					<div className="auth-container">
						{showLogin ? (
							<Login setAuth={setAuth} />
						) : (
							<Register setAuth={setAuth} />
						)}
						<button onClick={toggleLogin} className="toggle-auth-button">
							{showLogin
								? "Not a user? Register here"
								: "Already a user? Log in here"}
						</button>
					</div>
				)}
				{/* Working on this */}
				{/* {showWelcomePopup && (
					<WelcomePopup
						onClose={() => setShowWelcomePopup(false)}
						onComicClick={(comic) => console.log(comic)}
					/>
				)} */}
			</div>
		</div>
	);
};

export default Home;
