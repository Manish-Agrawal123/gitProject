require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { s3, S3_BUCKET } = require("./config/aws-cnfig.js");

const User = require("./models/userModel.js");
const Repository = require("./models/repoModel.js");
const Cotr = require("./models/contributionModel.js");

const DEMO_EMAILS = [
    "alex.demo@example.com",
    "sarah.demo@example.com",
    "rahul.demo@example.com",
    "emily.demo@example.com",
];

const REPOSITORY_NAMES = [
    "task-manager",
    "portfolio",
    "chat-app",
    "weather-dashboard",
    "college-connect",
    "expense-tracker",
];

const PASSWORD = "Demo@12345";

const repositoriesData = [
    {
        name: "task-manager",
        description: "A full-stack task management application for organizing daily work.",
        visibility: true,
        files: {
            "README.md": `# Task Manager\n\nA simple full-stack task management application.\n\n## Features\n- Create tasks\n- Update task status\n- Delete tasks\n- Filter completed and pending tasks\n`,
            "package.json": `{"name":"task-manager","version":"1.0.0","scripts":{"start":"node server.js"},"dependencies":{"express":"^4.18.0"}}`,
            "server.js": `const express = require("express");\nconst app = express();\n\napp.use(express.json());\n\napp.get("/", (req, res) => {\n    res.json({ message: "Task Manager API is running" });\n});\n\napp.listen(5000, () => {\n    console.log("Task Manager server running on port 5000");\n});\n`,
            "tasks.js": `const tasks = [\n    { id: 1, title: "Complete project", completed: false },\n    { id: 2, title: "Read documentation", completed: true }\n];\n\nmodule.exports = tasks;\n`,
        },
    },
    {
        name: "portfolio",
        description: "A responsive developer portfolio built with React.",
        visibility: true,
        files: {
            "README.md": `# Portfolio\n\nA personal developer portfolio built with React.\n\n## Sections\n- About\n- Skills\n- Projects\n- Contact\n`,
            "package.json": `{"name":"portfolio","version":"1.0.0","scripts":{"dev":"vite","build":"vite build"},"dependencies":{"react":"^18.0.0","react-dom":"^18.0.0"}}`,
            "App.jsx": `function App() {\n    return (\n        <main>\n            <h1>Alex's Portfolio</h1>\n            <p>Computer Science student and full-stack developer.</p>\n        </main>\n    );\n}\n\nexport default App;\n`,
            "styles.css": `body {\n    margin: 0;\n    font-family: Arial, sans-serif;\n    background: #0d1117;\n    color: white;\n}\n`,
        },
    },
    {
        name: "chat-app",
        description: "A real-time chat application using Node.js and Socket.IO.",
        visibility: true,
        files: {
            "README.md": `# Chat App\n\nReal-time chat application built with Node.js and Socket.IO.\n\n## Features\n- Real-time messaging\n- Multiple users\n- Online status\n`,
            "package.json": `{"name":"chat-app","version":"1.0.0","scripts":{"start":"node server.js"},"dependencies":{"express":"^4.18.0","socket.io":"^4.0.0"}}`,
            "server.js": `const http = require("http");\nconst express = require("express");\nconst { Server } = require("socket.io");\n\nconst app = express();\nconst server = http.createServer(app);\nconst io = new Server(server);\n\nio.on("connection", socket => {\n    socket.on("message", message => {\n        io.emit("message", message);\n    });\n});\n\nserver.listen(5000, () => console.log("Chat server running"));\n`,
            "client.js": `const socket = io();\n\nsocket.on("message", message => {\n    console.log("New message:", message);\n});\n`,
        },
    },
    {
        name: "weather-dashboard",
        description: "A weather dashboard that displays current weather information.",
        visibility: true,
        files: {
            "README.md": `# Weather Dashboard\n\nA simple dashboard for displaying weather information from an API.\n`,
            "package.json": `{"name":"weather-dashboard","version":"1.0.0","scripts":{"dev":"vite"},"dependencies":{"axios":"^1.0.0","react":"^18.0.0"}}`,
            "Weather.jsx": `import { useState } from "react";\n\nexport default function Weather() {\n    const [city, setCity] = useState("");\n\n    return (\n        <section>\n            <h1>Weather Dashboard</h1>\n            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Enter city" />\n        </section>\n    );\n}\n`,
            "api.js": `export async function getWeather(city) {\n    const response = await fetch("/api/weather?city=" + encodeURIComponent(city));\n    return response.json();\n}\n`,
        },
    },
    {
        name: "college-connect",
        description: "A platform connecting students and teachers for assignments and collaboration.",
        visibility: true,
        files: {
            "README.md": `# College Connect\n\nA college platform for assignments, student activity and collaboration.\n\n## Roles\n- Student\n- Teacher\n- Admin\n`,
            "package.json": `{"name":"college-connect","version":"1.0.0","scripts":{"start":"node server.js"},"dependencies":{"express":"^4.18.0","mongoose":"^8.0.0"}}`,
            "server.js": `const express = require("express");\nconst app = express();\n\napp.use(express.json());\n\napp.get("/api/assignments", (req, res) => {\n    res.json([]);\n});\n\napp.listen(5000, () => console.log("College Connect running"));\n`,
            "student.js": `class Student {\n    constructor(name, email) {\n        this.name = name;\n        this.email = email;\n    }\n}\n\nmodule.exports = Student;\n`,
        },
    },
    {
        name: "expense-tracker",
        description: "A simple application for tracking personal expenses and monthly budgets.",
        visibility: false,
        files: {
            "README.md": `# Expense Tracker\n\nTrack expenses, categories and monthly budgets in one place.\n`,
            "package.json": `{"name":"expense-tracker","version":"1.0.0","scripts":{"start":"node app.js"},"dependencies":{"express":"^4.18.0"}}`,
            "app.js": `const express = require("express");\nconst app = express();\n\napp.use(express.json());\n\nconst expenses = [];\n\napp.get("/expenses", (req, res) => {\n    res.json(expenses);\n});\n\napp.listen(5000, () => console.log("Expense tracker running"));\n`,
            "budget.js": `function calculateRemainingBudget(budget, expenses) {\n    return budget - expenses.reduce((sum, value) => sum + value, 0);\n}\n\nmodule.exports = calculateRemainingBudget;\n`,
        },
    },
];

