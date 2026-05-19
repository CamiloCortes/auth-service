const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSession } = require('../middlewares/sessionMiddleware');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroDocumento:
 *                 type: string
 *               tipoDocumento:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               numeroCelular:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna datos de sesión
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierre de sesión
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post('/logout', validateSession, authController.logout);

module.exports = router;
