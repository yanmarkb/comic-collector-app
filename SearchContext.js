import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchPerformed, setSearchPerformed] = useState(false);

	return (
		<SearchContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				searchPerformed,
				setSearchPerformed,
			}}>
			{children}
		</SearchContext.Provider>
	);
};
