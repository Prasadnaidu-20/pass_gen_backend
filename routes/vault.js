import express from "express";
import VaultItem from "../models/VaultItem.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await VaultItem.find({ userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, username, password, url, notes } = req.body;

    const newItem = new VaultItem({
      userId,
      title,
      username,
      password, 
      url,
      notes,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, username, password, url, notes } = req.body;

    const item = await VaultItem.findOne({ _id: req.params.id, userId });
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.title = title || item.title;
    item.username = username || item.username;
    item.password = password || item.password; 
    item.url = url || item.url;
    item.notes = notes || item.notes;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const item = await VaultItem.findOneAndDelete({ _id: req.params.id, userId });
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Vault item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
