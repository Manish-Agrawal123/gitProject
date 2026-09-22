const fs = require("fs/promises");
const path = require("path");
const api = require("../api");

const { v4: uuidv4 } = require("uuid");


async function commitRepo(message) {

    const repoPath = path.resolve(
        process.cwd(),
        ".apnaGit"
    );

    const stagedPath = path.join(
        repoPath,
        "staging"
    );


    try {

        // -----------------------------
        // Read config
        // -----------------------------

        const data = await fs.readFile(
            path.join(repoPath, "config.json"),
            "utf8"
        );

        const repoId =
            JSON.parse(data).repoId;


        if (!repoId) {

            console.log(
                "First initialise the repository"
            );

            return;
        }


        // -----------------------------
        // Read authentication
        // -----------------------------

        const authData = await fs.readFile(
            path.join(repoPath, "auth.json"),
            "utf8"
        );

        const auth = JSON.parse(authData);


        if (!auth.token) {

            console.log(
                "Please login first"
            );

            return;
        }


        // -----------------------------
        // Read staged files
        // -----------------------------

        const files =
            await fs.readdir(stagedPath);


        if (files.length === 0) {

            console.log(
                "Nothing staged. Use `add <file>` first."
            );

            return;
        }


        // -----------------------------
        // Create commit locally
        // -----------------------------

        const repoIdPath = path.join(
            repoPath,
            `${repoId}`
        );

        const commitPath = path.join(
            repoIdPath,
            "commits"
        );

        const commitId = uuidv4();

        const commitDir = path.join(
            commitPath,
            commitId
        );


        await fs.mkdir(
            commitDir,
            {
                recursive: true
            }
        );


        // -----------------------------
        // Copy files
        // -----------------------------

        for (const file of files) {

            await fs.copyFile(
                path.join(stagedPath, file),
                path.join(commitDir, file)
            );
        }


        // -----------------------------
        // Create commit metadata
        // -----------------------------

        await fs.writeFile(

            path.join(
                commitDir,
                "commit.json"
            ),

            JSON.stringify(
                {
                    message: message,
                    date: new Date().toISOString()
                },
                null,
                2
            )
        );


        // -----------------------------
        // Clear staging
        // -----------------------------

        for (const file of files) {

            await fs.rm(
                path.join(stagedPath, file)
            );
        }


        // -----------------------------
        // Tell backend
        // -----------------------------

        const response =
            await api.post(
                `/repo/commit/${repoId}`,
                {
                    commitId: commitId
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${auth.token}`
                    }
                }
            );

        console.log(
            response.data.message
        );

        console.log(
            `Commit successful: ${commitId}`
        );


    } catch (error) {

        if (error.response) {

            console.error(
                "Commit failed:",
                error.response.data.message
            );

        } else {

            console.error(
                "Commit failed:",
                error.message
            );
        }
    }
}


module.exports = commitRepo;