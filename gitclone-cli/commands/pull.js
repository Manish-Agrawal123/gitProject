const fs = require("fs/promises");
const path = require("path");
const api = require("../api");

async function pullRepo() {
    try {

        // --------------------------------
        // 1. Repository path
        // --------------------------------

        const repoPath = path.resolve(
            process.cwd(),
            ".apnaGit"
        );


        // --------------------------------
        // 2. Read authentication
        // --------------------------------

        const authPath = path.join(
            repoPath,
            "auth.json"
        );

        let auth;

        try {

            const authData = await fs.readFile(
                authPath,
                "utf8"
            );

            auth = JSON.parse(authData);

        } catch {

            console.log("Please login first.");
            return;
        }

        if (!auth.token) {

            console.log("Please login first.");
            return;
        }


        // --------------------------------
        // 3. Read repository ID
        // --------------------------------

        const configPath = path.join(
            repoPath,
            "config.json"
        );

        const configData = await fs.readFile(
            configPath,
            "utf8"
        );

        const config = JSON.parse(configData);

        const repoId = config.repoId;

        if (!repoId) {

            console.log(
                "Repository is not initialized."
            );

            return;
        }


        // --------------------------------
        // 4. Request latest commit
        // --------------------------------

        const response = await api.get(
            `/repo/pull/${repoId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${auth.token}`
                }
            }
        );


        const {
            commitId,
            files
        } = response.data;


        if (!commitId || !files || files.length === 0) {

            console.log(
                "Nothing to pull."
            );

            return;
        }


        // --------------------------------
        // 5. Create local commit directory
        // --------------------------------

        const commitsPath = path.join(
            repoPath,
            repoId.toString(),
            "commits"
        );

        const commitPath = path.join(
            commitsPath,
            commitId
        );

        await fs.mkdir(
            commitPath,
            {
                recursive: true
            }
        );


        // --------------------------------
        // 6. Save files
        // --------------------------------

        for (const file of files) {

            const filePath = path.join(
                commitPath,
                file.fileName
            );

            const fileContent = Buffer.from(
                file.content,
                "base64"
            );

            await fs.writeFile(
                filePath,
                fileContent
            );
        }


        // --------------------------------
        // 7. Update local config
        // --------------------------------

        config.currCommitId = commitId;

        await fs.writeFile(
            configPath,
            JSON.stringify(
                config,
                null,
                2
            )
        );


        console.log(
            `Pulled latest commit: ${commitId}`
        );

    } catch (error) {

        if (error.response) {

            console.log(
                "Pull failed:",
                error.response.data.message
            );

        } else {

            console.log(
                "Pull failed:",
                error.message
            );
        }
    }
}

module.exports = pullRepo;