const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedData = [
    {
        question: "What is the capital of Finland?",
        answer: "Helsinki",
        keywords: [ "Helsinki", "Finland", "capital", "what" ]
    },
    {

        question: "What is the capital of Norway?",
        answer: "Oslo",
        keywords: [ "Oslo", "Norway", "capital", "what" ], 
    },    
    {

        question: "What is the capital of Sweden?",
        answer: "Stockholm",
        keywords: [ "Stockholm", "Sweden", "capital", "what" ]
    },
    {

        question: "What is the capital of Denmark?",
        answer: "Copenhagen",
        keywords: [ "Copenhagen", "Denmark", "capital", "what" ]
    },
    {
        question: "What is the capital of Iceland?",
        answer: "Reykjavik",
        keywords: [ "Reykjavik", "Iceland", "capital", "what" ]
    }
];

async function main() {
    await prisma.question.deleteMany();
    await prisma.keyword.deleteMany();

    for (const item of seedData) {
        await prisma.question.create({
        data: {
            question: item.question,
            answer: item.answer,
            keywords: {
            connectOrCreate: item.keywords.map((kw) => ({
                where: { name: kw },
                create: { name: kw },
            })),
            },
        },
        });
    }

    console.log("Seed data inserted successfully");
    }

    main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() =>  prisma.$disconnect());
