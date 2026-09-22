import { useEffect, useState } from "react";

import api from "../../axios.js";

import Navbar from "../dashboard/Navbar";
import Footer from "../dashboard/Footer.jsx";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import useMediaQuery from "@mui/material/useMediaQuery";

import {
    Avatar,
    Box,
    Button,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import ProfileRepoCard from "./ProfileRepoCard";

import "./Profile.css";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [heatMap, setHeatMap] = useState([]);

    const userId = localStorage.getItem("userId");

    const isMobile = useMediaQuery(
        "(max-width:899px)"
    );

    // Fetch heatmap
    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchHeatMap = async () => {
            try {
                const response = await api.get(
                    `/heatMap/${userId}`
                );

                setHeatMap(response.data);
            } catch (error) {
                console.error(
                    "Error in fetching heatmap:",
                    error
                );
            }
        };

        fetchHeatMap();
    }, [userId]);

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(
                    "/userProfile"
                );

                setProfile(response.data);
            } catch (error) {
                console.error(
                    "Error in fetching profile:",
                    error
                );
            }
        };

        fetchProfile();
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        navigate("/login");
    };

    if (!profile) {
        return (
            <Box className="profile-page">
                <Typography>
                    Loading...
                </Typography>
            </Box>
        );
    }

    const endDate =
        new Date()
            .toISOString()
            .split("T")[0];

    const startDate1 = new Date();
    const startDate2 = new Date();

    startDate1.setMonth(
        startDate1.getMonth() - 6
    );

    startDate2.setMonth(
        startDate2.getMonth() - 12
    );

    const startDate1String =
        startDate1
            .toISOString()
            .split("T")[0];

    const startDate2String =
        startDate2
            .toISOString()
            .split("T")[0];

    return (
        <>
            <Navbar />

            <Box className="profile-page">
                <Grid
                    container
                    spacing={4}
                >
                    {/* LEFT SIDE */}

                    <Grid
                        size={{
                            xs: 12,
                            sm: 4,
                            md: 3,
                        }}
                        sx={{
                            display: "flex",
                            justifyContent: {
                                xs: "center",
                                md: "flex-start",
                            },
                        }}
                    >
                        <Stack spacing={2}>
                            <Avatar
                                sx={{
                                    width: 170,
                                    height: 170,
                                    fontSize: 90,
                                }}
                            >
                                {profile.username
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </Avatar>

                            <Box>
                                <Typography variant="h4">
                                    {profile.username}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        mt: 1.2,
                                    }}
                                >
                                    Edit profile
                                </Button>
                            </Box>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: "center",
                                }}
                            >
                                <Typography>
                                    {profile.followers?.length || 0}
                                </Typography>

                                <Typography>
                                    followers
                                </Typography>

                                <Typography>
                                    ·
                                </Typography>

                                <Typography>
                                    {profile.followedUser?.length || 0}
                                </Typography>

                                <Typography>
                                    following
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* RIGHT SIDE */}

                    <Grid
                        size={{
                            xs: 12,
                            sm: 8,
                            md: 9,
                        }}
                    >
                        <Stack
                            spacing={3}
                            sx={{
                                width: "100%",
                            }}
                        >
                            <Typography variant="h5">
                                Your repositories
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >
                                {profile.reposatory?.map((repo) => (
                                    <Grid
                                        key={repo._id}
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <ProfileRepoCard
                                            repo={repo}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            <Grid container>
                                <CalendarHeatmap
                                    startDate={
                                        isMobile
                                            ? startDate1String
                                            : startDate2String
                                    }
                                    endDate={endDate}
                                    values={heatMap}
                                />
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            <Footer/>
        </>
    );
};

export default Profile;