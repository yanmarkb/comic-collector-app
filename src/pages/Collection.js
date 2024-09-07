import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaMinus, FaEdit } from "react-icons/fa";
import ComicDetails from "./ComicDetails";
import "./Collection.css";

const Collection = () => {
	const [comics, setComics] = useState([]);
	const [editingComic, setEditingComic] = useState(null);
	const [collectionNumber, setCollectionNumber] = useState("");
	const [collectionName, setCollectionName] = useState("");
	const [libraryName, setLibraryName] = useState("");
	const [libraries, setLibraries] = useState([]);
	const [newLibraryName, setNewLibraryName] = useState("");
	const [showLibraryModal, setShowLibraryModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditLibraryModal, setShowEditLibraryModal] = useState(false);
	const [hasLibraries, setHasLibraries] = useState(false);
	const [emptyLibraryText, setEmptyLibraryText] = useState("");
	const [selectedComic, setSelectedComic] = useState(null);

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

	const getRandomPhrase = () => {
		return emptyLibraryPhrases[
			Math.floor(Math.random() * emptyLibraryPhrases.length)
		];
	};

	useEffect(() => {
		const fetchComics = async () => {
			try {
				const userId = localStorage.getItem("userId");
				const response = await axios.get(
					`https://backend-comic-collector-app.onrender.com/api/collection/${userId}`
				);

				// Map through the response data and flatten it to easily access comic details
				const comicsData = response.data.map((collection) => ({
					...collection.comics, // Extract comic details from the related table
					collection_id: collection.comic_id, // Keep track of collection info
				}));

				setComics(comicsData);
			} catch (error) {
				console.error("Error fetching comics:", error);
			}
		};

		const fetchLibraries = async () => {
			try {
				const userId = localStorage.getItem("userId");
				const response = await axios.get(
					`https://backend-comic-collector-app.onrender.com/api/libraries/${userId}`
				);
				setLibraries(response.data);
				setHasLibraries(response.data.length > 0);
				if (response.data.length === 0) {
					setEmptyLibraryText(getRandomPhrase());
				}
			} catch (error) {
				console.error("Error fetching libraries:", error);
			}
		};

		fetchComics();
		fetchLibraries();
	}, []);

	useEffect(() => {
		const updateOverflow = () => {
			document.body.style.overflow = hasLibraries ? "auto" : "hidden";
		};

		updateOverflow();

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [hasLibraries]);

	const handleCreateLibrary = async () => {
		try {
			const userId = localStorage.getItem("userId");
			const response = await axios.post(
				"https://backend-comic-collector-app.onrender.com/api/libraries",
				{
					userId,
					libraryName: newLibraryName,
				}
			);
			setLibraries((prevLibraries) => [...prevLibraries, response.data]);
			setShowLibraryModal(false);
		} catch (error) {
			console.error("Error creating library:", error);
		}
	};

	const handleDeleteLibrary = async (libraryId) => {
		try {
			await axios.delete(
				`https://backend-comic-collector-app.onrender.com/api/libraries/${libraryId}`
			);
			setLibraries((prevLibraries) =>
				prevLibraries.filter((library) => library.id !== libraryId)
			);
			setShowDeleteModal(false);
		} catch (error) {
			console.error("Error deleting library:", error);
		}
	};

	const handleDeleteComic = async (comicId) => {
		try {
			const userId = localStorage.getItem("userId");
			await axios.delete(
				`https://backend-comic-collector-app.onrender.com/api/collection/${userId}/${comicId}`
			);
			setComics((prevComics) =>
				prevComics.filter((comic) => comic.id !== comicId)
			);
		} catch (error) {
			console.error("Error deleting comic:", error);
		}
	};

	const handleEdit = (comic) => {
		setEditingComic(comic);
		setCollectionNumber(comic.collection_number || comic.issue_number || "");
		setCollectionName(comic.collection_name || comic.title);
		setLibraryName(comic.library_name || "");
		setShowEditLibraryModal(true);
	};

	const handleSave = async () => {
		try {
			const userId = localStorage.getItem("userId");
			await axios.put(
				`https://backend-comic-collector-app.onrender.com/api/collection/${userId}/${editingComic.id}`,
				{
					collection_number: collectionNumber,
					collection_name: collectionName,
					library_name: libraryName,
				}
			);
			setComics((prevComics) =>
				prevComics.map((comic) =>
					comic.id === editingComic.id
						? {
								...comic,
								collection_number: collectionNumber,
								collection_name: collectionName,
								library_name: libraryName,
						  }
						: comic
				)
			);
			setShowEditLibraryModal(false);
		} catch (error) {
			console.error("Error saving comic:", error);
		}
	};

	const formatIssueNumber = (issueNumber) => {
		return issueNumber ? issueNumber.replace(/\D/g, "") : "N/A";
	};

	const groupedComics = comics.reduce((acc, comic) => {
		const libraryName = comic.library_name || "Recently Added";
		if (!acc[libraryName]) {
			acc[libraryName] = [];
		}
		acc[libraryName].push(comic);
		return acc;
	}, {});

	for (const libraryName in groupedComics) {
		groupedComics[libraryName].sort((a, b) => {
			const issueA = parseInt(a.collection_number || a.issue_number || "0", 10);
			const issueB = parseInt(b.collection_number || b.issue_number || "0", 10);
			return issueA - issueB;
		});
	}

	const handleAssignToLibrary = async (comicId, libraryName) => {
		try {
			const userId = localStorage.getItem("userId");
			await axios.put(
				`https://backend-comic-collector-app.onrender.com/api/collection/${userId}/${comicId}`,
				{ library_name: libraryName }
			);
			setComics((prevComics) =>
				prevComics.map((comic) =>
					comic.id === comicId ? { ...comic, library_name: libraryName } : comic
				)
			);
		} catch (error) {
			console.error("Error assigning comic to library:", error);
		}
	};

	const handleComicClick = (comic) => {
		setSelectedComic(comic);
	};

	const closeModal = () => {
		setSelectedComic(null);
	};

	return (
		<div
			className={`collection-container ${
				hasLibraries ? "has-libraries" : "no-libraries"
			}`}>
			<h1 className="my-collection">My Collection</h1>
			<div className="action-buttons">
				<button
					className="add-library-button"
					onClick={() => setShowLibraryModal(true)}>
					<FaPlus />
				</button>
				<button
					className="delete-library-button"
					onClick={() => setShowDeleteModal(true)}>
					<FaMinus />
				</button>
			</div>

			{groupedComics["Recently Added"] &&
				groupedComics["Recently Added"].length > 0 && (
					<div>
						<div className="top-bar">
							<h2>Recently Added:</h2>
						</div>
						<div className="recently-added-row">
							{groupedComics["Recently Added"]?.map((comic) => (
								<div className="comic-item">
									<img
										src={comic.cover_image_url || "default-image-url"} // Add a fallback if no image
										alt={comic.title || "Unknown Title"}
										className="comic-cover"
										onClick={() => handleComicClick(comic)}
									/>
									<div className="comic-info">
										<h3>{comic.title || "Unknown Title"}</h3>
										<p>Issue #{comic.issue_number || "N/A"}</p>
										<p>Publisher: {comic.publisher || "Unknown Publisher"}</p>
									</div>
									<button
										onClick={() => handleEdit(comic)}
										className="edit-button">
										<FaEdit />
									</button>
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
											<div key={comic.id} className="comic-item">
												<img
													src={comic.cover_image_url}
													alt={
														comic.collection_name ||
														comic.title ||
														"Unknown Title"
													}
													className="comic-cover"
													onClick={() => handleComicClick(comic)}
												/>
												<div className="comic-info">
													<h3>
														{comic.collection_name ||
															comic.title ||
															"Unknown Title"}
													</h3>
													<p>
														Issue #
														{formatIssueNumber(
															comic.collection_number || comic.issue_number
														)}
													</p>
												</div>
												<button
													onClick={() => handleEdit(comic)}
													className="edit-button">
													<FaEdit />
												</button>
												<button
													onClick={() => handleDeleteComic(comic.id)}
													className="delete-button">
													Delete
												</button>
											</div>
										))
									) : (
										<p>{emptyLibraryText}</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p>{emptyLibraryText}</p>
			)}

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
