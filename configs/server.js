"use strict"

import express from "express" // Framework para construir aplicaciones web y APIs en Node.js
import cors from "cors" // Middleware para habilitar CORS
import helmet from "helmet" // Middleware para mejorar la seguridad HTTP
import morgan from "morgan" // Middleware para registrar solicitudes HTTP en la consola
import { dbConnection } from "./mongo.js" // Función de conexión a MongoDB
import authRoutes from "../src/auth/auth.routes.js" // Rutas de autenticación
import userRoutes from "../src/user/user.routes.js" // Rutas de gestión de usuarios
import categoryRoutes from "../src/category/category.routes.js" // Rutas de categorías
import productRoutes from "../src/product/product.routes.js" // Rutas de productos
import cartRoutes from "../src/cart/cart.routes.js" // Rutas de carrito de compras
import invoiceRoutes from "../src/invoice/invoice.routes.js" // Rutas de facturas
import checkoutRoutes from "../src/checkout/checkout.routes.js" // Rutas de checkout
import apiLimiter from "../src/middlewares/rate-limit-validator.js" // Middleware para limitar solicitudes
import { createDefaultAdmin } from "../src/middlewares/user-validators.js"


const middlewares = (app) => {
    app.use(express.urlencoded({extended: false})) // Permite el análisis de datos codificados en URL
    app.use(express.json()) // Permite el análisis de datos en formato JSON
    app.use(cors()) // Habilita CORS para permitir solicitudes de diferentes dominios
    app.use(helmet()) // Agrega cabeceras de seguridad HTTP
    app.use(morgan("dev")) // Registra las solicitudes HTTP en la consola en formato "dev"
    app.use(apiLimiter) // Aplica limitación de solicitudes para prevenir abusos
}

const routes = (app) => {
    app.use("/ventasOnline/v1/auth", authRoutes) // Rutas de autenticación
    app.use("/ventasOnline/v1/user", userRoutes) 
    app.use("/ventasOnline/v1/product", productRoutes)
    app.use("/ventasOnline/v1/category", categoryRoutes)
    app.use("/ventasOnline/v1/cart", cartRoutes)
    app.use("/ventasOnline/v1/invoice", invoiceRoutes)
    app.use("/ventasOnline/v1/checkout", checkoutRoutes)
}


const conectarDB = async () => {
    try {
        await dbConnection() // Intenta conectar con la base de datos
    } catch (err) {
        console.log(`Database connection failed: ${err}`) // Muestra el error en consola
        process.exit(1) // Finaliza el proceso en caso de error
    }
}

/**
 * Inicializa el servidor Express.
 */

export const initServer = async ()  => {

    const app = express() // Crea una instancia de Express
    try{
        middlewares(app) // Configura los middlewares
        await conectarDB() // Conecta con la base de datos
        await createDefaultAdmin()
        routes(app) // Configura las rutas de la API
        app.listen(process.env.PORT) // Inicia el servidor en el puerto definido en las variables de entorno
        console.log(`Server running on port ${process.env.PORT}`) // Muestra un mensaje en consola confirmando que el servidor está corriendo
    }catch(err){
        console.log(`Server init failed: ${err}`) // Muestra un mensaje de error en caso de falla
    }
}