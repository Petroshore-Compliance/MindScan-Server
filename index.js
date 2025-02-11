require("dotenv").config();
const { PORT } = process.env;
const server = require("./src/app.js");
const prisma = require("./src/db.js");
const { seederScript } = require("./prisma/seeds/seederScript.js");

server.listen(PORT, async () => {
  await seederScript();
  console.log(`Server listening on port: ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
