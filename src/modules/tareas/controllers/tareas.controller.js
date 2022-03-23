import Tarea from '../../../models/mongo/tareas.model';

export const list = async (req, res) => {
    const listTareas = await Tarea.find({ uid: req.user._id }, { uid: 0, detalle: 0, createdAt: 0, updatedAt: 0 }).sort({fechaVencimiento: 'desc'});
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
    ['titulo', 'estatus'].forEach(item => {
        if (!req.body.hasOwnProperty(item)) {
            msgErr += 'El campo ' + item + ' es obligatorio. ';
        }
    });
    if (!req.params.id) msgErr += 'El id es obligatorio. ';
    if (msgErr) return res.status(400).json({
        status: 400,
        error: true,
        msg: msgErr,
        data: []
    });

    const { titulo, fechaVencimiento, detalle, estatus } = req.body;
    const id = req.params.id;

    const foundTarea = await Tarea.findOne({ uid: req.user._id, _id: id }, { uid: 0, detalle: 0, createdAt: 0, updatedAt: 0 });
    if (!foundTarea) return res.status(404).json({
        status: 404,
        error: true,
        msg: 'No existe la tarea',
        data: []
    });

    Tarea.findByIdAndUpdate(id, { titulo, fechaVencimiento, detalle, estatus }, { useFindAndModify: false })
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
    const foundTarea = await Tarea.findOne({ uid: req.user._id, _id: id }, { uid: 0, detalle: 0, createdAt: 0, updatedAt: 0 });
    if (!foundTarea) return res.status(404).json({
        status: 404,
        error: true,
        msg: 'No existe la tarea',
        data: []
    });

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

export const changeStatus = async (req, res) => {
    let msgErr = '';
    ['ids', 'estatus'].forEach(item => {
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

    const { ids, estatus } = req.body;
    if (ids.length === 0) return res.status(400).json({
        status: 400,
        error: true,
        msg: "Se requiere almenos un id.",
        data: []
    });

    msgErr = '';
    let msgSuccess = [];
    for (const id of ids) {
        const foundTarea = await Tarea.findOne({ uid: req.user._id, _id: id }, { uid: 0, detalle: 0, createdAt: 0, updatedAt: 0 });
        if (!foundTarea) {
            msgErr += 'No existe la tarea con id ' + id + ' ';
        }
        else {
            await Tarea.findByIdAndUpdate(id, { estatus }, { useFindAndModify: false })
                .then(data => {
                    if (!data) {
                        msgErr += 'No fue posible actualizar la tarea con id ' + id + ' ';
                    }
                    else {
                        msgSuccess.push('Se ha actualizado la tarea con id ' + id + ' ');
                    }
                })
                .catch(err => {
                    msgErr += 'No fue posible actualizar la tarea con id ' + id + ' ';
                });
        }
    };

    if (msgErr) return res.status(400).json({
        status: 400,
        error: true,
        msg: msgErr,
        data: msgSuccess
    });

    res.status(200).json({
        status: 200,
        error: false,
        msg: 'Se han actualizado las tareas',
        data: msgSuccess
    });
}

export const deleteList = async (req, res) => {
    const { ids } = req.body;
    if (!ids || ids.length === 0) return res.status(400).json({
        status: 400,
        error: true,
        msg: "Se requiere almenos un id.",
        data: []
    });
    let msgErr = '';
    let msgSuccess = [];
    for (const id of ids) {
        const foundTarea = await Tarea.findOne({ uid: req.user._id, _id: id }, { uid: 0, detalle: 0, createdAt: 0, updatedAt: 0 });
        if (!foundTarea) {
            msgErr += 'No existe la tarea con id ' + id + ' ';
        }
        else {
            await Tarea.findByIdAndRemove(id, function (err) {
                if (err) {
                    msgErr += 'No fue posible borrar la tarea con id ' + id + ' ';
                } else {
                    msgSuccess.push('Se ha borrado la tarea con id ' + id + ' ');
                }
            });
        }
    };

    if (msgErr) return res.status(400).json({
        status: 400,
        error: true,
        msg: msgErr,
        data: msgSuccess
    });

    res.status(200).json({
        status: 200,
        error: false,
        msg: 'Se han borrado las tareas',
        data: msgSuccess
    });
}