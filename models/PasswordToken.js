const connection = require('../database/connection');
const User = require('./user');
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();


class PasswordToken{
    async create(email){
        let user = await User.findByEmail(email);
        if (user != undefined){
            try{
                let token = await tokgen.generate()
                await connection.insert({
                    user_id: user.id,
                    used: 0,
                    token: token,
                }).table("passwordtokens");
                return {status:true, token: token}
            }catch(err){
                console.log(err);
                return {status:false, err:err}
            }
        }else{
            return {status:false, err:"The email does NOT exist in database"}
        }
    }
    async validate(token){
        try{
        let result = await connection.select().where({token: token}).table("passwordtokens");
        if (result.length > 0){
            let tk = result[0];
            if (tk.used == 1){
                return {status: false};
            }else{
                return {status:true,token:tk};
            }
        }else{
            return {status: false}
        }
        }catch(err){
            console.log(err);
            return {status: false};
        }
    }
    async setUser(token){
        try{
            await connection.update({used: 1}).where({token: token}).table("passwordtokens");
        }catch(err){
            console.log(err);
        }
    }
}

module.exports =  new PasswordToken();