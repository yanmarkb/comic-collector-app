import React from "react";
import "./Loading.css";

// This is the Loading component. It's a simple functional component that displays
// a loading message while the app is waiting for some data or performing an action.
// The loading message will show "One Second..." with three dots animating.
const Loading = () => {
	return (
		// The main container for the loading message. The class "loading-container" is applied,
		// and the styling for this is handled in the "Loading.css" file.
		<div className="loading-container">
			{/* Here’s the message that will be shown to the user. It says "One Second..."
				and includes three dots. The dots will animate (more on that in the CSS). */}
			<p>
				One Second
				{/* Each of these span elements represents one dot in the loading animation. 
					The dots will have the "dot" class applied, and they'll animate separately 
					thanks to the CSS styling. */}
				<span className="dot">.</span>
				<span className="dot">.</span>
				<span className="dot">.</span>
			</p>
		</div>
	);
};

export default Loading;
