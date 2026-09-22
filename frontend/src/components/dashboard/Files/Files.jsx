import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../../axios.js";

import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

import FileList from "./FileList";
import FileViewer from "./FileViewer";

const Files = () => {
    const { repoId } = useParams();

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/repo/files/${repoId}`
                );

                setFiles(response.data || []);
            } catch (err) {
                console.error(
                    "Error fetching files:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to fetch repository files."
                );
            } finally {
                setLoading(false);
            }
        };

        if (repoId) {
            fetchFiles();
        }
    }, [repoId]);

    const handleFileClick = (file) => {
        setSelectedFile(file);
    };

    if (loading) {
        return (
           <>
             <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    py: 5,
                }}
            >
                <CircularProgress />
            </Box>
           </>
        );
    }

    if (error) {
        return (
            <>
            <Box
                sx={{
                    width: "100%",
                    py: 4,
                }}
            >
                <Typography color="error">
                    {error}
                </Typography>
            </Box>
            </>
        );
    }

    if (files.length === 0) {
        return (
            <>
            <Navbar/>
            <Box
                sx={{
                    width: "100%",
                    py: 4,
                }}
            >
                <Typography
                    sx={{
                        color: "#8b949e",
                    }}
                >
                    This repository has no files in the
                    current commit.
                </Typography>
            </Box>
            <Footer/>
            </>
        );
    }

    return (
        <>
        <Navbar/>
        <Box
            sx={{
                width: "100%",
            }}
        >
            <FileList
                files={files}
                onFileClick={handleFileClick}
            />

            {selectedFile && (
                <FileViewer
                    file={selectedFile}
                />
            )}
        </Box>
        <Footer/>
        </>
    );
};

export default Files;