import tareasRouter from './tareas.router';
import serverConfig from '../../config/server.config';

module.exports = function(app) {
    app.use(serverConfig.API + '/tareas', tareasRouter);
}