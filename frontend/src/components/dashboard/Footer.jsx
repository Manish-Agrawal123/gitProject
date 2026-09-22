import { Box } from "@mui/material";

const  Footer = () => {
    return(
        <>
        <Box
            component="footer"
            sx={{
                textAlign: "center",
                py: 2,
                color: "#8b949e",
                fontSize: "13px",
                borderTop: "1px solid #30363d",
                mt: 4,
            }}
        >
            © 2026 GitClone · Built with React & Node.js
        </Box>
        </>
    );
}

export default Footer;