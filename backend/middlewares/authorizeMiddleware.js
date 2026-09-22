const Reposatory = require("../models/repoModel.js");

const authorizeRepository = async (req, res, next) => {

    try {

        const repo = await Reposatory.findById(
            req.params.id
        );

        if (!repo) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        if (
            repo.owner.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to access this repository"
            });
        }

        // Store repository so controller can use it
        req.repo = repo;

        next();

    } catch (error) {

        console.error(
            "Authorization error:",
            error
        );

        return res.status(500).json({
            message: "Authorization failed"
        });
    }
};

module.exports = authorizeRepository;