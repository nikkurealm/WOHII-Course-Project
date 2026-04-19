const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");


function formatQuestion(question) {
    return {
        ...question,
        keywords: question.keywords.map((k)=> k.name),
    };
}

// Get /questions
// List all questions
router.get("/", async (req, res) => {
  const { keyword } = req.query;

  const where = keyword
    ? { keywords: { some: { name: keyword } } }
    : {};

  const questions = await prisma.question.findMany({
    where,
    include: { keywords: true },
    orderBy: { id: "asc" },
  });

  res.json(questions.map(formatQuestion));
});


// GET /questions/:questionID
// Show a specific post

router.get("/:questionID", async (req, res) => {
  const questionID = Number(req.params.questionID);
  const question = await prisma.question.findUnique({
    where: { id: questionID },
    include: { keywords: true },
  });

  if (!question) {
    return res.status(404).json({ 
		message: "Question not found" 
    });
  }

  res.json(formatQuestion(question));
});



// POST /questions
// Create a new question
router.post("/", async (req, res) => {
    const {question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({
            message: "question, and answer are required"
        });
    }

    const keywordsArray = Array.isArray(keywords) ? keywords : [];

    const newQuestion = await prisma.question.create({
        data: {
            question, answer,
            keywords: {
                connectOrCreate: keywordsArray.map((kw) => ({
                    where: { name: kw }, create: {name: kw },
                })), },
        },
        include: { keywords: true },
    });

    res.status(201).json(formatQuestion(newQuestion));
});

// PUT /questions/:questionID
// Edit a question
router.put("/:questionID", async (req, res) => {
    const questionID = Number(req.params.questionID);

    const { question: questionText, answer } = req.body;

    const existingQuestion = await prisma.question.findUnique({ where: { id: questionID }});

    if (!existingQuestion) {
        return res.status(404).json({ message: "Question not found" });
    }

    if (!questionText || !answer) {
        return res.status(400).json({
            message: "question, and answer are required"
        });
    }

    const keywordsArray = Array.isArray(keywords) ? keywords : [];

    const updatedQuestion = await prisma.question.update({
        where: {id: questionID},
        data: {
            question: questionText,
            answer: answer,
            keywords: {
                set: [],
                connectOrCreate: keywordsArray.map((kw) => ({
                    where: { name: kw},
                    create: { name: kw },
                })),
            },
        },
        include: {keywords: true }
    });

    res.json(formatQuestion(updatedQuestion));
});

// DELETE /questions/:questionID
// Delete a question
router.delete("/:questionID", async (req, res) => {
    const questionID = Number(req.params.questionID);
    
    const question = await prisma.question.findUnique({
        where: { id: questionID },
        include: { keywords: true },
    });

    if (!question) {
        return res.status(404).json({ message: "Post not found" });
    }

   await prisma.question.delete({ where: {id: questionID } })

    res.json({
        message: "Question deleted successfully",
        question: deletedQuestion[0]
    });
});


module.exports = router;