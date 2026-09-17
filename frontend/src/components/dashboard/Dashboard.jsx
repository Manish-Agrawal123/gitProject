import "./Dashboard.css";
import { useState,useEffect } from "react";
import axios from "axios";
import SuggestedRepoCard from "./SuggestedRepoCard";
import RepoSidebar from "./RepoSidebar";
import Changelog from "./Changelog";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Navbar from "./Navbar";

const Dashboard = () =>{

    let [userRepos,setUserRepos] = useState([]);
    let [suggRepos,setSuggRepo] = useState([]);
    let [search,setSearch] = useState("");
    let [starredRepos,setStarredRepos] = useState([]);

    const isMobile = useMediaQuery("(max-width:599px)");

    const userId = localStorage.getItem("userId");

    const searchResult = userRepos.filter((repo) =>
        repo.name?.toLowerCase().includes(search.toLowerCase())
    );


    const handleStar = async (repoId) => {
        try {

            const res = await axios.patch(`http://localhost:3000/star/${repoId}`, {
                userId
            });

            setStarredRepos(res.data.starRepo || []);
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
                setStarredRepos(response.data.starRepo || []);
            }
            catch(err){
                console.error("Error in fetching star reposatories",err);
            }
        }
        fetchStarRepos();
    },[userId]);

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
    },[starredRepos])

    return(<>
        <Navbar/>
        <Grid container spacing={5} sx={{ paddingTop: 3 }}>

            {/* First Aside - visible from 600px and above */}
            {!isMobile && (
                <Grid
                    size={{ xs: 3, md: 3 }}
                    sx={{
                        borderRight: {
                            xs: "none",
                            md: "1px solid #30363d",
                        },
                        minHeight: "100vh",
                        pr: 2,
                        boxSizing: "border-box",
                    }}
                >
                    <RepoSidebar
                        search={search}
                        setSearch={setSearch}
                        searchResult={searchResult}
                    />
                </Grid>
            )}

            {/* Main */}
            <Grid
                size={{
                    xs: isMobile ? 12 : 9,
                    md: 6,
                }}
            >

                {/* RepoSidebar inside Main on mobile */}
                {isMobile && (
                    <RepoSidebar
                        search={search}
                        setSearch={setSearch}
                        searchResult={searchResult}
                    />
                )}

                <h2>Suggest Repositories</h2>

                {suggRepos.map((repo) => (
                    <SuggestedRepoCard
                        key={repo._id}
                        repo={repo}
                        handleStar={handleStar}
                        starredRepos={starredRepos}
                    />
                ))}

            </Grid>

            {/* Second Aside - visible from 600px and above? */}
            {!isMobile && (
                <Grid
                    size={{ xs: 0, md: 3 }}
                    sx={{
                        display: {
                            xs: "none",
                            md: "block",
                        },
                    }}
                >
                    <Changelog />
                </Grid>
            )}

        </Grid>
    </>);
}

export default Dashboard;