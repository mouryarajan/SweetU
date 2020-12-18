module.exports = (req, res, next) =>{
    if(!req.session.isLogedin)
    {
        return res.redirect('/');
    }
    next();
}