import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Collection.css";
import { FaEdit, FaPlus, FaMinus } from "react-icons/fa";

const Collection = ({ userId }) => {
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
				const response = await axios.get(
					`http://localhost:5000/api/collection/${userId}`
				);
				setComics(response.data);
			} catch (error) {
				console.error("Error fetching collection:", error);
			}
		};

		const fetchLibraries = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/libraries/${userId}`
				);
				setLibraries(response.data);
			} catch (error) {
				console.error("Error fetching libraries:", error);
			}
		};

		fetchComics();
		fetchLibraries();
	}, [userId]);

	const handleCreateLibrary = async () => {
		try {
			const response = await axios.post(`http://localhost:5000/api/libraries`, {
				userId,
				libraryName: newLibraryName,
			});
			setLibraries([...libraries, response.data]);
			setShowLibraryModal(false);
			setNewLibraryName("");
		} catch (error) {
			console.error("Error creating library:", error);
		}
	};

	const handleDeleteLibrary = async (libraryId) => {
		try {
			await axios.delete(`http://localhost:5000/api/libraries/${libraryId}`);
			setLibraries(libraries.filter((library) => library.id !== libraryId));
		} catch (error) {
			console.error("Error deleting library:", error);
		}
	};

	const handleDeleteComic = async (comicId) => {
		try {
			await axios.delete(
				`http://localhost:5000/api/collection/${userId}/${comicId}`
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
		setCollectionNumber(comic.collection_number || "");
		setCollectionName(comic.collection_name || comic.title);
		setLibraryName(comic.library_name || "");
		setShowEditLibraryModal(true);
	};

	const handleSave = async () => {
		try {
			const updatedComic = {
				...editingComic,
				collection_number: collectionNumber,
				collection_name: collectionName,
				library_name: libraryName,
			};

			await axios.put(
				`http://localhost:5000/api/collection/${userId}/${editingComic.id}`,
				updatedComic
			);

			setComics((prevComics) =>
				prevComics.map((comic) =>
					comic.id === editingComic.id ? updatedComic : comic
				)
			);
			setEditingComic(null);
			setShowEditLibraryModal(false);
		} catch (error) {
			console.error("Error updating comic:", error);
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

	const handleAssignToLibrary = async (comicId, libraryName) => {
		try {
			await axios.put(
				`http://localhost:5000/api/collection/${userId}/${comicId}`,
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

	return (
		<div className="collection-container">
			<h1>My Collection</h1>
			<div className="top-bar">
				<h2>Recently Added:</h2>

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
			</div>
			<div className="recently-added-row">
				{groupedComics["Recently Added"]?.map((comic) => (
					<div key={comic.id} className="comic-item">
						<img
							src={comic.cover_image_url}
							alt={comic.title || "Unknown Title"}
							className="comic-cover"
						/>
						<div className="comic-info">
							<h3>{comic.title || "Unknown Title"}</h3>
							<select
								value={comic.library_name || ""}
								onChange={(e) =>
									handleAssignToLibrary(comic.id, e.target.value)
								}>
								<option value="">Select Library</option>
								{libraries.map((library) => (
									<option key={library.id} value={library.library_name}>
										{library.library_name}
									</option>
								))}
							</select>
						</div>
						<button onClick={() => handleEdit(comic)} className="edit-button">
							<FaEdit />
						</button>
						<button
							onClick={() => handleDeleteComic(comic.id)}
							className="delete-button">
							Delete
						</button>
					</div>
				))}
			</div>
			<h2>Your Libraries:</h2>
			{libraries.map((library) => {
				const libraryComics = groupedComics[library.library_name] || [];
				return (
					<div key={library.id} className="series-row">
						<h2>{library.library_name}</h2>
						<div className="comics-series-shelf">
							{libraryComics.length > 0 ? (
								libraryComics.map((comic) => (
									<div key={comic.id} className="comic-item">
										<img
											src={comic.cover_image_url}
											alt={comic.title || "Unknown Title"}
											className="comic-cover"
										/>
										<div className="comic-info">
											<h3>
												{comic.collection_name ||
													comic.title ||
													"Unknown Title"}{" "}
												- Issue #
												{comic.collection_number ||
													formatIssueNumber(comic.issue_number)}
											</h3>
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
								<p>{getRandomPhrase()}</p>
							)}
						</div>
					</div>
				);
			})}
			{showEditLibraryModal && editingComic && (
				<div className="edit-modal">
					<h2>Edit Comic</h2>
					<label>
						Collection Name:
						<input
							type="text"
							value={collectionName}
							onChange={(e) => setCollectionName(e.target.value)}
						/>
					</label>
					<label>
						Collection Number:
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
		</div>
	);
};

export default Collection;

// THIS IS WHERE YOU STOPPED ON 9/15/21. Make sure to finish the Collection Page
