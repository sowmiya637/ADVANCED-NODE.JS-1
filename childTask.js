// simulate an external task, e.g., call another script or heavy operation
process.on("message", (data) => {
  // just reverse a string after delay
  setTimeout(() => {
    process.send(data.split("").reverse().join(""));
  }, 2000);
});
