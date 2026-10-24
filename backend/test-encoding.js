require('dotenv').config();
const { URL } = require('url');

const uri = process.env.MONGO_URI;

try {
  const parsedUri = new URL(uri);
  const password = parsedUri.password;
  
  // A URL-encoded password will NOT contain raw special characters like @, #, ?, &, =, etc.
  // except for % which is used in encoding.
  // We can test if decodeURIComponent(password) is different from password
  
  const decoded = decodeURIComponent(password);
  
  console.log("Checking for URL encoding issues in password...");
  if (password === decoded) {
    console.log("The password in the URI does NOT contain any URL-encoded characters (or it doesn't need them).");
    // Check for illegal characters in raw password
    const illegalChars = ['@', ':', '/', '?', '#', '[', ']', '@', '!'];
    const foundIllegal = illegalChars.filter(char => password.includes(char));
    
    if (foundIllegal.length > 0) {
      console.log("WARNING: Found illegal raw characters in password that must be URL-encoded!");
      console.log("Illegal characters found: " + foundIllegal.join(', '));
    } else {
      console.log("No illegal raw characters found in password.");
    }
  } else {
    console.log("The password is URL encoded. (This is good).");
  }

} catch (e) {
  console.log("Error:", e.message);
}
