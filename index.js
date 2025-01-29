require("dotenv").config();
const { PORT } = process.env;
const server = require("./src/app.js");
const prisma = require("./src/db.js");

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