const usersData = [
    { username: "alex_dev", email: DEMO_EMAILS[0] },
    { username: "sarah_codes", email: DEMO_EMAILS[1] },
    { username: "rahul_builds", email: DEMO_EMAILS[2] },
    { username: "emily_dev", email: DEMO_EMAILS[3] },
];

function dateString(date) {
    return date.toISOString().split("T")[0];
}

async function deleteS3Prefix(prefix) {
    let ContinuationToken;

    do {
        const result = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: prefix,
            ContinuationToken,
        }).promise();

        const objects = result.Contents || [];

        if (objects.length > 0) {
            for (let i = 0; i < objects.length; i += 1000) {
                const chunk = objects.slice(i, i + 1000);
                await s3.deleteObjects({
                    Bucket: S3_BUCKET,
                    Delete: {
                        Objects: chunk.map(object => ({ Key: object.Key })),
                    },
                }).promise();
            }
        }

        ContinuationToken = result.IsTruncated
            ? result.NextContinuationToken
            : undefined;
    } while (ContinuationToken);
}

async function uploadRepositoryFiles(repoId, commitId, files) {
    const base = `${repoId}/commits/${commitId}/`;

    for (const [fileName, content] of Object.entries(files)) {
        await s3.putObject({
            Bucket: S3_BUCKET,
            Key: `${base}${fileName}`,
            Body: Buffer.from(content, "utf8"),
            ContentType: fileName.endsWith(".json")
                ? "application/json"
                : fileName.endsWith(".css")
                    ? "text/css"
                    : "text/plain",
        }).promise();
    }

    await s3.putObject({
        Bucket: S3_BUCKET,
        Key: `${base}commit.json`,
        Body: JSON.stringify({
            message: "Initial demo commit",
            date: new Date().toISOString(),
        }, null, 2),
        ContentType: "application/json",
    }).promise();
}

