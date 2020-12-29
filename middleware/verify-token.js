const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const token = req.body.inputToken;
    if(!token) return res.json({status:false, message:"Acess Denied"});
    //console.log(token);
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verified){
            next();
        }
    }catch(err){
        res.json({
            message:err
        })
    }
}