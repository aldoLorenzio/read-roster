const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const peminjamanValidation = require('../../validations/peminjaman.validation');
const peminjamanController = require('../../controllers/peminjaman.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(peminjamanValidation.createPeminjaman), peminjamanController.createPeminjaman)
  .get(auth('manageUsers'), validate(peminjamanValidation.getPeminjamans), peminjamanController.getPeminjamans);

router
  .route('/:peminjamanId')
  .get(auth('admin'), validate(peminjamanValidation.getPeminjaman), peminjamanController.getPeminjaman)
  .post(auth('admin'), validate(peminjamanValidation.updatePeminjaman), peminjamanController.updatePeminjaman)
  .delete(auth('admin'), validate(peminjamanValidation.deletePeminjaman), peminjamanController.deletePeminjaman);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Peminjamans
 *   description: Peminjaman management and retrieval
 */

/**
 * @swagger
 * /peminjamans:
 *   post:
 *     summary: Create a peminjaman
 *     description: Only admins can create other peminjamans.
 *     tags: [Peminjamans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               role:
 *                  type: string
 *                  enum: [peminjaman, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *               role: peminjaman
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Peminjaman'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all peminjamans
 *     description: Only admins can retrieve all peminjamans.
 *     tags: [Peminjamans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Peminjaman name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Peminjaman role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of peminjamans
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Peminjaman'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /peminjamans/{id}:
 *   get:
 *     summary: Get a peminjaman
 *     description: Logged in peminjamans can fetch only their own peminjaman information. Only admins can fetch other peminjamans.
 *     tags: [Peminjamans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Peminjaman id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Peminjaman'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a peminjaman
 *     description: Logged in peminjamans can only update their own information. Only admins can update other peminjamans.
 *     tags: [Peminjamans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Peminjaman id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Peminjaman'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a peminjaman
 *     description: Logged in peminjamans can delete only themselves. Only admins can delete other peminjamans.
 *     tags: [Peminjamans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Peminjaman id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
