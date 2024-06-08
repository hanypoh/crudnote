const Note = require('../models').note;
const jwt = require('jsonwebtoken');

const getAllNotes = async (req, res) => {
  try {
    const Admin = req.user.isAdmin
    if (Admin) {
      const notes = await Note.findAll();
      res.render('notes', { notes: notes })
      return true
    }
    
    const notes = await Note.findAll({ where: { userId: req.user.userId } });
    res.render('notes', { notes: notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createView = (req, res) => { 
  res.render('add-note', { "token": req.headers.authorization.split(' ')[1] }) 
}

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, userId: req.user.userId });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addNote = async (req, res) => {
  try {
    const { title, content, token } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const note = await Note.create({ title, content, userId: decoded.userId });
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findByPk(req.params.id);
    if (!note || note.userId !== req.user.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title;
    note.content = content;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.userId !== req.user.userId) {
      return res.status(404).json({ message: 'Note not found' });
    }
    await note.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote, createView, addNote };
