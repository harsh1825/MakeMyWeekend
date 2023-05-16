const jwt = require('jsonwebtoken');

module.exports.middleware = function (req){

    const authHeader = req.headers['authorization'];

        
        try {
            const decoded = jwt.verify(authHeader,"ye_ek_secret_key_hai");
            // console.log('-----decoded---',decoded);
            return true
        }
        catch (error) {
            
            console.log('error!',error);
            return false
            
        }
    
}
