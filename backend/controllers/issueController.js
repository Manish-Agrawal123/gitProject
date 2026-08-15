const createIssue = (req,res)=>{
    res.send("createIssue");
}

const updateIssue = (req,res)=>{
    res.send("updateIssue");
}

const deleteIssue = (req,res)=>{
    res.send("deleteIssue");
}

const getAllIssueByRepo = (req,res)=>{
    res.send("getAllIssue");
}

const getIssueById = (req,res)=>{
    res.send("getIssueById");
}

module.exports = {
    createIssue,
    updateIssue,
    deleteIssue,
    getAllIssueByRepo,
    getIssueById,
}