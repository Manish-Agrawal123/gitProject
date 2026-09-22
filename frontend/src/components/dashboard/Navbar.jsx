import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const Navbar = () => {
    const location = useLocation();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        window.location.href = "/login";
    };
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#010409",
                boxShadow: "none",
                borderBottom: "1px solid #30363d",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: "64px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >

                {/* Left side */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>


                    {/* Menu */}
                    <Tooltip title="Menu">
                        <IconButton
                            sx={{
                                color: "#f0f6fc",
                                border: "1px solid #30363d",
                                borderRadius: "8px",
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>

                    {/* Logo */}
                    <Link to="/">
                        <GitHubIcon
                            sx={{
                                color: "#f0f6fc",
                                fontSize: 38,
                                ml: 1,
                            }}
                        />
                    </Link>

                </Box>


                {/* Right side */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >

                    {location.pathname === "/profile"?
                        <Tooltip title="logout">
                            <Button sx={{color:"white"}} onClick={handleLogout}>
                                Logout
                            </Button>
                        </Tooltip>:null
                    }

                    {/* All repositories */}
                    <Tooltip title="All Repositories">
                        <IconButton
                            component={Link}
                            to="/repositories"
                            sx={{
                                color: "#f0f6fc",
                                border: "1px solid #30363d",
                                borderRadius: "8px",
                            }}
                        >
                            <FolderIcon />
                        </IconButton>
                    </Tooltip>


                    {/* Create repository */}
                    <Tooltip title="Create Repository">
                        <IconButton
                            component={Link}
                            to="/repo/create"
                            sx={{
                                color: "#f0f6fc",
                                border: "1px solid #30363d",
                                borderRadius: "8px",
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>


                    {/* Profile */}
                    <Tooltip title="Profile">
                        <IconButton
                            component={Link}
                            to="/profile"
                            sx={{
                                p: 0.5,
                                ml: 1,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 38,
                                    height: 38,
                                    bgcolor: "#e7b6e8",
                                }}
                            >
                                T
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                </Box>

            </Toolbar>
        </AppBar>
    );
};

export default Navbar;