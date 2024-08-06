import React, { useEffect, useState } from "react";
import { fetchComics } from "../services/comicVineService";
import "./Home.css";

const Home = () => {
	const [comics, setComics] = useState([]);

	useEffect(() => {
		const getComics = async () => {
			const comicCovers = await fetchComics();
			console.log("Fetched Comics:", comicCovers);
			setComics(comicCovers);
		};

		getComics();
	}, []);

	const renderRow = (comics, reverse = false) => (
		<div className={`comic-row ${reverse ? "reverse" : ""}`}>
			{comics.concat(comics).map((comic) => (
				<img key={comic.id} src={comic.image.original_url} alt={comic.name} />
			))}
		</div>
	);

	return (
		<div className="home">
			{renderRow(comics.slice(0, 20))}
			{renderRow(comics.slice(20, 40), true)}
			{renderRow(comics.slice(40, 60))}
		</div>
	);
};

export default Home;
