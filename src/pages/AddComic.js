import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ComicDetails from "./ComicDetails";
import "./AddComic.css";

const AddComic = ({ userId }) => {
	// State variables for managing the search and pagination process.
	// `comicName` is the term entered by the user for searching comics.
	const [comicName, setComicName] = useState("");
	// `comics` holds the list of fetched comics from the API.
	const [comics, setComics] = useState([]);
	// `page` tracks the current page for pagination purposes.
	const [page, setPage] = useState(1);
	// `hasMore` tells us whether there are more comics to fetch (for pagination).
	const [hasMore, setHasMore] = useState(true);
	// `selectedComic` is the comic that the user clicked on, which opens the details view.
	const [selectedComic, setSelectedComic] = useState(null);
	// `searchPerformed` tracks whether a search has already been done, so we know when to show results.
	const [searchPerformed, setSearchPerformed] = useState(false);

	// This function handles the search for comics.
	// It takes one key parameter: reset. When `reset` is `true`, it starts a fresh search.
	const handleSearch = async (reset = false) => {
		try {
			// Make the actual API call to fetch comics using the entered comic name and the current page for pagination.
			const response = await axios.get(
				`https://backend-comic-collector-app.onrender.com/api/comics/search/${comicName}?page=${page}`
			);
			// This line stores the comics that we get back from the API in `fetchedComics`.
			const fetchedComics = response.data;

			// If `reset` is true, that means we're doing a new search, so we replace the old comics list with the new one.
			// If `reset` is false, it means we're paginating, so we add the new comics to the current list.
			if (reset) {
				setComics(fetchedComics);
			} else {
				setComics((prevComics) => [...prevComics, ...fetchedComics]);
			}

			// This part handles pagination. It checks if we fetched exactly 18 comics.
			// If yes, it assumes there are more pages to load and shows the "Show More" button.
			// If no, it hides the button, assuming there are no more pages.
			setHasMore(fetchedComics.length === 18);

			// Mark that a search has been performed, which will allow us to display the results.
			setSearchPerformed(true);
		} catch (error) {
			// If there's an error fetching comics, it gets logged here.
			console.error("Error fetching comics:", error);
		}
	};

	// This function is called when the user wants to add a comic to their collection.
	// It sends the comic details to the backend.
	const handleAdd = async (comic) => {
		try {
			// Get the user ID from local storage (it's needed to associate the comic with the user).
			const userId = localStorage.getItem("userId");

			// If the user ID is missing, log an error and stop the process.
			if (!userId) {
				console.error("User ID is missing, cannot add comic.");
				return;
			}

			// Extract the publisher name from the comic object or use "Unknown Publisher" if none exists.
			const publisherName = comic.publisher?.name || "Unknown Publisher";

			// Create an object that holds all the comic details we want to send to the backend.
			const comicData = {
				id: comic.id,
				title: comic.name || "Unknown Title",
				issue_number: comic.issue_number || "N/A",
				description: comic.description || "No description available.",
				cover_image_url: comic.image.original_url || "",
				publisher: publisherName,
				release_date: comic.cover_date || null,
				user_id: userId,
				collection_number: comic.collection_number || "Unknown Title",
				collection_name: comic.title || "Unknown Title",
				library_name: "Recently Added", // We're adding it to the "Recently Added" library by default.
			};

			// Make an API call to the backend to save the comic to the user's collection.
			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/comics",
				comicData
			);

			// Log the server response to confirm that the comic was successfully added.
			console.log("Server response:", response.data);
		} catch (error) {
			// If there's an error while adding the comic, it gets logged here.
			console.error("Error adding comic:", error);
		}
	};

	// This function is triggered when the user clicks the "Show More" button to load more comics.
	// It increments the page number to fetch the next set of comics.
	const handleShowMore = () => {
		setPage((prevPage) => prevPage + 1);
	};

	// This effect watches for changes in the `page` variable.
	// If `page` increases, it triggers another search to load more comics.
	React.useEffect(() => {
		if (page > 1) {
			handleSearch();
		}
		// eslint-disable-next-line
	}, [page]);

	// When the user clicks the search button, this function resets the page to 1 and starts a new search.
	const handleSearchButtonClick = () => {
		setPage(1);
		handleSearch(true);
	};

	// This function is triggered when a comic is clicked, setting it as the `selectedComic` and opening its details.
	const handleComicClick = (comic) => {
		setSelectedComic(comic);
	};

	// This function allows the user to press the "Enter" key to trigger the search, instead of clicking the button.
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
					{/* Input field where the user types in the name of the comic they want to search for. */}
					<input
						type="text"
						value={comicName}
						onChange={(e) => setComicName(e.target.value)}
						placeholder="Comic Name"
						className="search-input"
						onKeyPress={handleKeyPress} // Trigger the search when the user presses the "Enter" key.
					/>
					{/* Button that triggers the search when clicked. */}
					<button onClick={handleSearchButtonClick} className="search-button">
						Search
					</button>

					{/* If a search has been performed, display the results. */}
					{searchPerformed && (
						<div className="comics-shelf">
							{/* Loop through the fetched comics and display them as clickable items. */}
							{comics.length > 0 &&
								comics.map((comic, index) => (
									<div key={index} className="comic-item">
										{/* Clicking on the comic cover opens its details. */}
										<Link to="#" onClick={() => handleComicClick(comic)}>
											<img
												src={comic.image.original_url}
												alt={comic.name}
												className="comic-cover"
											/>
										</Link>
										{/* Button to add the comic to the user's collection. */}
										<button
											onClick={() => handleAdd(comic)}
											className="add-button">
											Add to Collection
										</button>
									</div>
								))}

							{/* If there are more comics to load, display the "Show More" button for pagination. */}
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
