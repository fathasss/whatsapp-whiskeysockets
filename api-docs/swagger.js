const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config({ debug: false });

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Whatsapp WhiskeySocket API",
      version: "1.0.0",
      description:
        "Whatsapp Webhook ve API servisleri için Swagger dokümantasyonu",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
