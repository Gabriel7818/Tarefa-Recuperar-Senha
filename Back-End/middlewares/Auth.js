const jwt = require('jsonwebtoken');
const {promisify} = require('util');
require('dotenv').config();

module.exports = {
    validarToken: async function (req, res, next){
        const authHeader = req.headers.authorization;
        const [bearer, token] = authHeader.split(' ')
        if (!token){
            return res.status(404).json({
                erro: true,
                mensagem: "Erro: É Necessário Realizar o Login !"
            });
        };
        try{
            const decoded = await promisify(jwt.verify)(token, process.env.SECRET)
                req.userId = decoded.id;
    
                return next();
        }catch(err){
            if(err){
                return res.status(400).json({
                    erro: true,
                    mensagem: `Erro: ${err}`
                })
            } else {
                return res.status(401).json({
                    erro:true,
                    mensagem: "Erro: É Necessário Realizar o Login !"
                })
            }
        }
    }
}