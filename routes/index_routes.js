const router = require("express").Router()
const authRouter = require("./user_routes")
const notesRouter = require("./note_routes")

router.use(authRouter)
router.use(notesRouter)

module.exports = router