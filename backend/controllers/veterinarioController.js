import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


const registrarUsuario = async(req, res) => {
    const {email, nombre} = req.body;
  
    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email});
    if(existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});
    }
   
    try {
        // Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email
        emailRegistro({
            email, 
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    } 

};


// Confirmar cuenta utilizando un token
const confirmarUsuario = async(req, res)  => {
    try {
        const {tokenUsuario} = req.params;
        const usuarioConfirmar = await Veterinario.findOne({token: tokenUsuario}); // retorna un objeto
        
        if(!usuarioConfirmar) {
            const error = new Error("Token no valido.");
            return res.status(400).json({msg: error.message});
        }

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()

        res.json({msg : 'Usuario confirmado correctamente'});
    } catch (error) {
        console.log(error)
    }

};

// Funcion para autenticar a los usuarios
const autenticar = async (req,res)=> {

   try {
        // Identificando que un usuario existe para autenticarlo, esta confirmado 
        const { email, password } = req.body;

        // Comprobar si el usuario existe
        const usuario = await Veterinario.findOne({email});
    
        if(!usuario) {
            const error = new Error("El usuario no existe.");
            return res.status(400).json({msg: error.message});
        }

        // Comprobar si el usuario esta confirmado 
        if(!usuario.confirmado) {
            const error = new Error("Tu cuenta no ha sido confirmada.");
            return res.status(400).json({msg: error.message});
        }

        //Revisar el password
        if(await usuario.comprobarPassword(password)){
            // Autenticar al usuario con JWT 
            usuario.token = generarJWT(usuario.id)
            res.json({
                _id:usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                token: generarJWT(usuario.id)
            });
        } else {
            const error = new Error("Password Incorrecto.");
            return res.status(400).json({msg: error.message});
        }

   } catch (error) {
       console.log(error)
   }

};

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
};

const forgotPassword = async(req, res) => {
    try {
        const {email} = req.body;
        const existeVeterinario = await Veterinario.findOne({email});

        if(!existeVeterinario) {
            const error = new Error("El usuario no existe.");
            return res.status(400).json({msg: error.message});
        }

        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        emailOlvidePassword({
            email, 
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg:"Hemos enviado un email con las instrucciones"});
        
    } catch (error) {
        console.log(error)
    }
};

const comprobarToken = async(req, res) => {
    try {
        const {token} = req.params;
        const tokenValido = await Veterinario.findOne({token});

        if(tokenValido){
            res.json({msg:"Token valido."});
        } else {
            const error = new Error("Token no valido.");
            return res.status(400).json({msg: error.message});
        }
    } catch (error) {
        console.log(error)
    }


};

const nuevoPassword = async(req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const veterinario = await Veterinario.findOne({token});
        if(!veterinario){
            const error = new Error("Hubo un error.");
            return res.status(400).json({msg: error.message});
        }

        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save()
        res.json({msg: "Password modificado correctamente"});

    } catch (error) {
        console.log(error)
    }
};

const actualizarPerfil = async (req, res) => {
    try {
        const veterinario = await Veterinario.findById(req.params.id);
        if(!veterinario) {
            const error = new Error("Hubo un error.");
            return res.status(400).json({msg: error.message});
        }

        const {email} = req.body;
        if(veterinario.email !== req.body.email){
            const existeEmail = await Veterinario.findOne({email})
            if(existeEmail) {
                const error = new Error("Email en uso");
                return res.status(400).json({msg: error.message});
            }
        }

        veterinario.nombre = req.body.nombre;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;
        veterinario.email = req.body.email;

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async(req, res) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_nuevo, pwd_actual} = req.body;

    // Comprobar quq el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error("Hubo un error.");
        return res.status(400).json({msg: error.message});
    }
    // Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg:'Password Almacenado correctamente'})

    }else {
        const error = new Error("El password actual es incorrecto");
        return res.status(400).json({msg: error.message});
    }

}

export {
    registrarUsuario,
    confirmarUsuario,
    autenticar, 
    perfil,
    forgotPassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}