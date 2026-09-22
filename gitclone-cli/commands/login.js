const api = require("../api");
const fs = require("fs/promises");
const path = require("path");
const readline = require("readline");

async function cliLogin() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (text) => {
        return new Promise((resolve) => {
            rl.question(text, resolve);
        });
    };

    try {

        const email = await question("Email: ");
        const password = await question("Password: ");

        const response = await api.post(
            "/login",
            {
                email,
                password
            }
        );

        const { token, userId } = response.data;

        const authPath = path.join(
            process.cwd(),
            ".apnaGit",
            "auth.json"
        );

        await fs.mkdir(
            path.dirname(authPath),
            { recursive: true }
        );

        await fs.writeFile(
            authPath,
            JSON.stringify(
                {
                    token,
                    userId
                },
                null,
                2
            )
        );

        console.log("Login successful!");

    } catch (error) {

        if (error.response) {
            console.log(
                error.response.data.message || "Login failed"
            );
        } else {
            console.log("Unable to connect to the server");
        }

    } finally {
        rl.close();
    }
}

module.exports = cliLogin;
