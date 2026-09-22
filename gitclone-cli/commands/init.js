const fs = require("fs/promises");
const path = require("path");
const api = require("../api");


async function initRepo() {

    const repoPath = path.resolve(
        process.cwd(),
        ".apnaGit"
    );

    const currPath =
        process.cwd();

    const repoName =
        path.basename(currPath);


    try {

        // -----------------------------
        // Read authentication
        // -----------------------------

        const authPath =
            path.join(
                repoPath,
                "auth.json"
            );


        let auth;

        try {

            const authData =
                await fs.readFile(
                    authPath,
                    "utf8"
                );

            auth =
                JSON.parse(authData);

        } catch {

            console.log(
                "Please login first."
            );

            return;
        }


        if (!auth.token) {

            console.log(
                "Please login first."
            );

            return;
        }


        // -----------------------------
        // Ask backend for repository
        // -----------------------------

        const response =
            await api.get(

                `/repo/init/${encodeURIComponent(repoName)}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${auth.token}`
                    }
                }
            );


        const {
            repoId,
            bucket
        } = response.data;


        // -----------------------------
        // Create local .apnaGit
        // -----------------------------

        const repoIdPath =
            path.join(
                repoPath,
                `${repoId}`
            );

        const commitPath =
            path.join(
                repoIdPath,
                "commits"
            );


        await fs.mkdir(
            commitPath,
            {
                recursive: true
            }
        );


        // -----------------------------
        // Create config
        // -----------------------------

        await fs.writeFile(

            path.join(
                repoPath,
                "config.json"
            ),

            JSON.stringify(
                {
                    bucket: bucket,
                    repoId: repoId
                },
                null,
                2
            )
        );


        console.log(
            "Repository initialized successfully."
        );


    } catch (error) {

        if (error.response) {

            console.error(
                "Initialization failed:",
                error.response.data.message
            );

        } else {

            console.error(
                "Initialization failed:",
                error.message
            );
        }
    }
}


module.exports = initRepo;