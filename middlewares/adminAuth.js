const jwt = require("jsonwebtoken");
const secret = "uifyqW1123*";
module.exports = (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    try {
      let decoded = jwt.verify(token, secret);
      if (decoded.role == 1){
        next();
      }else{
        res.status(403);
        res.send("you must be an admin to acess");
      }
    } catch (err) {
      res.status(403);
      res.send("you must be an admin to acess");
    }
  } else {
    res.status(403);
    res.send("you must be an admin to acess");
  }
};
