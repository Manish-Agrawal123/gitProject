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
    starredRepos = [],
}) {
    const isStarred = starredRepos.some(
        (id) =>
            id?.toString() === repo._id?.toString()
    );

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
            {/* Repository header */}

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    alignItems: "center",
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: "#30363d",
                        color: "#f0f6fc",
                    }}
                >
                    {repo.owner?.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                </Avatar>

                <Link
                    to={`/files/${repo._id}`}
                    style={{
                        textDecoration: "none",
                        color: "white",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: "20px",
                        }}
                    >
                        {repo.name}
                    </Typography>
                </Link>

                <IconButton
                    onClick={() =>
                        handleStar(repo._id)
                    }
                >
                    <StarIcon
                        sx={{
                            color: isStarred
                                ? "gold"
                                : "gray",
                        }}
                    />
                </IconButton>
            </Stack>

            {/* Description */}

            <Typography
                sx={{
                    color: "#8b949e",
                    margin: "1rem",
                    fontWeight: 500,
                }}
            >
                {repo.description}
            </Typography>

            {/* Repository information */}

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    color: "#8b949e",
                    margin: "1rem",
                    fontWeight: 250,
                    alignItems: "center",
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

                <Typography
                    sx={{
                        fontSize: "14px",
                    }}
                >
                    Not specified
                </Typography>

                <Typography
                    sx={{
                        fontSize: "14px",
                    }}
                >
                    ☆ {repo.stars || 0}
                </Typography>
            </Stack>
        </Card>
    );
}

export default SuggestedRepoCard;