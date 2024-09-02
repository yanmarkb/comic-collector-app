import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [comicName, setComicName] = useState("");

	return (
		<SearchContext.Provider
			value={{ searchQuery, setSearchQuery, comicName, setComicName }}>
			{children}
		</SearchContext.Provider>
	);
};
