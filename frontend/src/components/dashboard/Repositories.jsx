import { useState, useEffect } from "react";
import api from "../../axios.js";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Navbar from "./Navbar";
import Footer from "./Footer.jsx";
import SuggestedRepoCard from "./SuggestedRepoCard";

const Repositories = () => {
    const [repositories, setRepositories] = useState([]);
    const [starredRepos, setStarredRepos] = useState([]);

    const userId = localStorage.getItem("userId");

    // Fetch all repositories
    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const response = await api.get("/repo/all");

                setRepositories(response.data);
            } catch (error) {
                console.error(
                    "Error in fetching repositories:",
                    error
                );
            }
        };

        fetchRepositories();
    }, []);

    // Fetch user's starred repositories
    useEffect(() => {
        const fetchStarredRepos = async () => {
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

        fetchStarredRepos();
    }, [userId]);

    // Star / Unstar repository
    const handleStar = async (repoId) => {
        try {
            const wasStarred = starredRepos.some(
                (id) => id.toString() === repoId.toString()
            );

            const response = await api.patch(`/star/${repoId}`);

            setStarredRepos(response.data.starRepo || []);

            // Update star count locally
            setRepositories((previousRepositories) =>
                previousRepositories.map((repo) => {
                    if (repo._id !== repoId) {
                        return repo;
                    }

                    return {
                        ...repo,
                        stars: wasStarred
                            ? Math.max((repo.stars || 0) - 1, 0)
                            : (repo.stars || 0) + 1,
                    };
                })
            );
        } catch (error) {
            console.error(
                "Error updating star:",
                error
            );
        }
    };

    return (
        <>
            <Navbar />

            <Box
                sx={{
                    minHeight: "100vh",
                    backgroundColor: "#0d1117",
                    color: "#f0f6fc",
                    p: 3,
                }}
            >
                <Box
                    sx={{
                        maxWidth: "900px",
                        mx: "auto",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "26px",
                            fontWeight: 600,
                            mb: 3,
                        }}
                    >
                        All Repositories
                    </Typography>

                    {repositories.map((repo) => (
                        <SuggestedRepoCard
                            key={repo._id}
                            repo={repo}
                            handleStar={handleStar}
                            starredRepos={starredRepos}
                        />
                    ))}
                </Box>
            </Box>
            <Footer/>
        </>
    );
};

export default Repositories;