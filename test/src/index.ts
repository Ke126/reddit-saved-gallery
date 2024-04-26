import express, { request } from 'express';

const app = express();
app.use(express.json());

app.get('/posts', (req, res) => {
    res.status(200).json({
        a: req.query.a,
        a_type: typeof req.query.a,
        b: req.query.b,
        b_type: typeof req.query.b,
    });
});

app.listen(3000, () => console.log("Listning on 3000"))