const fs = require("fs/promises");
const path = require("path");
const api = require("../api");

async function pushRepo() {
    try {
        // --------------------------------
        // 1. Repository paths
        // --------------------------------

        const repoPath = path.resolve(
            process.cwd(),
            ".apnaGit"
        );

        const authPath = path.join(
            repoPath,
            "auth.json"
        );

        const configPath = path.join(
            repoPath,
            "config.json"
        );

        const pushedPath = path.join(
            repoPath,
            "pushed.json"
        );


        // --------------------------------
        // 2. Read authentication
        // --------------------------------

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
        // 4. Read pushed commit information
        // --------------------------------

        let pushedData = {
            lastPushedCommit: null
        };

        try {
            const data = await fs.readFile(
                pushedPath,
                "utf8"
            );

            pushedData = JSON.parse(data);
        } catch {
            // pushed.json doesn't exist yet.
            // This means nothing has been pushed.
        }


        // --------------------------------
        // 5. Read commits
        // --------------------------------

        const commitsPath = path.join(
            repoPath,
            repoId.toString(),
            "commits"
        );

        const commitDirs = await fs.readdir(
            commitsPath,
            {
                withFileTypes: true
            }
        );

        const commits = commitDirs
            .filter(commit => commit.isDirectory())
            .map(commit => commit.name)

            const commitTimes = {};

        for (const id of commits) {
            try {
                const meta = JSON.parse(
                    await fs.readFile(path.join(commitsPath, id, "commit.json"), "utf8")
                );
                commitTimes[id] = Date.parse(meta.date) || 0;
            } catch {
                commitTimes[id] = 0;
            }
        }

        commits.sort((a, b) => commitTimes[a] - commitTimes[b]);


        if (commits.length === 0) {
            console.log("Nothing to push.");
            return;
        }


        // --------------------------------
        // 6. Find new commits
        // --------------------------------

        const lastPushedCommit =
            pushedData.lastPushedCommit;

        let newCommits = commits;

        if (lastPushedCommit) {

            const lastIndex =
                commits.indexOf(lastPushedCommit);

            if (lastIndex !== -1) {

                newCommits =
                    commits.slice(lastIndex + 1);

            }
        }


        if (newCommits.length === 0) {
            console.log("Everything is already pushed.");
            return;
        }


        // --------------------------------
        // 7. Prepare files
        // --------------------------------

        const files = [];

        for (const commitId of newCommits) {

            const commitPath = path.join(
                commitsPath,
                commitId
            );

            const commitFiles =
                await fs.readdir(
                    commitPath,
                    {
                        withFileTypes: true
                    }
                );


            for (const file of commitFiles) {

                // Only files
                if (!file.isFile()) {
                    continue;
                }

                const filePath = path.join(
                    commitPath,
                    file.name
                );

                const fileContent =
                    await fs.readFile(filePath);

                files.push({
                    commitId: commitId,
                    fileName: file.name,
                    content:
                        fileContent.toString("base64")
                });
            }
        }


        if (files.length === 0) {
            console.log("Nothing to push.");
            return;
        }


        // --------------------------------
        // 8. Send files to backend
        // --------------------------------

        const response = await api.post(
            `/repo/push/${repoId}`,
            {
                files: files,
                currCommitId: newCommits[newCommits.length - 1]
             },
             {
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                 headers: {
                    Authorization:
                        `Bearer ${auth.token}`
                }
            }
        );


        // --------------------------------
        // 9. Update pushed commit
        // --------------------------------

        const lastCommit =
            newCommits[newCommits.length - 1];

        await fs.writeFile(
            pushedPath,
            JSON.stringify(
                {
                    lastPushedCommit: lastCommit
                },
                null,
                2
            )
        );


        console.log(
            response.data.message
        );

        console.log(
            `Pushed ${newCommits.length} commit(s).`
        );

    } catch (error) {

        if (error.response) {

            console.log(
                "Push failed:",
                error.response.data.message
            );

        } else {

            console.log(
                "Push failed:",
                error.message
            );
        }
    }
}

module.exports = pushRepo;