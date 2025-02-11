const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const questions = require('./questions.json');
const questionAnswers = require('./questionAnswers.json');

async function seederScript() {
  // Seed the Question table
  await prisma.question.createMany({
    data: questions,
    skipDuplicates: true, // Prevents duplicate entries on multiple runs
  });

  // Seed the QuestionAnswer table
  await prisma.questionAnswer.createMany({
    data: questionAnswers,
    skipDuplicates: true,
  });

  console.log("All seeds executed successfully!");
}

// If this script is executed directly, run the seederScript function.
if (require.main === module) {
  seederScript()
    .catch((error) => {
      console.error("Error seeding data:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seederScript };