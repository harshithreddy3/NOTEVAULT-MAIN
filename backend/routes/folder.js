import { Router } from "express";
import authMiddleware from "../middleware.js";
import Folder from "../models/folderModel.js"
const router = Router();

router.post("/create", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { name } = req.body;
    if (!name) {
        return res.json({ error: "Name is required" });
    }
    try {
        const folder = new Folder({
            name,
            userId: userId
        });
        await folder.save();
        return res.json(
            { message: "Folder created successfully" }
        );
    } catch (error) {
        return res.json({ error: "Internal Server Error" });
    }

});

router.get("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const folders = await Folder.find({ userId: userId });
        return res.json(folders);
    } catch (error) {
        return res.json({ error: "Internal Server Error" });
    }
});

router.delete("/:folderId", authMiddleware, async (req, res) => {
    const { folderId } = req.params;

    try {
        const folder = await Folder.findOne({ _id: folderId })
        if (!folder) {
            return res.json({
                error: "Folder Not found"
            })
        }
        if (folder.noteCount == 0) {
            await Folder.deleteOne({ _id: folderId });
            return res.status(200).json({
                message: "Folder Deleted Successfully"
            })
        }
        return res.json({
            error: "Only empty folders can be deleted."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }


})

export default router;  