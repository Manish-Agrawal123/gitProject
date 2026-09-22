const fs = require("fs/promises");
const path = require("path");

const Reposatory = require("../models/repoModel.js");
const Cotr = require("../models/contributionModel.js");
const { S3_BUCKET } = require("../config/aws-cnfig.js");


// ========================================
// INIT REPOSITORY
// ========================================

const initRepo = async (req, res) => {

    try {

        const repoName = req.params.name;
        const userId = req.user.userId;

        const repo = await Reposatory.findOne({
            name: repoName
        });

        if (!repo) {

            return res.status(404).json({
                message:
                    "Repository not found. Create a repository with the same name first."
            });
        }


        // Only repository owner can initialize it
        if (
            repo.owner.toString() !==
            userId.toString()
        ) {

            return res.status(403).json({
                message:
                    "You are not authorized to initialize this repository"
            });
        }


        return res.status(200).json({

            message: "Repository initialized",

            repoId: repo._id,

            bucket: S3_BUCKET
        });


    } catch (error) {

        console.error(
            "Init error:",
            error
        );

        return res.status(500).json({
            message: "Error while initializing repository"
        });
    }
};



// ========================================
// RECORD COMMIT
// ========================================

const commitRepo = async (req, res) => {

    try {

        const repoId = req.params.id;
        const userId = req.user.userId;

        const { commitId } = req.body;


        if (
            typeof commitId !== "string" ||
            !/^[\w-]+$/.test(commitId)
        ) {

            return res.status(400).json({
                message: "Invalid commit ID"
            });
        }


        const repo =
            await Reposatory.findById(repoId);

        if (!repo) {

            return res.status(404).json({
                message: "Repository not found"
            });
        }


        // Update current commit
        repo.currCommitId = commitId;

        await repo.save();



        // ====================================
        // Update contribution
        // ====================================

        const currDate =
            new Date()
                .toISOString()
                .split("T")[0];


        const cotr =
            await Cotr.findOne({
                user: userId
            });


        if (!cotr) {

            const newCotr = new Cotr({

                user: userId,

                contribution: [
                    {
                        date: currDate,
                        count: 1
                    }
                ]
            });

            await newCotr.save();

        } else {

            const result =
                cotr.contribution.find(
                    item =>
                        item.date === currDate
                );


            if (!result) {

                cotr.contribution.push({
                    date: currDate,
                    count: 1
                });

            } else {

                result.count =
                    result.count + 1;
            }


            await cotr.save();
        }


        return res.status(200).json({

            message:
                "Commit recorded successfully",

            commitId: commitId
        });


    } catch (error) {

        console.error(
            "Commit error:",
            error
        );

        return res.status(500).json({
            message:
                "Error while recording commit"
        });
    }
};



// ========================================
// REVERT REPOSITORY
// ========================================

const revertRepo = async (req, res) => {

    try {

        const repoId = req.params.id;
        const { commitId } = req.body;


        if (
            typeof commitId !== "string" ||
            !/^[\w-]+$/.test(commitId)
        ) {

            return res.status(400).json({
                message: "Invalid commit ID"
            });
        }


        const repo =
            await Reposatory.findById(repoId);


        if (!repo) {

            return res.status(404).json({
                message: "Repository not found"
            });
        }


        repo.currCommitId = commitId;

        await repo.save();


        return res.status(200).json({

            message:
                "Repository reverted successfully",

            commitId: commitId
        });


    } catch (error) {

        console.error(
            "Revert error:",
            error
        );

        return res.status(500).json({
            message:
                "Error while reverting repository"
        });
    }
};



module.exports = {
    initRepo,
    commitRepo,
    revertRepo
};