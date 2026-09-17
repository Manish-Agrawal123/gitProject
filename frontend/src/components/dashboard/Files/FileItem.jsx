import {
    Box,
    Typography,
} from "@mui/material";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

const FileItem = ({ file, onClick }) => {

    return (
        <Box
            onClick={() => onClick(file)}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,

                px: {
                    xs: 1.5,
                    sm: 2,
                },

                py: {
                    xs: 1.25,
                    sm: 1.5,
                },

                cursor: "pointer",

                borderBottom: "1px solid #30363d",

                "&:last-child": {
                    borderBottom: "none",
                },

                "&:hover": {
                    backgroundColor: "#262c32",
                },
            }}
        >

            <InsertDriveFileOutlinedIcon
                sx={{
                    fontSize: {
                        xs: 18,
                        sm: 20,
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

                    fontWeight: 500,

                    minWidth: 0,

                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {file.fileName}
            </Typography>

        </Box>
    );
};

export default FileItem;