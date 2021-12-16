const express = require('express');
const app = express();
const router = express.Router();
const HomeController = require('../controllers/HomeController');
const UserController = require('../controllers/UserController');
const adminAuth = require('./middlewares/adminAuth');

router.get("/", HomeController.index);
router.post("/user",UserController.create);
router.get("/user",UserController.index);
router.get("/user/:id",UserController.findUser);
router.put("/user",adminAuth, UserController.update);
router.delete("/user/:id",adminAuth, UserController.remove);
router.post('/recover',UserController.recover);
router.put("/changepassword",UserController.passwordChange);

module.exports = router;