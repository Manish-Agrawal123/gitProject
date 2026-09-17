import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
    Box,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const ProfileRepoCard = ({ repo }) => {
    const navigate = useNavigate();
    return (
        <Card
            sx={{
                backgroundColor: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "7px",
                boxShadow: "none",
                height: "100%",
            }}
        >
            <CardContent>
                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            onClick={() => navigate(`/files/${repo._id}`)}
                            sx={{
                                color: "#58a6ff",
                                fontSize: "16px",
                                fontWeight: 600,
                                cursor: "pointer",

                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            {repo.name}
                        </Typography>
                    </Stack>

                    {repo.description && (
                        <Typography
                            sx={{
                                color: "#8b949e",
                                fontSize: "14px",
                            }}
                        >
                            {repo.description}
                        </Typography>
                    )}

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: "#f1e05a",
                            }}
                        />

                        <Typography
                            sx={{
                                color: "#8b949e",
                                fontSize: "13px",
                            }}
                        >
                            {repo.language}
                        </Typography>
                    </Stack>

                </Stack>
            </CardContent>
        </Card>
    );
};

export default ProfileRepoCard;