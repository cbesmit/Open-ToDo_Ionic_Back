import jwt from 'jsonwebtoken';
import User from '../../../models/mongo/users.model';
import serverConfig from '../../../config/server.config';

export const login = async (req, res) => {
    let msgErr = '';
    ['usuario', 'password'].forEach(item => {
        if (!req.body.hasOwnProperty(item)) {
            msgErr += 'El campo ' + item + ' es obligatorio. ';
        }
    });

    if (msgErr) return res.status(400).json({
        status: 400,
        error: true,
        msg: msgErr,
        data: []
    });

    const { usuario, password } = req.body;
    const userFound = await User.findOne({ usuario: usuario });

    if (!userFound) return res.status(401).json({
        status: 401,
        error: true,
        msg: 'No se encontró el usuario',
        data: []
    });

    const matchPassword = await User.comparePassword(password, userFound.password);

    if (!matchPassword) return res.status(401).json({
        status: 401,
        error: true,
        msg: 'Contraseña incorrecta',
        data: []
    });

    const token = jwt.sign({ id: userFound._id }, serverConfig.SECRET, {
        expiresIn: 86400 // 24 hrs
    })
    res.status(200).json({
        status: 200,
        error: false,
        msg: 'Acceso correcto',
        data: [{
            token: token,
            nombre: userFound.nombre
        }]
    });

}

export const signup = async (req, res) => {
    let msgErr = '';
    ['nombre', 'usuario', 'password'].forEach(item => {
        if (!req.body.hasOwnProperty(item)) {
            msgErr += 'El campo ' + item + ' es obligatorio. ';
        }
    });

    if (msgErr) return res.status(400).json({
        status: 400,
        error: true,
        msg: msgErr,
        data: []
    });

    const { nombre, usuario, password } = req.body;
    const newUser = new User({
        nombre,
        usuario,
        password: await User.encryptPassword(password)
    });

    newUser.save(function (err, user) {
        if (err) return res.status(401).json(
            {
                status: 401,
                error: true,
                msg: err,
                data: []
            });

        const token = jwt.sign({ id: user._id, secret: user.secret }, serverConfig.SECRET, {
            expiresIn: 86400 // 24 hours
        })
        res.status(200).json({
            status: 200,
            error: false,
            msg: 'Acceso correcto',
            data: [{
                token: token
            }]
        });
    });
}
