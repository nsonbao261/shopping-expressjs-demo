import swaggerJSDoc from 'swagger-jsdoc';


const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Frosch Boardgame Shop API with Swagger",
            version: "0.1.0",
            description: "This is simple shopping cart CRUD API developed by Express and documented by Swagger"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
        basePath: "/",
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        },
        // security: [{
        //     bearerAuth: []
        // }]
    },
    apis: ["./src/routes/*.ts"]
}

export const swaggerSpecs = swaggerJSDoc(options);