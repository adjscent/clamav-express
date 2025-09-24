const express = require("express");
const NodeClam = require("clamscan");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(
  "/scan",
  express.raw({ type: "application/octet-stream", limit: "1000mb" })
);

app.post("/scan", async (req, res) => {
  if (!req.body || !Buffer.isBuffer(req.body)) {
    return res.status(400).json({ error: "No file blob in request body" });
  }
  // Save buffer to temp file for scanning
  const tmpPath = path.join(
    "uploads",
    `blob_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );
  fs.writeFile(tmpPath, req.body, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save blob" });
    }
    try {
      const clamscanInstance = await new NodeClam().init({
        clamdscan: {
          timeout: 60000,
        },
      });

      const { isInfected, viruses } = await clamscanInstance.scanFile(tmpPath);
      // if debug node
      if (process.env.DEBUG) {
        fs.unlink(tmpPath, () => {});
      }
      res.json({
        infected: isInfected,
        viruses: viruses || [],
      });
    } catch (err) {
      fs.unlink(tmpPath, () => {});
      res.status(500).json({ error: err.message });
    }
  });
});

app.get("/", (req, res) => {
  res.send("ClamAV Express server is running. POST a file to /scan");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
