const User = require("../models/user");
const PasswordToken = require("../models/PasswordToken");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'uifyqW1123*'

class UserController {
  async index(req,res){
    try{
      let users = await User.findAll();
      res.json(users);
    }catch(err){
      console.log(err);
      return;
    }
  }
  async create(req, res){
    let { email, name, password } = req.body;
    if (email == undefined){
        res.status(400);
        res.json({err: "email invalido"});
        return;
    }
    let emailExist = await User.findemail(email);
    if (emailExist) {
        res.status(406);
        res.json({err: "email já cadastrado"});
        return;
    }
    await User.create(email,password,name);
    res.status(200);
    res.send("vlw");
  }
  async findUser(req,res){
    let id = req.params.id;
    let user = await User.findById(id);
    if (user == undefined){
      res.status(404);
      res.json({err: `user with id:${id} could NOT be found`});
      return;
    }else{
      res.status(200);
      res.json(user);
    }
  }
  async update(req,res){
    let {id,name,role,email} = req.body;
    let result = await User.update(id,email,name,role);
    if(result != undefined){
      if(result.status){
        res.status(200);
        res.send("ok");
      }else{
        res.status(405);
        res.json(result);
      }
    }else{
      res.status(405);
      res.json(result);
    }
  }
  async remove(req,res){
    let id = req.params.id;
    let result = await User.delete(id);
    if (result.status){
      res.status(200);
      res.send('ok');
    }else{
      res.status(405);
      res.send(result.err);
    }
  }
  async recover(req,res){
    let email = req.body.email;
    let result = await PasswordToken.create(email);
    if (result.status){
      res.status(200);
      res.send(result.token);
      console.log(result.token);
    }else{
      res.status(406);
      res.send(result.err)
    }
  }
  async passwordChange(req,res){
    let token = req.body.token;
    let password = req.body.password;
    let valid = await PasswordToken.validate(token);
    if (valid.status){
      await User.changePassword(password,valid.token.user_id,valid.token.token);
      res.status(200);
      res.send("password has been changed")
    }else{
      res.status(406);
      res.send("invalid token");
    }
  }
  async login(req,res){
    let {email, password} = req.body;

    let user = await User.findByEmail(email);
    if (user != undefined){
      let result  = await bcrypt.compare(password,user.password);
      if (result){
        let token = jwt.sign({email: user.email, role: user.role},secret);
        res.status(200);
        res.json({token:token});
      }else{
        res.send("invalid password");
        res.status(404);
      }
    }else{
      res.send("invalid user");
      res.status(404);
    }
  }
}

module.exports = new UserController();
