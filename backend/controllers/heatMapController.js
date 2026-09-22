const Cotr = require("../models/contributionModel.js");

const getValues = async (req, res) => {
    try {
        const userId = req.params.id;

        const values = await Cotr.findOne({
            user: userId,
        });

        // New user / no contributions yet
        if (!values) {
            return res.status(200).json([]);
        }

        return res.status(200).json(
            values.contribution || []
        );
    } catch (error) {
        console.error("Heatmap error:", error);

        return res.status(500).json({
            message: "Error fetching heatmap",
        });
    }
};


module.exports = getValues;