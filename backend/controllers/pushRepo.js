const { s3, S3_BUCKET } = require("../config/aws-cnfig");
const Reposatory = require("../models/repoModel.js");

const pushRepo = async (req, res) => {

    try {

        const repoId = req.params.id;

        const { files, currCommitId } = req.body;

        if (!files || files.length === 0) {
            return res.status(400).json({
                message: "No files to push"
            });
        }

        for (const file of files) {

            const fileContent = Buffer.from(
                file.content,
                "base64"
            );

            const params = {
                Bucket: S3_BUCKET,

                Key:
                    `${repoId}/commits/` +
                    `${file.commitId}/` +
                    `${file.fileName}`,

                Body: fileContent
            };

            await s3.upload(params).promise();
        }

        if (typeof currCommitId === "string" && /^[\w-]+$/.test(currCommitId)) {
            await Reposatory.findByIdAndUpdate(repoId, { currCommitId });
        }

        return res.status(200).json({
            message: "All files pushed successfully"
        });

    } catch (error) {

        console.error(
            "Push error:",
            error
        );

        return res.status(500).json({
            message: "Error while pushing repository"
        });
    }
};

module.exports = {
    pushRepo
};