const prisma = require("../lib/prisma");

async function isOwner (req, res, next) {
    const id = Number(req.params.questionID);
    const question = await prisma.post.findUnique({
      where: { id },
      include: { keywords: true },
    });

    const { NotFoundError, ForbiddenError } = require("../lib/errors");

    if (!question) throw new NotFoundError("Question not found");
    if (question.userId !== req.user.userId)
        throw new ForbiddenError("You can only modify your own questions");


    // Attach the record to the request so the route handler can reuse it
    req.question = question;
    next();
  
}

module.exports = isOwner;