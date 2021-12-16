class HomeController{

    async index(req,res){
        res.send("hello")
    }
}

module.exports = new HomeController();