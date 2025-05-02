const { ireng } = require("../src/hitam")

module.exports = async (req, res) => {
  if (req.method === "GET")
    return res.json({ who: "buset di get" })

  if (req.method === "POST") {
    if (req.headers["x-api-key"] !== "jlek")
      return res.status(403).json({ err: "FORBIDDEN" })

    if (!req.body.url)
      return res.status(400).json({ err: "URL REQUIRED" })

    try {
      const imagePath = await ireng(req.body.url)
      return res.json({ status: "OK", image: imagePath })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  res.status(405).json({ error: "Method Not Allowed" })
}