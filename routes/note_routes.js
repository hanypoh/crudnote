const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', authMiddleware.checkAuth, notesController.getAllNotes);
router.get('/add-view', authMiddleware.checkAuth, notesController.createView);
router.post('/', authMiddleware.checkAuth, notesController.createNote);
router.post('/add', notesController.addNote);
router.put('/:id', authMiddleware.checkAuth, notesController.updateNote);
router.delete('/:id', authMiddleware.checkAuth, notesController.deleteNote);

module.exports = router;
