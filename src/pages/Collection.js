import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Collection.css";
import { FaEdit, FaPlus } from "react-icons/fa";

const Collection = ({ userId }) => {
	const [comics, setComics] = useState([]);
	const [editingComic, setEditingComic] = useState(null);
	const [collectionNumber, setCollectionNumber] = useState("");
	const [collectionName, setCollectionName] = useState("");
	const [libraryName, setLibraryName] = useState("");
	const [isEditingLibrary, setIsEditingLibrary] = useState(false);
	const [libraries, setLibraries] = useState([]);
	const [newLibraryName, setNewLibraryName] = useState("");
	const [showLibraryModal, setShowLibraryModal] = useState(false);

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

	const handleDelete = async (comicId) => {
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
		setIsEditingLibrary(false);
	};

	const handleEditLibrary = (comic) => {
		setEditingComic(comic);
		setLibraryName(comic.library_name || "");
		setIsEditingLibrary(true);
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
				<button
					className="add-library-button"
					onClick={() => setShowLibraryModal(true)}>
					<FaPlus />
				</button>
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
						<button
							onClick={() => handleDelete(comic.id)}
							className="delete-button">
							Delete
						</button>
					</div>
				))}
			</div>
			{Object.keys(groupedComics).map((libraryName) => {
				if (libraryName === "Recently Added") return null;
				const libraryComics = groupedComics[libraryName];

				return (
					<div key={libraryName} className="series-row">
						<h2>{libraryName}</h2>
						<div className="comics-series-shelf">
							{libraryComics.map((comic) => (
								<div key={comic.id} className="comic-item">
									<img
										src={comic.cover_image_url}
										alt={comic.title || "Unknown Title"}
										className="comic-cover"
									/>
									<FaEdit
										className="edit-icon"
										onClick={() => handleEditLibrary(comic)}
									/>
									<div className="comic-info">
										<h3>
											{comic.collection_name || comic.title || "Unknown Title"}{" "}
											- Issue #
											{comic.collection_number ||
												formatIssueNumber(comic.issue_number)}
											<FaEdit
												className="edit-icon"
												onClick={() => handleEdit(comic)}
											/>
										</h3>
									</div>
									<button
										onClick={() => handleDelete(comic.id)}
										className="delete-button">
										Delete
									</button>
								</div>
							))}
						</div>
					</div>
				);
			})}
			<h2>Your Libraries</h2>
			<div className="library-list">
				{libraries.map((library) => (
					<div key={library.id} className="library-row">
						<h3>{library.library_name}</h3>
					</div>
				))}
			</div>
			{editingComic && (
				<div className="edit-modal">
					<h2>Edit Comic</h2>
					{isEditingLibrary ? (
						<label>
							Library Name:
							<input
								type="text"
								value={libraryName}
								onChange={(e) => setLibraryName(e.target.value)}
							/>
						</label>
					) : (
						<>
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
						</>
					)}
					<button onClick={handleSave} className="save-button">
						Save
					</button>
					<button
						onClick={() => setEditingComic(null)}
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
		</div>
	);
};

export default Collection;
