import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios.js";

import Navbar from "./Navbar";
import Footer from "./Footer.jsx";

import {
    Box,
    Typography,
    TextField,
    Radio,
    Button,
    FormControl,
    FormLabel,
    FormControlLabel,
    Divider,
} from "@mui/material";

const CreateRepository = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");

    const handleCreateRepository = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Repository name is required");
            return;
        }

        if (!description.trim()) {
            setError("Description is required");
            return;
        }

        if (!userId) {
            setError("User is not logged in");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                `/repo/create`,
                {
                    name: name.trim(),
                    description: description.trim(),
                    visibility: visibility,
                }
            );

            console.log("Repository created:", response.data);

            // Go back to dashboard after successful creation
            navigate("/");
        } catch (err) {
            console.error("Repository creation failed:", err);

            setError(
                err.response?.data?.message ||
                "Failed to create repository"
            );
        } finally {
            setLoading(false);
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
                px: { xs: 2, sm: 4 },
                py: 4,
            }}
        >
            <Box
                component="form"
                onSubmit={handleCreateRepository}
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                }}
            >
                {/* Header */}
                <Typography
                    sx={{
                        fontSize: { xs: 24, sm: 28 },
                        fontWeight: 600,
                        color: "#f0f6fc",
                        mb: 1,
                    }}
                >
                    Create a new repository
                </Typography>

                <Typography
                    sx={{
                        fontSize: 15,
                        color: "#8b949e",
                        mb: 4,
                    }}
                >
                    A repository contains all project files and the revision
                    history.
                </Typography>

                {/* Repository name */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel
                        sx={{
                            color: "#f0f6fc",
                            fontSize: 14,
                            fontWeight: 600,
                            mb: 1,
                        }}
                    >
                        Repository name
                        <Box
                            component="span"
                            sx={{ color: "#f85149", ml: 0.5 }}
                        >
                            *
                        </Box>
                    </FormLabel>

                    <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="my-project"
                        size="small"
                        fullWidth
                        autoComplete="off"
                        sx={{
                            maxWidth: 560,

                            "& .MuiOutlinedInput-root": {
                                color: "#f0f6fc",
                                backgroundColor: "#0d1117",

                                "& fieldset": {
                                    borderColor: "#30363d",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#8b949e",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#58a6ff",
                                    borderWidth: 1,
                                },
                            },

                            "& .MuiInputBase-input::placeholder": {
                                color: "#6e7681",
                                opacity: 1,
                            },
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#8b949e",
                            mt: 1,
                        }}
                    >
                        A short and memorable name for your repository.
                    </Typography>
                </FormControl>

                {/* Description */}
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <FormLabel
                        sx={{
                            color: "#f0f6fc",
                            fontSize: 14,
                            fontWeight: 600,
                            mb: 1,
                        }}
                    >
                        Description
                        <Box
                            component="span"
                            sx={{ color: "#f85149", ml: 0.5 }}
                        >
                            *
                        </Box>
                    </FormLabel>

                    <TextField
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A short description of your project"
                        multiline
                        rows={4}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#f0f6fc",
                                backgroundColor: "#0d1117",

                                "& fieldset": {
                                    borderColor: "#30363d",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#8b949e",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#58a6ff",
                                    borderWidth: 1,
                                },
                            },

                            "& .MuiInputBase-input::placeholder": {
                                color: "#6e7681",
                                opacity: 1,
                            },
                        }}
                    />
                </FormControl>

                {/* Visibility */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel
                        sx={{
                            color: "#f0f6fc",
                            fontSize: 14,
                            fontWeight: 600,
                            mb: 1.5,
                        }}
                    >
                        Visibility
                    </FormLabel>

                    {/* Public */}
                    <Box
                        onClick={() => setVisibility(true)}
                        sx={{
                            border: "1px solid #30363d",
                            borderRadius: "6px",
                            p: 2,
                            mb: 1.5,
                            cursor: "pointer",

                            "&:hover": {
                                backgroundColor: "#161b22",
                                borderColor: "#8b949e",
                            },
                        }}
                    >
                        <FormControlLabel
                            value="public"
                            control={
                                <Radio
                                    checked={visibility === true}
                                    onChange={() => setVisibility(true)}
                                    sx={{
                                        color: "#6e7681",
                                        "&.Mui-checked": {
                                            color: "#58a6ff",
                                        },
                                    }}
                                />
                            }
                            label={
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#f0f6fc",
                                        }}
                                    >
                                        Public
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: "#8b949e",
                                            mt: 0.3,
                                        }}
                                    >
                                        Anyone can see this repository.
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                m: 0,
                                width: "100%",
                            }}
                        />
                    </Box>

                    {/* Private */}
                    <Box
                        onClick={() => setVisibility(false)}
                        sx={{
                            border: "1px solid #30363d",
                            borderRadius: "6px",
                            p: 2,
                            cursor: "pointer",

                            "&:hover": {
                                backgroundColor: "#161b22",
                                borderColor: "#8b949e",
                            },
                        }}
                    >
                        <FormControlLabel
                            value="private"
                            control={
                                <Radio
                                    checked={visibility === false}
                                    onChange={() => setVisibility(false)}
                                    sx={{
                                        color: "#6e7681",
                                        "&.Mui-checked": {
                                            color: "#58a6ff",
                                        },
                                    }}
                                />
                            }
                            label={
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#f0f6fc",
                                        }}
                                    >
                                        Private
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            color: "#8b949e",
                                            mt: 0.3,
                                        }}
                                    >
                                        Only you can see this repository.
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                m: 0,
                                width: "100%",
                            }}
                        />
                    </Box>
                </FormControl>

                {/* Error */}
                {error && (
                    <Typography
                        sx={{
                            color: "#f85149",
                            fontSize: 14,
                            mb: 2,
                        }}
                    >
                        {error}
                    </Typography>
                )}

                <Divider
                    sx={{
                        borderColor: "#30363d",
                        mb: 2,
                    }}
                />

                {/* Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                    }}
                >
                    <Button
                        type="submit"
                        disabled={loading}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            backgroundColor: "#238636",
                            color: "#ffffff",
                            px: 2,

                            "&:hover": {
                                backgroundColor: "#2ea043",
                            },

                            "&:disabled": {
                                backgroundColor: "#21262d",
                                color: "#6e7681",
                            },
                        }}
                    >
                        {loading ? "Creating..." : "Create repository"}
                    </Button>

                    <Button
                        type="button"
                        onClick={() => navigate("/")}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: "#f0f6fc",
                            border: "1px solid #30363d",
                            px: 2,

                            "&:hover": {
                                backgroundColor: "#161b22",
                                borderColor: "#8b949e",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
        <Footer/>
        </>
    );
};

export default CreateRepository;