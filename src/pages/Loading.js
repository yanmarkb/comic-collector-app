import React from "react";
import "./Loading.css";

const Loading = () => {
	return (
		<div className="loading-container">
			<p>
				One Second<span className="dot">.</span>
				<span className="dot">.</span>
				<span className="dot">.</span>
			</p>
		</div>
	);
};

export default Loading;
