const axios = require("axios")

axios.post("http://localhost:3000/api/negro", { 
    url: "https://cloudkuimages.guru/uploads/files/68137807951da.png" 
  },
  {
    headers: {
      "x-api-key": "jlek",
      "Content-Type": "application/json"
    }
  }
).then(r => {
  console.log(r.data)
})