const fs = require("fs/promises");
const path = require("path");
const api = require("../api");


async function revertRepo(commitId) {

    const repoPath =
        path.resolve(
            process.cwd(),
            ".apnaGit"
        );


    try {

        // -----------------------------
        // Read config
        // -----------------------------

        const configPath =
            path.join(
                repoPath,
                "config.json"
            );


        const data =
            await fs.readFile(
                configPath,
                "utf8"
            );


        const config =
            JSON.parse(data);


        const repoId =
            config.repoId;


        if (!repoId) {

            console.log(
                "Repository is not initialized."
            );

            return;
        }


        // -----------------------------
        // Read authentication
        // -----------------------------

        const authData =
            await fs.readFile(
                path.join(
                    repoPath,
                    "auth.json"
                ),
                "utf8"
            );


        const auth =
            JSON.parse(authData);


        if (!auth.token) {

            console.log(
                "Please login first."
            );

            return;
        }


        // -----------------------------
        // Find local commit
        // -----------------------------

        const commitsPath =
            path.join(
                repoPath,
                `${repoId}`,
                "commits"
            );


        const commitDir =
            path.join(
                commitsPath,
                commitId
            );


        const files =
            await fs.readdir(
                commitDir
            );


        // -----------------------------
        // Restore working directory
        // -----------------------------

        const parentDir =
            path.join(
                repoPath,
                ".."
            );


        for (const file of files) {

            if (file === "commit.json") {
                continue;
            }


            await fs.copyFile(

                path.join(
                    commitDir,
                    file
                ),

                path.join(
                    parentDir,
                    file
                )
            );
        }


        // -----------------------------
        // Tell backend
        // -----------------------------

        const response =
            await api.post(

                `/repo/revert/${repoId}`,

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
            `The folder successfully reverted to ${commitId}`
        );


    } catch (error) {

        if (error.response) {

            console.error(
                "Revert failed:",
                error.response.data.message
            );

        } else {

            console.error(
                "Revert failed:",
                error.message
            );
        }
    }
}


module.exports = revertRepo;