async function seed() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing from backend/.env");
    }

    if (!process.env.AWS_REGION) {
        throw new Error("AWS_REGION is missing from backend/.env");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");
    console.log(`Using S3 bucket: ${S3_BUCKET}`);

    // Remove previous demo data so this script can safely be run again.
    const oldRepos = await Repository.find({
        name: { $in: REPOSITORY_NAMES },
    }).select("_id");

    for (const repo of oldRepos) {
        await deleteS3Prefix(`${repo._id}/`);
    }

    await Cotr.deleteMany({
        user: {
            $in: await User.find({ email: { $in: DEMO_EMAILS } }).distinct("_id"),
        },
    });

    await Repository.deleteMany({ name: { $in: REPOSITORY_NAMES } });
    await User.deleteMany({ email: { $in: DEMO_EMAILS } });

    // Create demo users.
    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    const users = await User.insertMany(
        usersData.map(user => ({
            ...user,
            password: passwordHash,
            reposatory: [],
            starRepo: [],
            followedUser: [],
        }))
    );

    const userMap = Object.fromEntries(
        users.map(user => [user.email, user])
    );

    // Repository ownership.
    const owners = [
        users[0],
        users[0],
        users[1],
        users[1],
        users[2],
        users[3],
    ];

    const repositories = [];

    for (let i = 0; i < repositoriesData.length; i++) {
        const data = repositoriesData[i];
        const commitId = uuidv4();

        const repo = await Repository.create({
            name: data.name,
            description: data.description,
            visibility: data.visibility,
            owner: owners[i]._id,
            issue: [],
            stars: 0,
            currCommitId: commitId,
        });

        await uploadRepositoryFiles(repo._id.toString(), commitId, data.files);
        repositories.push(repo);
    }

    // Add repositories to each owner's profile.
    for (const repo of repositories) {
        const owner = await User.findById(repo.owner);
        owner.reposatory.push(repo._id);
        await owner.save();
    }

    // Star relationships.
    const starRelationships = [
        [0, 2], // Alex -> chat-app
        [0, 3], // Alex -> weather-dashboard
        [1, 0], // Sarah -> task-manager
        [1, 4], // Sarah -> college-connect
        [2, 0], // Rahul -> task-manager
        [2, 1], // Rahul -> portfolio
        [3, 2], // Emily -> chat-app
        [3, 4], // Emily -> college-connect
        [0, 4], // Alex -> college-connect
    ];

    for (const [userIndex, repoIndex] of starRelationships) {
        const user = users[userIndex];
        const repo = repositories[repoIndex];

        if (!user.starRepo.some(id => id.toString() === repo._id.toString())) {
            user.starRepo.push(repo._id);
            await user.save();
        }

        repo.stars += 1;
        await repo.save();
    }

    // Follow relationships.
    users[0].followedUser.push(users[1]._id, users[2]._id);
    users[1].followedUser.push(users[0]._id, users[3]._id);
    users[2].followedUser.push(users[0]._id);
    users[3].followedUser.push(users[1]._id);

    for (const user of users) {
        await user.save();
    }

    // Generate one year of contribution data.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let userIndex = 0; userIndex < users.length; userIndex++) {
        const contribution = [];

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            // Mostly small values, with occasional stronger contribution days.
            const random = Math.random();
            let count = 0;

            if (random < 0.45) count = 0;
            else if (random < 0.70) count = 1;
            else if (random < 0.87) count = 2;
            else if (random < 0.96) count = 3;
            else count = 5 + (userIndex % 3);

            contribution.push({
                date: dateString(date),
                count,
            });
        }

        await Cotr.create({
            user: users[userIndex]._id,
            contribution,
            startDate: contribution[0].date,
        });
    }

    console.log("\nDemo data created successfully.\n");
    console.log("Demo login accounts:");
    for (const user of users) {
        console.log(`  ${user.email}  /  ${PASSWORD}`);
    }

    console.log("\nRepositories:");
    for (const repo of repositories) {
        console.log(`  ${repo.name}  ->  ${repo._id}`);
    }

    console.log(`\nS3 bucket: ${S3_BUCKET}`);
    console.log("Repository files were uploaded to S3.\n");
}

seed()
    .catch(error => {
        console.error("\nSeed failed:", error.message);
        if (error.stack) console.error(error.stack);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
