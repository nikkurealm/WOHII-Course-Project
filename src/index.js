const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const questionsRouter = require("./routes/questions");

app.use(express.json());

app.use("/api/questions", questionsRouter);

app.use((req, res) => {
    res.json({ msg: "Not Found" });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
