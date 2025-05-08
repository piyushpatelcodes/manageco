const generateTempId = () => {
    // Generate a random 4-digit number and prepend "tempid"
    const timestamp = Date.now(); // Gets the current time in milliseconds
    return `tempid${timestamp}`;
};

export default generateTempId;