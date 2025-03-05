"use strict"

import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"
import categoryRoutes from "../src/category/category.routes.js"
import productRoutes from "../src/product/product.routes.js"
import cartRoutes from "../src/cart/cart.routes.js"
import invoiceRoutes from "../src/invoice/invoice.routes.js"
import checkoutRoutes from "../src/checkout/checkout.routes.js"
import apiLimiter from "../src/middlewares/rate-limit-validator.js"
import { createDefaultAdmin } from "../src/middlewares/user-validators.js"
import { createDefaultCategory } from "../src/middlewares/category-validators.js"
import { swaggerDocs, swaggerUi } from "./swagger.js";

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

const routes = (app) => {
    app.use("/ventasOnline/v1/auth", authRoutes)
    app.use("/ventasOnline/v1/user", userRoutes)
    app.use("/ventasOnline/v1/product", productRoutes)
    app.use("/ventasOnline/v1/category", categoryRoutes)
    app.use("/ventasOnline/v1/cart", cartRoutes)
    app.use("/ventasOnline/v1/invoice", invoiceRoutes)
    app.use("/ventasOnline/v1/checkout", checkoutRoutes)
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

const conectarDB = async () => {
    try {
        await dbConnection()
    } catch (err) {
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}

export const initServer = async () => {
    const app = express()
    try {
        middlewares(app)
        await conectarDB()
        await createDefaultAdmin()
        await createDefaultCategory()
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    } catch (err) {
        console.log(`Server init failed: ${err}`)
    }
}
