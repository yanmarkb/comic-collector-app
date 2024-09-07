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
	// State variables to manage the comic data, loading state, and more
	const [comics, setComics] = useState([]); // Holds the list of fetched comics
	const [loading, setLoading] = useState(true); // Tracks if the page is loading
	const [page, setPage] = useState(1); // Keeps track of the page for pagination
	const [hasMore, setHasMore] = useState(true); // Determines if there are more comics to load
	const [selectedComic, setSelectedComic] = useState(null); // Stores the comic selected for viewing details
	const [searchPerformed, setSearchPerformed] = useState(false); // Tracks if a search has been done
	const [auth, setAuth] = useState(!!localStorage.getItem("token")); // Manages authentication state
	const [showLogin, setShowLogin] = useState(false); // Toggles between login and register views
	const [showWelcomePopup, setShowWelcomePopup] = useState(true); // Handles the display of the welcome popup
	const [searchQuery, setSearchQuery] = useState(comicName || ""); // Stores the search term from the input
	const searchTimeoutRef = useRef(null); // Reference to store the search timeout
	const isFetchingRef = useRef(false); // Flag to prevent multiple API calls at once

	// Initial comic fetch or search when the component mounts
	useEffect(() => {
		// Fetch initial comic data or perform a search if a search term is provided
		const getComics = async () => {
			setLoading(true);
			if (comicName) {
				// If we have a comic name, perform a fresh search
				await handleSearch(true, comicName);
			} else {
				// If not, fetch a shuffled list of comics
				const comicCovers = await fetchComics();
				setComics(shuffleArray(comicCovers));
			}
			setLoading(false); // Turn off loading after fetching data
		};

		// Set up a delay for the search functionality (500 ms)
		const delaySearch = () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current); // Clear any existing timeouts
			}
			// Set a timeout to trigger the comic fetch after 500 ms
			searchTimeoutRef.current = setTimeout(() => {
				getComics();
			}, 500);
		};

		delaySearch(); // Start the delayed search

		// Clean up any timeouts when the component unmounts
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [comicName]); // Effect depends on the `comicName` prop

	// Shuffle the comic array for random ordering
	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]]; // Swap elements
		}
		return array; // Return the shuffled array
	};

	// Handle the search functionality for comics
	// It takes 3 parameters:
	// reset: If true, it's a fresh search, so previous results are cleared
	// query: This is the search term entered by the user
	// pageNumber: This keeps track of the page for pagination
	const handleSearch = async (reset = false, query = "", pageNumber = 1) => {
		if (isFetchingRef.current) return; // Prevent multiple API calls at once
		isFetchingRef.current = true; // Set the fetching flag to true
		setLoading(true); // Start the loading state

		try {
			// Fetch the comics from the API based on the search term and page number
			const response = await axios.get(
				`https://backend-comic-collector-app.onrender.com/api/comics/search/${query}?page=${pageNumber}`
			);
			const fetchedComics = response.data; // Store the fetched comics

			if (reset) {
				// If it's a fresh search, replace the existing comics with the new results
				setComics(fetchedComics);
				setPage(1); // Reset the page number to 1
				setSearchQuery(query); // Save the search term for later
			} else {
				// Otherwise, append the new comics, filtering out duplicates
				const newComics = fetchedComics.filter(
					(comic) =>
						!comics.some((existingComic) => existingComic.id === comic.id)
				);
				setComics((prevComics) => [...prevComics, ...newComics]); // Add new comics
			}

			setHasMore(fetchedComics.length === 18); // If exactly 18 comics were fetched, assume there are more pages
			setSearchPerformed(true); // Mark the search as performed
		} catch (error) {
			console.error("Error fetching comics:", error); // Log any errors
		} finally {
			setLoading(false); // Stop the loading state
			isFetchingRef.current = false; // Reset the fetching flag
		}
	};

	// Handle adding a comic to the user's collection
	const handleAdd = async (comic) => {
		try {
			// If no user ID is provided, log an error and exit
			if (!userId) {
				console.error("User ID is missing, cannot add comic.");
				return;
			}

			// Extract the publisher name or set it to "Unknown Publisher" if not available
			const publisherName = comic.publisher?.name || "Unknown Publisher";

			// Prepare the comic data to be sent to the backend
			const comicData = {
				id: comic.id,
				title: comic.name || "Unknown Title",
				issue_number: comic.issue_number || "N/A",
				description: comic.description || "No description available.",
				cover_image_url: comic.image.original_url || "",
				publisher: publisherName,
				release_date: comic.cover_date || null,
				user_id: userId, // Add the user ID to associate it with the user
			};

			// Send the comic data to the backend to add it to the collection
			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/comics",
				comicData
			);

			console.log("Server response:", response.data); // Log the server's response
		} catch (error) {
			console.error("Error adding comic:", error); // Log any errors that occur
		}
	};

	// Handle the "Show More" functionality for pagination
	const handleShowMore = () => {
		const nextPage = page + 1; // Increment the page number
		setPage(nextPage); // Update the page state
		handleSearch(false, searchQuery, nextPage); // Fetch the next page of comics
	};

	// Whenever the page changes, trigger another search for the next set of comics
	useEffect(() => {
		if (page > 1) {
			handleSearch(false, searchQuery, page);
		}
	}, [page]); // Effect depends on the `page` state

	// Handle clicking on a comic to display its details
	const handleComicClick = (comic) => {
		setSelectedComic(comic); // Store the selected comic in the state
	};

	// Close the comic details modal
	const closeModal = () => {
		setSelectedComic(null); // Clear the selected comic
	};

	// Close the welcome popup
	const closePopup = () => {
		setShowWelcomePopup(false); // Hide the welcome popup
	};

	// Toggle between the login and register views
	const toggleLogin = () => {
		setShowLogin(!showLogin); // Switch between login and register
	};

	// Handle the search button click event
	const handleSearchButtonClick = () => {
		handleSearch(true, searchQuery); // Perform a fresh search with the current search term
	};

	// Handle the "Enter" key press for triggering the search
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			handleSearch(true, searchQuery); // Trigger a fresh search when "Enter" is pressed
		}
	};

	// Handle input changes in the search bar, with a delay to prevent excessive API calls
	const handleInputChange = (e) => {
		setSearchQuery(e.target.value); // Update the search term
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current); // Clear the existing timeout
		}
		// Set a new timeout to delay the search by 2 seconds
		searchTimeoutRef.current = setTimeout(() => {
			handleSearch(true, e.target.value); // Trigger the search after 2 seconds
		}, 2000);
	};

	// Render a row of comics that scroll across the screen as a background effect
	const renderRow = (comics, speed) => (
		<div className="comic-row" style={{ animationDuration: `${speed}s` }}>
			{comics.concat(comics).map((comic, index) => (
				<img key={index} src={comic.image.original_url} alt={comic.name} />
			))}
		</div>
	);

	// Display a loading screen while the comics are being fetched
	if (loading) {
		return <Loading />;
	}

	return (
		<div className={`home ${searchPerformed ? "scrollable" : ""}`}>
			{/* Background comics that scroll behind the content */}
			{!searchPerformed && (
				<div className="background-comics">
					{renderRow(comics.slice(0, 10), 30)}
					{renderRow(comics.slice(10, 20), 35)}
					{renderRow(comics.slice(20, 30), 40)}
				</div>
			)}

			{/* Main content of the page */}
			<div className="foreground-content">
				{auth ? (
					<>
						{/* Show the comic details modal if a comic is selected */}
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

						{/* Show the shelf of searched comics if a search has been performed */}
						{searchPerformed ? (
							<div className="comics-shelf">
								{comics.length > 0 &&
									comics.map((comic, index) => (
										<div key={index} className="comic-item">
											{/* Clicking on a comic will show its details */}
											<Link to="#" onClick={() => handleComicClick(comic)}>
												<img
													src={comic.image.original_url}
													alt={comic.name}
													className="comic-cover"
												/>
											</Link>
											{/* Button to add the comic to the user's collection */}
											<button
												onClick={() => handleAdd(comic)}
												className="add-button">
												Add to Collection
											</button>
										</div>
									))}
								{/* Show the "Show More" button if there are more comics to load */}
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
					// Display the login or register form if the user is not authenticated
					<div className="auth-container">
						{showLogin ? (
							<Login setAuth={setAuth} />
						) : (
							<Register setAuth={setAuth} />
						)}
						{/* Toggle between login and register forms */}
						<button onClick={toggleLogin} className="toggle-auth-button">
							{showLogin
								? "Not a user? Register here"
								: "Already a user? Log in here"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
