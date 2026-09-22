import "./Dashboard.css";
import { useState, useEffect } from "react";
import api from "../../axios.js";

import SuggestedRepoCard from "./SuggestedRepoCard";
import RepoSidebar from "./RepoSidebar";
import Changelog from "./Changelog";

import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";

import Navbar from "./Navbar";
import Footer from "./Footer.jsx";

const Dashboard = () => {
    const [userRepos, setUserRepos] = useState([]);
    const [suggRepos, setSuggRepo] = useState([]);
    const [search, setSearch] = useState("");
    const [starredRepos, setStarredRepos] = useState([]);

    const isMobile = useMediaQuery("(max-width:599px)");

    const userId = localStorage.getItem("userId");

    const searchResult = userRepos.filter((repo) =>
        repo.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Star / Unstar repository
    const handleStar = async (repoId) => {
        try {
            const response = await api.patch(`/star/${repoId}`);

            setStarredRepos(response.data.starRepo || []);
        } catch (error) {
            console.error("Error updating star:", error);
        }
    };

    // Fetch user's repositories
    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await api.get("/repo/user");

                setUserRepos(response.data);
            } catch (error) {
                console.error(
                    "Error in fetching repositories:",
                    error
                );
            }
        };

        fetchRepos();
    }, [userId]);

    // Fetch repositories starred by current user
    useEffect(() => {
        const fetchStarRepos = async () => {
            try {
                const response = await api.get("/userProfile");

                setStarredRepos(response.data.starRepo || []);
            } catch (error) {
                console.error(
                    "Error in fetching starred repositories:",
                    error
                );
            }
        };

        fetchStarRepos();
    }, [userId]);

    // Fetch all repositories
    useEffect(() => {
        const fetchSuggRepos = async () => {
            try {
                const response = await api.get("/repo/all");

                setSuggRepo(response.data);
            } catch (error) {
                console.error(
                    "Error in fetching repositories:",
                    error
                );
            }
        };

        fetchSuggRepos();
    }, [starredRepos]);

    return (
        <>
            <Navbar />

            <Grid
                container
                spacing={5}
                sx={{
                    paddingTop: 3,
                }}
            >
                {/* LEFT SIDEBAR */}
                {!isMobile && (
                    <Grid
                        size={{
                            xs: 3,
                            md: 3,
                        }}
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

                {/* MAIN */}
                <Grid
                    size={{
                        xs: isMobile ? 12 : 9,
                        md: 6,
                    }}
                >
                    {/* Sidebar on mobile */}
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

                {/* CHANGELOG */}
                {!isMobile && (
                    <Grid
                        size={{
                            xs: 0,
                            md: 3,
                        }}
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
            <Footer/>
        </>
    );
};

export default Dashboard;