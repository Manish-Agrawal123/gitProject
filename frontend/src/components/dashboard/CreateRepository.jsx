import { useState } from "react";
import axios from "axios";

import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

const CreateRepository = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState(true);
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem("userId");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !description.trim()) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(`http://localhost:3000/repo/create/${userId}`, {
                name: name.trim(),
                description: description.trim(),
                visibility,
            });

            console.log("Repository created:", data);

        } catch (error) {
            console.error(
                "Error creating repository:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 768,
                mx: "auto",
                px: 3,
                py: 5,
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    sx={{
                        fontSize: 26,
                        fontWeight: 600,
                        color: "#1f2328",
                        mb: 1,
                    }}
                >
                    Create a new repository
                </Typography>

                <Typography
                    sx={{
                        fontSize: 14,
                        color: "#656d76",
                    }}
                >
                    A repository contains all project files and the revision
                    history.
                </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>

                    {/* Repository name */}
                    <Box>
                        <FormLabel
                            sx={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#1f2328",
                                mb: 1,
                            }}
                        >
                            Repository name
                            <Box
                                component="span"
                                sx={{
                                    color: "#cf222e",
                                    ml: 0.5,
                                }}
                            >
                                *
                            </Box>
                        </FormLabel>

                        <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="my-project"
                            required
                            size="small"
                            fullWidth
                            sx={{
                                maxWidth: 500,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                },
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 12,
                                color: "#656d76",
                                mt: 1,
                            }}
                        >
                            A short and memorable name for your repository.
                        </Typography>
                    </Box>

                    {/* Description */}
                    <Box>
                        <FormLabel
                            sx={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#1f2328",
                                mb: 1,
                            }}
                        >
                            Description
                            <Box
                                component="span"
                                sx={{
                                    color: "#cf222e",
                                    ml: 0.5,
                                }}
                            >
                                *
                            </Box>
                        </FormLabel>

                        <TextField
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="A short description of your project"
                            required
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                },
                            }}
                        />
                    </Box>

                    {/* Visibility */}
                    <Box>
                        <FormControl fullWidth>
                            <FormLabel
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#1f2328",
                                    mb: 1,
                                }}
                            >
                                Visibility
                            </FormLabel>

                            <RadioGroup
                                value={
                                    visibility
                                        ? "public"
                                        : "private"
                                }
                                onChange={(e) =>
                                    setVisibility(
                                        e.target.value === "public"
                                    )
                                }
                            >
                                {/* Public */}
                                <Box
                                    sx={{
                                        border: "1px solid #d0d7de",
                                        borderRadius: 1,
                                        p: 1.5,
                                        mb: 1.5,
                                    }}
                                >
                                    <FormControlLabel
                                        value="public"
                                        control={<Radio size="small" />}
                                        sx={{
                                            m: 0,
                                            width: "100%",
                                            alignItems: "flex-start",
                                        }}
                                        label={
                                            <Box sx={{ pt: 0.3 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        color: "#1f2328",
                                                    }}
                                                >
                                                    Public
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        color: "#656d76",
                                                        mt: 0.3,
                                                    }}
                                                >
                                                    Anyone can see this
                                                    repository.
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </Box>

                                {/* Private */}
                                <Box
                                    sx={{
                                        border: "1px solid #d0d7de",
                                        borderRadius: 1,
                                        p: 1.5,
                                    }}
                                >
                                    <FormControlLabel
                                        value="private"
                                        control={<Radio size="small" />}
                                        sx={{
                                            m: 0,
                                            width: "100%",
                                            alignItems: "flex-start",
                                        }}
                                        label={
                                            <Box sx={{ pt: 0.3 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        color: "#1f2328",
                                                    }}
                                                >
                                                    Private
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        color: "#656d76",
                                                        mt: 0.3,
                                                    }}
                                                >
                                                    Only you can see this
                                                    repository.
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </Box>
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    {/* Create button */}
                    <Box
                        sx={{
                            pt: 2,
                            borderTop: "1px solid #d8dee4",
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                loading ||
                                !name.trim() ||
                                !description.trim()
                            }
                            sx={{
                                backgroundColor: "#1f883d",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: 14,
                                borderRadius: 1,
                                px: 2,
                                "&:hover": {
                                    backgroundColor: "#1a7f37",
                                },
                            }}
                        >
                            {loading
                                ? "Creating..."
                                : "Create repository"}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default CreateRepository;
