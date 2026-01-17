class Usuario {
    constructor({ id, nombre, email, password, telefono, direccion, rol, created_at }) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password; 
        this.telefono = telefono;
        this.direccion = direccion;
        this.rol = rol; 
        this.created_at = created_at;
    }
}

module.exports = Usuario;