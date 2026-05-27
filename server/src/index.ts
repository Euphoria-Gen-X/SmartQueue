import Express = require("express");
const cors = require("cors");
const app = Express();
app.use(cors());

app.get('/', (req, res) => {
  return res.send('Hello, World!');
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend Connected Successfully"
  });
});

app.listen(5000, () => {
  console.log('Server is running on http://127.0.0.1:5000');
});