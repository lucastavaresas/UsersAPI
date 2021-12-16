const connection = require("../database/connection");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const PasswordToken = require("./PasswordToken");

class User {
  async create(email, password, name) {
    try {
      const hash = await bcrypt.hash(password, 10);
      await connection
        .insert({ email, password: hash, name, role: 0 })
        .table("users");
    } catch (err) {
      console.log(err);
    }
  }
  async findemail(email) {
    try {
      let result = await connection
        .select()
        .from("users")
        .where({ email: email });
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async findAll() {
    try {
      let result = connection.select("name", "email", "role", "id").table("users");
      return result;
    } catch(err){
      console.log(err);
      return [];
    }
  }
  async findById(id){
    try{
      let result = await connection.select(["name","email","id","role"]).where({id: id}).table("users");
      if(result.length > 0){
        return result[0];
      }else{
        return undefined;
      }
    }catch(err){
      console.log(err);
      return undefined;
    }
  }
  async findByEmail(email){
    try{
      let result = await connection.select(["name","email","id","role","password"]).where({email: email}).table("users");
      if(result.length > 0){
        return result[0];
      }else{
        return undefined;
      }
    }catch(err){
      console.log(err);
      return undefined;
    }
  }
  async update(id,email,name,role){
    let user = await this.findById(id);
    if (user != undefined){
      let editUser = {}
      if (email != undefined){
        if(email != user.email){
          let result = await this.findemail(email);
          if (result == false){
            editUser.email = email;
          }else{
            return {status: false, err:"This is already your email"}
          }
        }
      }
      if(name != undefined){
        editUser.name = name;
      }
      if(role != undefined){
        editUser.role = role;
      }
      try{
      await connection.update(editUser).where({id: id}).table("users");
      return {status: true}
      }catch(err){
        return {status: false, err: err}
      }
    }else{
      return {status: false, err:"The user doesn't exist"}
    }
  }
  async delete(id){ 
    let user = await this.findById(id);
    if(user != undefined){
      try{
      await connection.delete().where({id: id}).table("users");
      return {status: true}
      }catch(err){
        return {status: false, err: err}
      }
    }else{
      return {status: false, err: "The user DOES NOT exist"}
    }
  }
  async changePassword(newPassword,id,token){
    let hash = await bcrypt.hash(newPassword,10);
    await connection.update({password: hash}).where({id: id}).table("users");
    await PasswordToken.setUser(token);
  }
}

module.exports = new User();
