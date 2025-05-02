console.clear()
const express = require("express")
const { ireng } = require("./src/hitam")

const SH = express()

SH.use(express.json())
SH.use("/public", express.static("public"))

SH.get("/", (req, res) => res.send("POST api/negro").json)
SH.get("/api/negro", (req, res) => res.json({who: "buset di get"}))
SH.post("/api/negro", async (req, res, next) => {
  if (req.headers["x-api-key"] !== "jlek")
    return res.status(403).json({ err: "FORBIDDEN" })
  next()
}, async (req, res) => {
  if (!req.body.url) return res.status(400).json({ er: "FORBIDDEN" })
  try {
    const imagePath = await ireng(req.body.url)
    res.json({ status: "OK", image: imagePath })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

SH.listen(3000, () => console.log("http://localhost:3000"))