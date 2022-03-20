import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    usuario: {
        type: String,
        required: [true, 'El usuario es obligatorio'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'La contraseña es obligatoria']
    }
}, {
    timestamps: true,
    versionKey: false
});

usuarioSchema.statics.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

usuarioSchema.statics.comparePassword = async(password, recivedPassword) => {
    return await bcrypt.compare(password, recivedPassword);
};

export default model('Usuario', usuarioSchema);