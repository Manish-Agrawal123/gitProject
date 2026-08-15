const getAlluser = (req,res)=>{
    res.send("get all user");
}

const signup = (req,res)=>{
    res.send("signup controller");
}

const login = (req,res)=>{
    res.send("login");
}

const getUserProfile = (req,res)=>{
    res.send("getUserProfile");
}

const deleteUserProfile = (req,res)=>{
    res.send("deletaUserProfile");
}

const updateUserProfile = (req,res)=>{
    res.send("updateUserProfile");
}

module.exports = {
    getAlluser,
    login,
    signup,
    updateUserProfile,
    deleteUserProfile,
    getUserProfile,
}