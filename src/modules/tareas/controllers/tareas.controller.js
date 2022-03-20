import Tarea from '../../../models/mongo/tareas.model';

export const list = async (req, res) => {
    const listTareas = await Tarea.find({ uid: req.user._id }, { uid: 0, detalle: 0, createdAt: 0, updatedAt: 0 });
    if (!listTareas) return res.status(404).json({
        status: 404,
        error: true,
        msg: 'No existen tareas para el usuario',
        data: []
    });
    res.status(200).json({
        status: 200,
        error: false,
        msg: 'Listado de tareas para el usuario',
        data: listTareas
    });
}

export const create = async (req, res) => {
    let msgErr = '';
    ['titulo'].forEach(item => {
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

    const { titulo, fechaVencimiento, detalle } = req.body;
    const newTarea = new Tarea({
        titulo,
        fechaVencimiento,
        detalle,
        uid: req.user._id
    });

    newTarea.save(function (err, tar) {
        if (err) return res.status(401).json(
            {
                status: 401,
                error: true,
                msg: err,
                data: []
            });

        res.status(200).json({
            status: 200,
            error: false,
            msg: 'Tarea creada correctamente',
            data: [{
                id: tar._id
            }]
        });
    });
}

export const update = async (req, res) => {
    let msgErr = '';
    ['titulo'].forEach(item => {
        if (!req.body.hasOwnProperty(item)) {
            msgErr += 'El campo ' + item + ' es obligatorio. ';
        }
    });
    if(!req.params.id) msgErr += 'El id es obligatorio. ';
    if (msgErr) return res.status(400).json({
        status: 400,
        error: true,
        msg: msgErr,
        data: []
    });

    const { titulo, fechaVencimiento, detalle } = req.body;
    const id = req.params.id;

    Tarea.findByIdAndUpdate(id, { titulo, fechaVencimiento, detalle }, { useFindAndModify: false })
        .then(data => {
            if (!data) return res.status(404).json({
                status: 404,
                error: true,
                msg: "No fue posible actualizar la tarea con id " + id,
                data: []
            });
            res.status(200).json({
                status: 200,
                error: false,
                msg: 'Tarea modificada correctamente',
                data: [data]
            });
        })
        .catch(err => {
            return res.status(404).json({
                status: 404,
                error: true,
                msg: "No fue posible actualizar la tarea con id " + id,
                data: []
            });
        });
}

export const detail = async (req, res) => {
    if (!req.params.id) return res.status(400).json({
        status: 400,
        error: true,
        msg: "El id es obligatorio.",
        data: []
    });

    const id = req.params.id;

    Tarea.findById(id, { uid: 0, createdAt: 0, updatedAt: 0 })
        .then(data => {
            if (!data) return res.status(404).json({
                status: 404,
                error: true,
                msg: "No fue posible obtener la tarea con id " + id,
                data: []
            });
            res.status(200).json({
                status: 200,
                error: false,
                msg: 'Detalle de la tarea',
                data: [data]
            });
        })
        .catch(err => {
            return res.status(404).json({
                status: 404,
                error: true,
                msg: "No fue posible obtener la tarea con id " + id,
                data: []
            });
        });
}
