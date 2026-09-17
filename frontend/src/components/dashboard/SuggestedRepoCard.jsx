import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";

function SuggestedRepoCard({
    repo,
    handleStar,
    starredRepos
}) {
    return (
        <Card
            sx={{
                maxWidth: "100%",
                mb: 2,
                p: 2,
                backgroundColor: "#0d1117",
                color: "#f0f6fc",
                border: "1px solid #30363d",
                borderRadius: "8px",
                boxShadow: "none",
                "&:hover": {
                    borderColor: "#8b949e",
                },
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center">

                <Avatar sx={{ bgcolor: "#30363d", color: "#f0f6fc" }}>
                    {repo.owner?.username?.[0]?.toUpperCase()}
                </Avatar>

                <Link
                    to={`/files/${repo._id}`}
                    style={{
                        textDecoration: "none",
                        color: "white",
                    }}
                >
                    <p
                        style={{
                            fontWeight: 800,
                            fontSize: "20px",
                            margin: 0,
                        }}
                    >
                        {repo.name}
                    </p>
                </Link>

                <IconButton onClick={() => handleStar(repo._id)}>
                    <StarIcon
                        sx={{
                            color: starredRepos.includes(repo._id)
                                ? "gold"
                                : "gray"
                        }}
                    />
                </IconButton>

            </Stack>

            <p style={{ color: "#8b949e", margin: "1rem",fontWeight:500 }}>{repo.description}</p>


            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                    color: "#8b949e",
                    margin: "1rem",
                    fontWeight: 250,
                }}
            >
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#f1e05a",
                    }}
                />

                <Typography sx={{ fontSize: "14px" }}>
                    {"Not specified"}
                </Typography>

                <Typography sx={{ fontSize: "14px" }}>
                    ☆ {repo.stars || 0}
                </Typography>
            </Stack>
        </Card>
    );
}

export default SuggestedRepoCard;