import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Box } from "@mui/material";

import FileList from "./FileList";
import FileViewer from "./FileViewer";

const Files = () => {

    const { repoId } = useParams();

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {

        const fetchFiles = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/repo/files/${repoId}`
                );

                setFiles(response.data);

            } catch (err) {
                console.error("Error fetching files:", err);
            }
        };

        fetchFiles();

    }, [repoId]);


    return (
        <Box sx={{ width: "100%" }}>

            <FileList
                files={files}
                onFileClick={setSelectedFile}
            />

            {selectedFile && (
                <FileViewer file={selectedFile} />
            )}

        </Box>
    );
};

export default Files;