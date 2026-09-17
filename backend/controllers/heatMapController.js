const Cotr = require("../models/contributionModel.js");

const getValues = async (req,res) =>{
    const userId = req.params.id;
    try{
        const values = await Cotr.findOne({user:userId});
        if(!values){
            res.status(404).json("error in heatmap");
            return;
        }
        res.json(values.contribution);
    }catch (err) {

        console.error("error in heatmap", err);

        res.status(500).json({
            message: "error in heatmap"
        });
    }
}


module.exports = getValues;