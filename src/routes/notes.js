const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const auth = require('../middleware/authMiddleware')

// GET /api/notes — get all notes for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(notes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/notes — create a note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, color, tags } = req.body
    const note = await Note.create({ 
      title, 
      content, 
      color, 
      tags: tags || [], 
      user: req.user.id 
    })
    res.status(201).json(note)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
// 
// PUT /api/notes/:id — update a note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title: req.body.title, content: req.body.content, tags: req.body.tags,color: req.body.color, pinned: req.body.pinned },
      { new: true }
    )
    if (!note) return res.status(404).json({ message: 'Note not found' })
    res.json(note)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/notes/:id — delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!note) return res.status(404).json({ message: 'Note not found' })
    res.json({ message: 'Note deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router