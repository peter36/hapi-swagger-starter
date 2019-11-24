const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Joi = require('@hapi/joi');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../../package');

Routes = [
    {
        method: 'GET',
        path: '/todo/{id}/',
        options: {
            handler: (request, h) => {
                return h.response('Your task').code(200);
              },
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'], // ADD THIS TAG
            validate: {
                params: Joi.object({
                    id : Joi.number()
                            .required()
                            .description('the id for the todo item'),
                })
            }
        }
    }

]

const ser = async () => {
    const server = await new Hapi.Server({
        host: 'localhost',
        port: 3000,
    });

    const swaggerOptions = {
        info: {
                title: 'Test API Documentation',
                version: Pack.version,
            },
        };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch(err) {
        console.log(err);
    }

    server.route(Routes);
    return server;
};

ser().then(server => {
    console.log(`Server listening on ${server.info.uri}`);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
