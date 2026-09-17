import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navbar from "./Navbar";

import SuggestedRepoCard from "./SuggestedRepoCard";

const Repositories = () => {
    const [repositories, setRepositories] = useState([]);
    const [starredRepos, setStarredRepos] = useState([]);

    const userId = localStorage.getItem("userId");

    // Fetch all repositories
    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/repo/all"
                );

                setRepositories(response.data);
            } catch (err) {
                console.error(
                    "Error in fetching repositories:",
                    err
                );
            }
        };

        fetchRepositories();
    }, []);

    // Fetch repositories starred by current user
    useEffect(() => {
        const fetchStarredRepos = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/userProfile/${userId}`
                );

                setStarredRepos(response.data.starRepo || []);
            } catch (err) {
                console.error(
                    "Error in fetching starred repositories:",
                    err
                );
            }
        };

        if (userId) {
            fetchStarredRepos();
        }
    }, [userId]);

    // Star / Unstar repository
    const handleStar = async (repoId) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/star/${repoId}`,
                {
                    userId,
                }
            );

            // Backend returns updated user's starRepo
            setStarredRepos(response.data.starRepo || []);

            // Update star count immediately
            setRepositories((prevRepos) =>
                prevRepos.map((repo) => {
                    if (repo._id !== repoId) {
                        return repo;
                    }

                    const isCurrentlyStarred =
                        starredRepos.some(
                            (id) => id.toString() === repoId.toString()
                        );

                    return {
                        ...repo,
                        stars: isCurrentlyStarred
                            ? Math.max((repo.stars || 0) - 1, 0)
                            : (repo.stars || 0) + 1,
                    };
                })
            );
        } catch (err) {
            console.error(
                "Error updating star:",
                err
            );
        }
    };

    return (
        <>
        <Navbar/>
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
        </>
    );
};

export default Repositories;