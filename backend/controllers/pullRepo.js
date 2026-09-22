const { s3, S3_BUCKET } = require("../config/aws-cnfig");
const Reposatory = require("../models/repoModel.js");

const pullRepo = async (req, res) => {

    try {

        // --------------------------------
        // 1. Get repository ID
        // --------------------------------

        const repoId = req.params.id;


        // --------------------------------
        // 2. Find repository
        // --------------------------------

        const repo = await Reposatory.findById(repoId);

        if (!repo) {

            return res.status(404).json({
                message: "Repository not found"
            });
        }


        // --------------------------------
        // 3. Get latest commit ID
        // --------------------------------

        const commitId = repo.currCommitId;

        if (!commitId) {

            return res.status(200).json({
                message: "No commits available",
                commitId: null,
                files: []
            });
        }


        // --------------------------------
        // 4. Get only latest commit files
        // --------------------------------

        const prefix =
            `${repoId}/commits/${commitId}/`;


        const params = {
            Bucket: S3_BUCKET,
            Prefix: prefix
        };


        const data =
            await s3.listObjectsV2(params).promise();


        // --------------------------------
        // 5. No files found
        // --------------------------------

        if (!data.Contents || data.Contents.length === 0) {

            return res.status(404).json({
                message: "Latest commit files not found",
                commitId: commitId,
                files: []
            });
        }


        // --------------------------------
        // 6. Download files
        // --------------------------------

        const files = [];


        for (const object of data.Contents) {

            const fileData =
                await s3.getObject({
                    Bucket: S3_BUCKET,
                    Key: object.Key
                }).promise();


            const fileName =
                object.Key.substring(
                    prefix.length
                );


            files.push({

                fileName: fileName,

                content:
                    fileData.Body.toString("base64")
            });
        }


        // --------------------------------
        // 7. Send latest commit
        // --------------------------------

        return res.status(200).json({

            commitId: commitId,

            files: files

        });


    } catch (error) {

        console.error(
            "Pull error:",
            error
        );

        return res.status(500).json({

            message:
                "Error while pulling repository"

        });
    }
};


module.exports = {
    pullRepo
};