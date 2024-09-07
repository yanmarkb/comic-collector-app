import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaMinus, FaEdit } from "react-icons/fa";
import ComicDetails from "./ComicDetails";
import "./Collection.css";

const Collection = () => {
	// This section is all about managing state. We store the comics, the currently editing comic,
	// the collection number and name, the libraries the user has, and a few boolean flags to control UI visibility.
	const [comics, setComics] = useState([]); // This stores the list of comics currently in the collection.
	const [editingComic, setEditingComic] = useState(null); // This keeps track of the comic being edited.
	const [collectionNumber, setCollectionNumber] = useState(""); // This stores the issue/volume number when editing.
	const [collectionName, setCollectionName] = useState(""); // This stores the comic's name during editing.
	const [libraryName, setLibraryName] = useState(""); // This stores the library name when editing.
	const [libraries, setLibraries] = useState([]); // This holds all the user's libraries.
	const [newLibraryName, setNewLibraryName] = useState(""); // Stores the name for a new library being created.
	const [showLibraryModal, setShowLibraryModal] = useState(false); // Controls the visibility of the 'create library' modal.
	const [showDeleteModal, setShowDeleteModal] = useState(false); // Controls the visibility of the 'delete library' modal.
	const [showEditLibraryModal, setShowEditLibraryModal] = useState(false); // Controls the visibility of the 'edit comic' modal.
	const [hasLibraries, setHasLibraries] = useState(false); // Tracks if there are any libraries created by the user.
	const [emptyLibraryText, setEmptyLibraryText] = useState(""); // Displays a random message when no comics are in a library.
	const [selectedComic, setSelectedComic] = useState(null); // Stores the comic clicked by the user to show its details.

	// Fun array of random phrases to display when the library is empty. Adds some personality to the app.
	const emptyLibraryPhrases = [
		"Great Scott! No Comics in this Multiverse...",
		"Holy Empty Shelves, Batman! No Comics Here...",
		"With Great Power Comes... No Comics Here?",
		"No Comics Found, Bub! Keep Searching...",
		"It's Clobberin' Time... to Admit There's No Comics Here!",
		"By Odin's Beard! The Comics Are Gone!",
		"Up, Up, and Away... But No Comics Today!",
		"Excelsior! But Sadly, No Comics Here...",
		"Avengers Assemble... After Finding Some Comics!",
		"This Looks Like a Job for... More Comics!",
	];

	// Helper function to grab a random empty library phrase from the list above.
	const getRandomPhrase = () => {
		return emptyLibraryPhrases[
			Math.floor(Math.random() * emptyLibraryPhrases.length)
		];
	};

	// Fetches the comics for the user when the component first mounts. It grabs the user ID from local storage,
	// and makes an API call to fetch all the user's comics from the backend.
	useEffect(() => {
		const fetchComics = async () => {
			try {
				const userId = localStorage.getItem("userId"); // Get the user ID stored in local storage.
				const response = await axios.get(
					`https://backend-comic-collector-app.onrender.com/api/collection/${userId}`
				);

				// Maps through the data returned from the backend and prepares it for easy access.
				const comicsData = response.data.map((collection) => ({
					...collection.comics,
					comic_id: collection.id, // Keep track of the collection's unique ID.
					collection_name: collection.collection_name, // Custom collection name from the user.
					collection_number: collection.collection_number, // Custom issue or volume number.
				}));

				setComics(comicsData); // Store the fetched comics in state.
			} catch (error) {
				// Log any errors that occur while fetching the comics.
				console.error("Error fetching comics:", error);
			}
		};

		// Fetches all the libraries created by the user. Just like with the comics, we get the user ID
		// from local storage and then use it to make an API request.
		const fetchLibraries = async () => {
			try {
				const userId = localStorage.getItem("userId"); // Retrieve the user ID from local storage.
				const response = await axios.get(
					`https://backend-comic-collector-app.onrender.com/api/libraries/${userId}`
				);

				// Set the libraries into state and check if there are any existing libraries.
				setLibraries(response.data);
				setHasLibraries(response.data.length > 0); // If there are libraries, set this flag to true.

				// If no libraries exist, show a random empty library message.
				if (response.data.length === 0) {
					setEmptyLibraryText(getRandomPhrase());
				}
			} catch (error) {
				// Log any errors that occur while fetching the libraries.
				console.error("Error fetching libraries:", error);
			}
		};

		// Calls both functions when the component mounts to fetch comics and libraries at the same time.
		fetchComics();
		fetchLibraries();
	}, []);

	// This effect controls whether the page should scroll or not based on whether there are libraries.
	useEffect(() => {
		const updateOverflow = () => {
			document.body.style.overflow = hasLibraries ? "auto" : "hidden"; // If no libraries, hide the scroll.
		};

		updateOverflow();

		return () => {
			document.body.style.overflow = "auto"; // When component unmounts, reset overflow to 'auto'.
		};
	}, [hasLibraries]);

	// Function for creating a new library. We grab the user ID from local storage, take the library name
	// entered by the user, and send it to the backend via an API request.
	const handleCreateLibrary = async () => {
		try {
			const userId = localStorage.getItem("userId"); // Get the user ID from local storage.
			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/libraries",
				{
					userId,
					libraryName: newLibraryName, // The name for the new library.
				}
			);

			// Once the library is successfully created, add it to the existing list of libraries in state.
			setLibraries((prevLibraries) => [...prevLibraries, response.data]);
			setShowLibraryModal(false); // Close the "Create Library" modal.
		} catch (error) {
			// Log any errors that occur during the creation process.
			console.error("Error creating library:", error);
		}
	};

	// This function deletes a library by its ID. We make a DELETE request to the backend to remove it,
	// and filter out the deleted library from our state to keep things up to date.
	const handleDeleteLibrary = async (libraryId) => {
		try {
			await axios.delete(
				`https://backend-comic-collector-app.onrender.com/api/libraries/${libraryId}`
			);

			// Update the state to remove the deleted library.
			setLibraries((prevLibraries) =>
				prevLibraries.filter((library) => library.id !== libraryId)
			);
			setShowDeleteModal(false); // Close the delete modal after removing the library.
		} catch (error) {
			// Log any errors that occur during the deletion process.
			console.error("Error deleting library:", error);
		}
	};

	// Function to delete a comic by its ID. Similar to the library delete function, this sends a DELETE request
	// to the backend and then removes the deleted comic from our list in state.
	const handleDeleteComic = async (comicId) => {
		try {
			const userId = localStorage.getItem("userId"); // Get the user ID from local storage.
			await axios.delete(
				`https://backend-comic-collector-app.onrender.com/api/collection/${userId}/${comicId}`
			);

			// Filter out the deleted comic from the current list of comics in state.
			setComics((prevComics) =>
				prevComics.filter((comic) => comic.comic_id !== comicId)
			);
		} catch (error) {
			// Log any errors that occur during the deletion process.
			console.error("Error deleting comic:", error);
		}
	};

	// Function to edit a comic's details. This sets up the form for editing by populating the fields
	// with the comic's existing information (like its collection number, name, and library).
	const handleEdit = (comic) => {
		setEditingComic({
			...comic,
			comic_id: comic.comic_id || comic.id, // Ensure the correct comic ID is passed.
		});
		setCollectionNumber(comic.collection_number || comic.issue_number || ""); // Set the issue/volume number.
		setCollectionName(comic.collection_name || comic.title); // Set the comic's title.
		setLibraryName(comic.library_name || ""); // Set the library name.
		setShowEditLibraryModal(true); // Open the "Edit Comic" modal.
	};

	// This function saves the edited comic details to the backend. It takes the comic's updated collection number,
	// name, and library, and updates the comic in the backend using a PUT request.
	const handleSave = async () => {
		try {
			const userId = localStorage.getItem("userId"); // Get the user ID from local storage.
			await axios.put(
				`https://backend-comic-collector-app.onrender.com/api/collection/${userId}/${editingComic.comic_id}`,
				{
					collection_number: collectionNumber,
					collection_name: collectionName,
					library_name: libraryName,
				}
			);

			// Update the list of comics in state with the newly edited details.
			setComics((prevComics) =>
				prevComics.map((comic) =>
					comic.comic_id === editingComic.comic_id
						? {
								...comic,
								collection_number: collectionNumber,
								collection_name: collectionName,
								library_name: libraryName,
						  }
						: comic
				)
			);
			setShowEditLibraryModal(false); // Close the "Edit Comic" modal after saving.
		} catch (error) {
			// Log any errors that occur during the save process.
			console.error("Error saving comic:", error);
		}
	};

	// Helper function to format the issue number by stripping out non-numeric characters.
	const formatIssueNumber = (issueNumber) => {
		return issueNumber ? issueNumber.replace(/\D/g, "") : "N/A"; // If no issue number, return "N/A".
	};

	// Group the comics by their libraries for easy display in the UI. Each comic is organized under
	// its respective library name, or default to "Recently Added" if no library is assigned.
	const groupedComics = comics.reduce((acc, comic) => {
		const libraryName = comic.library_name || "Recently Added"; // Default to "Recently Added" if no library is set.
		if (!acc[libraryName]) {
			acc[libraryName] = [];
		}
		acc[libraryName].push({
			...comic,
			displayTitle: comic.collection_name || comic.title || "Unknown Title", // Use collection name or title.
			displayNumber: comic.collection_number || comic.issue_number || "N/A", // Use collection number or issue number.
		});
		return acc;
	}, {});

	// Sorts comics in each library by their issue/volume number in ascending order for better organization.
	for (const libraryName in groupedComics) {
		groupedComics[libraryName].sort((a, b) => {
			const issueA = parseInt(a.collection_number || a.issue_number || "0", 10);
			const issueB = parseInt(b.collection_number || b.issue_number || "0", 10);
			return issueA - issueB;
		});
	}

	// Assigns a comic to a specific library when the user changes its library via the UI.
	const handleAssignToLibrary = async (comicId, libraryName) => {
		try {
			const userId = localStorage.getItem("userId"); // Get the user ID from local storage.
			await axios.put(
				`https://backend-comic-collector-app.onrender.com/api/collection/${userId}/${comicId}`,
				{ library_name: libraryName } // Send the updated library name.
			);

			// Update the state to reflect the new library assignment.
			setComics((prevComics) =>
				prevComics.map((comic) =>
					comic.comic_id === comicId
						? { ...comic, library_name: libraryName }
						: comic
				)
			);
		} catch (error) {
			// Log any errors that occur during the library assignment process.
			console.error("Error assigning comic to library:", error);
		}
	};

	// Opens the modal to show comic details when a user clicks on a comic.
	const handleComicClick = (comic) => {
		setSelectedComic(comic); // Set the selected comic to display its details.
	};

	// Closes the comic details modal when the user is done viewing the comic.
	const closeModal = () => {
		setSelectedComic(null); // Clear the selected comic from state.
	};

	return (
		<div
			className={`collection-container ${
				hasLibraries ? "has-libraries" : "no-libraries"
			}`}>
			<h1 className="my-collection">My Collection</h1>
			<div className="action-buttons">
				{/* Button to open the modal to create a new library */}
				<button
					className="add-library-button"
					onClick={() => setShowLibraryModal(true)}
					aria-label="Add Library">
					<FaPlus />
				</button>
				{/* Button to open the modal to delete a library */}
				<button
					className="delete-library-button"
					onClick={() => setShowDeleteModal(true)}>
					<FaMinus />
				</button>
			</div>

			{/* Displays the "Recently Added" section if there are comics in that category */}
			{groupedComics["Recently Added"] &&
				groupedComics["Recently Added"].length > 0 && (
					<div>
						<div className="top-bar">
							<h2>Recently Added:</h2>
						</div>
						<div className="recently-added-row">
							{groupedComics["Recently Added"]?.map((comic) => (
								<div className="comic-item" key={comic.collection_id}>
									<img
										src={comic.cover_image_url || "default-image-url"} // Use a default image if no comic cover is available.
										alt={
											comic.collection_name || comic.title || "Unknown Title"
										}
										className="comic-cover"
										onClick={() => handleComicClick(comic)} // Show comic details when clicked.
									/>
									<div className="comic-info">
										{/* Display comic title */}
										<h3>
											{comic.collection_name || comic.title || "Unknown Title"}
										</h3>
										{/* Display comic issue number */}
										<p>
											Issue #
											{comic.collection_number || comic.issue_number || "N/A"}
										</p>
										<p>Publisher: {comic.publisher || "Unknown Publisher"}</p>
									</div>
									{/* Button to edit the comic */}
									<button
										onClick={() => handleEdit(comic)}
										className="edit-button"
										aria-label="Edit">
										<FaEdit />
									</button>
									{/* Button to delete the comic */}
									<button
										onClick={() => handleDeleteComic(comic.collection_id)}
										className="delete-button">
										Delete
									</button>
								</div>
							))}
						</div>
					</div>
				)}

			{/* Displays the user's libraries and the comics within each library */}
			{libraries.length > 0 ? (
				<div>
					<h2>Your Libraries:</h2>
					{libraries.map((library) => {
						const libraryComics = groupedComics[library.library_name] || [];
						return (
							<div key={library.id} className="library-section">
								<h3>{library.library_name}</h3>
								<div className="library-comics-row">
									{libraryComics.length > 0 ? (
										libraryComics.map((comic) => (
											<div key={comic.comic_id} className="comic-item">
												<img
													src={comic.cover_image_url}
													alt={
														comic.collection_name ||
														comic.title ||
														"Unknown Title"
													}
													className="comic-cover"
													onClick={() => handleComicClick(comic)} // Show comic details when clicked.
												/>
												<div className="comic-info">
													{/* Display comic title */}
													<h3>{comic.displayTitle}</h3>
													{/* Display formatted issue number */}
													<p>Issue #{formatIssueNumber(comic.displayNumber)}</p>
												</div>
												{/* Button to edit the comic */}
												<button
													onClick={() => handleEdit(comic)}
													className="edit-button">
													<FaEdit />
												</button>
												{/* Button to delete the comic */}
												<button
													onClick={() => handleDeleteComic(comic.comic_id)}
													className="delete-button">
													Delete
												</button>
											</div>
										))
									) : (
										<p>{emptyLibraryText}</p> // Show empty library message if no comics are present.
									)}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p>{emptyLibraryText}</p> // Display a fun message if no libraries exist yet.
			)}

			{/* Edit comic modal */}
			{showEditLibraryModal && editingComic && (
				<div className="edit-modal">
					<h2>Edit Comic</h2>
					<label>
						Comic Name:
						<input
							type="text"
							value={collectionName}
							onChange={(e) => setCollectionName(e.target.value)}
						/>
					</label>
					<label>
						Issue/Volume Number:
						<input
							type="text"
							value={collectionNumber}
							onChange={(e) => setCollectionNumber(e.target.value)}
						/>
					</label>
					<label>
						Select Library:
						<select
							value={libraryName}
							onChange={(e) => setLibraryName(e.target.value)}>
							<option value="">Select Library</option>
							{libraries.map((library) => (
								<option key={library.id} value={library.library_name}>
									{library.library_name}
								</option>
							))}
						</select>
					</label>
					<button onClick={handleSave} className="save-button">
						Save
					</button>
					<button
						onClick={() => setShowEditLibraryModal(false)}
						className="cancel-button">
						Cancel
					</button>
				</div>
			)}

			{/* Create library modal */}
			{showLibraryModal && (
				<div className="edit-modal">
					<h2>Create New Library</h2>
					<label>
						Library Name:
						<input
							type="text"
							value={newLibraryName}
							onChange={(e) => setNewLibraryName(e.target.value)}
						/>
					</label>
					<button onClick={handleCreateLibrary} className="save-button">
						Create
					</button>
					<button
						onClick={() => setShowLibraryModal(false)}
						className="cancel-button">
						Cancel
					</button>
				</div>
			)}

			{/* Delete library modal */}
			{showDeleteModal && (
				<div className="delete-modal">
					<h2>Delete a Library</h2>
					<ul>
						{libraries.map((library) => (
							<li key={library.id} className="library-delete-item">
								<span>{library.library_name}</span>
								<button
									className="delete-button"
									onClick={() => handleDeleteLibrary(library.id)}>
									Delete
								</button>
							</li>
						))}
					</ul>
					<button
						className="cancel-button"
						onClick={() => setShowDeleteModal(false)}>
						Close
					</button>
				</div>
			)}

			{/* Comic details modal */}
			{selectedComic && (
				<div className="comic-details-modal">
					<div className="comic-details-overlay" onClick={closeModal}></div>
					<div className="comic-details-content">
						<ComicDetails comic={selectedComic} onClose={closeModal} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Collection;
