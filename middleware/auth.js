const jwt=require('jsonwebtoken')
const config=require('config')

module.exports= function(req,res,next){
    const token=req.header('x-auth-token')

    //checking if token is there or not
    if(!token){
        return res.status(401).json({msg:'No token, authentication denied'})
    }

    try{

        const decoded=jwt.verify(token,config.get('jwtSecret'))
        req.user=decoded.user
        next()
    }
    catch(err){
        //401 is for invalid access or access denied
        res.status(401).json({msg: 'token is not valid'})
    }
}