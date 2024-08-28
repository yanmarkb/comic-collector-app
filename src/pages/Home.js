import React, { useEffect, useState } from "react";
import { fetchComics } from "../services/comicVineService";
import Loading from "./Loading";
import "./Home.css";

const Home = () => {
	const [comics, setComics] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getComics = async () => {
			const comicCovers = await fetchComics();
			console.log("Fetched Comics:", comicCovers);
			setComics(shuffleArray(comicCovers));
			setLoading(false);
		};

		getComics();
	}, []);

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
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
		<div className="home">
			{renderRow(comics.slice(0, 10), 30)}
			{renderRow(comics.slice(10, 20), 35)}
			{renderRow(comics.slice(20, 30), 40)}
		</div>
	);
};

export default Home;
