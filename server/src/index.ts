import Express = require("express");
const app = Express();

app.get('/', (req, res) => {
  return res.send('Hello, World!');
});
app.listen(5000, () => {
  console.log('Server is running on http://127.0.0.1:5000');
});