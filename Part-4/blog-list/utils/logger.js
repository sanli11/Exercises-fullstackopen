/* eslint-disable no-undef */
const info = (...params) => {
	if (process.env.NODE_ENV !== "test") {
		console.log("====================================");
		console.log(...params);
		console.log("====================================");
	}
};

const error = (...params) => {
	if (process.env.NODE_ENV !== "test") {
		console.error("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
		console.error(...params);
		console.error("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
	}
};

module.exports = { info, error };
