import "./Dashboard.css";
import { useState,useEffect } from "react";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";

const Dashboard = () =>{
    let [userRepos,setUserRepos] = useState([]);
    let [suggRepos,setSuggRepo] = useState([]);
    let [search,setSearch] = useState("");
    let [searchResult,setSearchResult] = useState([]);
    const [starredRepos, setStarredRepos] = useState([]);

    const userId = localStorage.getItem("userId");


    const handleStar = async (repoId) => {
        try {

            const res = await axios.patch(`http://localhost:3000/star/${repoId}`, {
                userId
            });

            setStarredRepos(res.data.starRepo);
        } catch (err) {
            console.error("Error updating star:", err);
        }
    };

    useEffect(()=>{
        const fetchRepos = async () =>{
            try{
                const response = await axios.get(`http://localhost:3000/repo/user/${userId}`);
                setUserRepos(response.data);
            }
            catch(err){
                console.error("Error in fetching reposatories",err);
            }
        }
        fetchRepos();
    },[userId]);

    useEffect(()=>{
        const fetchStarRepos = async () =>{
            try{
                const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
                setStarredRepos(response.data.starRepo);
            }
            catch(err){
                console.error("Error in fetching star reposatories",err);
            }
        }
        fetchStarRepos();
    },[]);

    useEffect(()=>{
        const fetchSuggRepos = async () =>{
            try{
                const response = await axios.get(`http://localhost:3000/repo/all`);
                setSuggRepo(response.data);
            }
            catch(err){
                console.error("Error in fetching reposatories",err);
            }
        }
        fetchSuggRepos();
    },[])

    useEffect(()=>{
        if(search == ""){
            setSearchResult(userRepos);
        }else{
            const filteredRepo = userRepos.filter((repo)=>{
                return repo.name.toLowerCase().includes(search.toLowerCase());
            })
            setSearchResult(filteredRepo);
        }
    },[search,userRepos])

    return(<>
        <section id ="Dashboard">
            <aside>
                <h2>Suggest Reposatories </h2>
                {suggRepos.map((repo)=>{
                    return <div key = {repo._id}>
                        <h4 style={{ display: "inline" }}>{repo.name}</h4>
                        <IconButton onClick={() => handleStar(repo._id)}>
                            <StarIcon
                                sx={{
                                    color: starredRepos.includes(repo._id)
                                        ? "gold"
                                        : "gray"
                                }}
                            />
                        </IconButton>
                        <h5>{repo.description}</h5>
                    </div>
                })}
            </aside>
            <main>
                <h2>Your Repos</h2>
                <input placeholder="Search..." type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
                {searchResult.map((repo)=>{
                    return <div key = {repo._id}>
                        <h4>{repo.name}</h4>
                        <h5>{repo.description}</h5>
                    </div>
                })}
            </main>
            <aside>
                <h2>Trending</h2>
                <div>
                    <h4>Airtificial Intelligence</h4>
                </div>
                <div>
                    <h4>Airtificial Intelligence</h4>
                </div>
                <div>
                    <h4>Airtificial Intelligence</h4>
                </div>
            </aside>
        </section>
    </>);
}

export default Dashboard;