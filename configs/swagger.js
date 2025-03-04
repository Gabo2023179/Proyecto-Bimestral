import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Ventas Online",
            version: "1.0.0",
            description: "API para un sistema de gestión de ventas online",
            contact:{
                name: "Gabriel Contreras",
                email: "jcontreras-2023179@kinal.edu.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3000/ventasOnline/v1"
            }
        ]
    },
    apis:[
        "./src/auth/auth.routes.js",
        "./src/user/user.routes.js",
        "./src/company/category.routes.js",
        "./src/company/cart.routes.js",
        "./src/company/invoice.routes.js",
        "./src/company/checkout.routes.js",
        "./src/company/product.routes.js"
        
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi}