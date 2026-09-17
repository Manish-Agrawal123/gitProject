import { Paper } from "@mui/material";

import FileItem from "./FileItem";

const FileList = ({ files, onFileClick }) => {

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                backgroundColor: "#1f1f1f",
                border: "1px solid #30363d",
                borderRadius: "8px",
                overflow: "hidden",
            }}
        >

            {files.map((file) => (
                <FileItem
                    key={file.key}
                    file={file}
                    onClick={onFileClick}
                />
            ))}

        </Paper>
    );
};

export default FileList;