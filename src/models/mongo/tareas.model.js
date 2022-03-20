import { Schema, model } from 'mongoose';

const tareaSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
    },
    detalle: {
        type: String,
        trim: true
    },
    fechaVencimiento: {
        type: Date
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    estatus: {
        type: String,
        enum: ['Pendiente', 'Completada'],
        required: true,
        default: 'Pendiente'
    },
    uid: {
        ref: 'Usuario',
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Tarea', tareaSchema);