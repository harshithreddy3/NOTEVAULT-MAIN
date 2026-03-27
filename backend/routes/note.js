import express from "express";
import { z } from "zod"
import Note from "../models/noteModel.js"
import authMiddleware from "../middleware.js"
import Folder from "../models/folderModel.js"

const router = express.Router();
const noteInput = z.object({
    title: z.string(),
    content: z.string(),
    folderId: z.string(),
    tags: z.array(z.string()).optional()
})

router.post('/', authMiddleware, async (req, res) => {
    const noteInfo = req.body;

    const { success } = noteInput.safeParse(noteInfo)
    if (!success) {
        return res.json({
            error: "Invalid Inputs"
        })
    }
    try {
        const folder = await Folder.findOne({ _id: noteInfo.folderId })
        if (!folder) {
            return res.json({
                error: "Folder not found"
            })
        }

        const note = new Note({
            title: noteInfo.title,
            content: noteInfo.content,
            tags: noteInfo.tags || [],
            folderId: noteInfo.folderId,
            userId: req.userId
        })
        await note.save();

        folder.noteCount += 1;
        await folder.save();

        return res.status(200).json({
            message: "Note Added Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
})

router.get('/getNotes/:folderId', authMiddleware, async (req, res) => {
    try {
        const folderId = req.params.folderId
        const notes = await Note.find({ userId: req.userId, folderId: folderId, inTrash: false }).sort({ isPinned: -1 },);
        return res.json({
            notes,
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
})

router.put('/:noteId', authMiddleware, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags } = req.body;
    try {
        const note = await Note.findOne({ _id: noteId })
        note.title = title;
        note.content = content;
        note.tags = tags;
        await note.save();
        return res.json({
            message: "Note updated successfully"
        })
    } catch (error) {
        return res.json({
            error: true,
            message: "Internal Server Error"
        });
    }
})

router.get('/search/:folderId/:query', authMiddleware, async (req, res) => {
    try {
        const folderId = req.params.folderId
        const query = req.params.query
        const notes = await Note.find({
            userId: req.userId,
            folderId: folderId,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
                { tags: { $regex: new RegExp(query, "i") } },
            ],
        })
        return res.json({
            notes
        })
    } catch (error) {
        return res.json({
            error: "Error1"
        })
    }
})

router.get('/getNote/:id', authMiddleware, async (req, res) => {
    const id = req.params.id
    try {
        const note = await Note.find({ _id: id })
        const noteData = note[0]
        return res.json({
            noteData
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
})

router.put('/pin/:noteId', authMiddleware, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    try {
        const note = await Note.findOne({ _id: noteId })
        note.isPinned = isPinned;
        await note.save();
        return res.json({
            message: "Note pinned successfully"
        })
    } catch (error) {
        return res.json({
            error: true,
            message: "Internal Server Error"
        });
    }
})

router.delete('/:noteId', authMiddleware, async (req, res) => {
    const noteId = req.params.noteId;
    try {

        const note = await Note.findOne({ _id: noteId, userId: req.userId })
        if (!note) {
            return res.json({ error: "Note Not found" })
        }
        if (!note.inTrash) {
            note.inTrash = true;
            await note.save();
        } else {
            await Note.deleteOne({ _id: noteId, userId: req.userId });
            const folder = await Folder.findOne({ _id: note.folderId })
            folder.noteCount -= 1;
            await folder.save()
        }
        return res.json({
            message: "Note deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
})

router.get('/trash', authMiddleware, async (req, res) => {
    try {
        const uid = req.userId
        const notes = await Note.find({ userId: uid, inTrash: true })
        return res.status(200).json(notes)
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
})

router.put("/restore/:id", authMiddleware, async (req, res) => {
    const noteId = req.params.id;
    try {
        const note = await Note.findOne({ _id: noteId })
        if (!note) {
            return res.json({
                error: "Note not found"
            })
        }
        note.inTrash = false;
        await note.save();

        const folder = await Folder.findOne({ _id: note.folderId })
        await folder.save();

        return res.json({
            message: "Note Restored Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
})


export default router