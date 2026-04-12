const express = require("express");
const router = express.Router();

const questions = require("../data/questions");

// Get /questions
// List all questions

router.get("/", (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.json(questions);
    }

    const filteredQuestions = questions.filter(question =>
        question.keywords.includes(keyword.toLowerCase())
    );

    res.json(filteredQuestions);
});

// GET /questions/:questionID
// Show a specific post

router.get("/:questionID", (req, res) => {
    const questionID = Number(req.params.questionID);
    
    const question = questions.find((q) => q.id === questionID);

    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
});


// POST /questions
// Create a new question
router.post("/", (req, res) => {
    const { id, question, answer } = req.body;

    if (!id || !question || !answer) {
        return res.status(400).json({
            message: "id, question, and answer are required"
        });
    }

    const maxID = Math.max(...questions.map(q => q.id), 0);

    const newQuestion = {
        id: questions.length ? maxID + 1 : 1,
        question, 
        answer
    };
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
});

// PUT /questions/:questionID
// Edit a question
router.put("/:questionID", (req, res) => {
    const questionID = Number(req.params.questionID);
    const { id, question: questionText, answer } = req.body;

    const question = questions.find((q) => q.id === questionID);

    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }

    if (!id || !questionText || !answer) {
        return res.status(400).json({
            message: "id, question, and answer are required"
        });
    }

    question.id = id;
    question.question = questionText;
    question.answer = answer;

    res.json(question)
});

// DELETE /questions/:questionID
// Delete a question
router.delete("/:questionID", (req, res) => {
    const questionID = Number(req.params.questionID);
    
    const questionIndex = questions.findIndex((q) => q.id === questionID);

    if (questionIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    const deletedQuestion = questions.splice(questionIndex, 1);

    res.json({
        message: "Question deleted successfully",
        question: deletedQuestion[0]
    });
});


module.exports = router;