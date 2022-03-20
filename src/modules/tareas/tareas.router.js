import { Router } from 'express';
import passport from "passport";
import * as tareasController from './controllers/tareas.controller'

const router = Router();

router.get('/list', passport.authenticate("jwt", { session: false }), tareasController.list);
router.post('/create', passport.authenticate("jwt", { session: false }), tareasController.create);
router.put('/update/:id', passport.authenticate("jwt", { session: false }), tareasController.update);
router.get('/detail/:id', passport.authenticate("jwt", { session: false }), tareasController.detail);


export default router;