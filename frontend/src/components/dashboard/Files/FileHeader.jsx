import {
    Box,
    Typography,
    IconButton,
} from "@mui/material";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const FileHeader = ({ file }) => {

    const handleCopy = async () => {
        await navigator.clipboard.writeText(file.content);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                px: {
                    xs: 1.5,
                    sm: 2,
                },

                py: {
                    xs: 1.25,
                    sm: 1.5,
                },

                borderBottom: "1px solid #30363d",

                minWidth: 0,
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0,
                }}
            >

                <InsertDriveFileOutlinedIcon
                    sx={{
                        fontSize: {
                            xs: 18,
                            sm: 19,
                        },

                        color: "#8b949e",

                        flexShrink: 0,
                    }}
                />

                <Typography
                    sx={{
                        color: "#e6edf3",

                        fontSize: {
                            xs: "13px",
                            sm: "14px",
                        },

                        fontWeight: 600,

                        minWidth: 0,

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {file.fileName}
                </Typography>

            </Box>


            <IconButton
                onClick={handleCopy}
                sx={{
                    color: "#c9d1d9",
                    flexShrink: 0,

                    "&:hover": {
                        backgroundColor: "#30363d",
                    },
                }}
            >
                <ContentCopyIcon
                    sx={{
                        fontSize: {
                            xs: 18,
                            sm: 20,
                        },
                    }}
                />
            </IconButton>

        </Box>
    );
};

export default FileHeader;