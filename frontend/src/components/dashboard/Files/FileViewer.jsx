import { Paper, Box, Typography } from "@mui/material";

import FileHeader from "./FileHeader";

const FileViewer = ({ file }) => {

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",

                mt: {
                    xs: 2,
                    sm: 3,
                },

                backgroundColor: "#1f1f1f",

                border: "1px solid #30363d",

                borderRadius: "8px",

                overflow: "hidden",
            }}
        >

            <FileHeader file={file} />

            <Box
                sx={{
                    p: {
                        xs: 1.5,
                        sm: 2,
                    },

                    maxHeight: {
                        xs: "500px",
                        sm: "600px",
                    },

                    overflowX: "auto",
                    overflowY: "auto",

                    width: "100%",
                    boxSizing: "border-box",
                }}
            >

                <Typography
                    component="pre"
                    sx={{
                        margin: 0,

                        color: "#e6edf3",

                        fontFamily:
                            "'Fira Code', 'Consolas', monospace",

                        fontSize: {
                            xs: "12px",
                            sm: "13px",
                            md: "14px",
                        },

                        lineHeight: 1.6,

                        whiteSpace: "pre",

                        minWidth: "max-content",
                    }}
                >
                    {file.content}
                </Typography>

            </Box>

        </Paper>
    );
};

export default FileViewer;