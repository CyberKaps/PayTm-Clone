import express from 'express'

const app = express();

app.use(express.json())


app.post("/api/v1/signup", async (req, res) => {
    res.json({
        msg: "sign up endpoint"
    })
})

app.post("/api/v1/signin", async (req, res) => {
    res.json({
        msg: "sign up signin"
    })
})

app.listen(3000);