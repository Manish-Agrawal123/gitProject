const createReposatory = (req,res)=>{
    res.send("createReposatory");
}

const getAllreposatory = (req,res)=>{
    res.send("getAllreposatory");
}

const fetchRepoById = (req,res)=>{
    res.send("fetchRepoById");
}

const fetchRepoByName = (req,res)=>{
    res.send("fetchRepoByName");
}

const fetchRepoCurrUser = (req,res)=>{
    res.send("fetchRepoCurrUser");
}

const updateReposatory = (req,res)=>{
    res.send("updateReposatory");
}

const toggleReposatory = (req,res)=>{
    res.send("toggleReposatory");
}

const deleteReposatory = (req,res)=>{
    res.send("deleteReposatory");
}

module.exports = {
    createReposatory,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoCurrUser,
    updateReposatory,
    toggleReposatory,
    deleteReposatory,
    getAllreposatory,
}