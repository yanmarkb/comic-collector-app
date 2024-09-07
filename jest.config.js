module.exports = {
	transform: {
		"^.+\\.jsx?$": "babel-jest",
	},
	transformIgnorePatterns: ["/node_modules/(?!axios)/"],
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};
