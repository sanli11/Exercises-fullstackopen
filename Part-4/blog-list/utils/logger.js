const info = (...params) => {
  console.log("====================================");
  console.log(...params);
  console.log("====================================");
};

const error = (...params) => {
  console.error("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  console.error(...params);
  console.error("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
};

module.exports = { info, error };
