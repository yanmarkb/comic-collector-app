import React, { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = ({ userId }) => {
	const [wishlist, setWishlist] = useState([]);

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const response = await axios.get(
					`https://backend-comic-collector-app.onrender.com
/api/wishlist/${userId}`
				);
				setWishlist(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchWishlist();
	}, [userId]);

	return (
		<div>
			<h1>My Wishlist</h1>
			<ul>
				{wishlist.map((item) => (
					<li key={item.id}>
						<h2>{item.comics.title}</h2>
						<img src={item.comics.cover_image_url} alt={item.comics.title} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default Wishlist;
