#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const initRepo = require("./commands/init.js");
const addRepo = require("./commands/add.js");
const loginUser = require("./commands/login.js");
const pullRepo = require("./commands/pull.js");
const pushRepo = require("./commands/push.js");
const commitRepo = require("./commands/commit.js");
const revertRepo = require("./commands/revert.js");

yargs(hideBin(process.argv))

    .command(
        "init",
        "Initialize a new Repository",
        {},
        initRepo
    )

    .command(
        "add <file>",
        "add a new file in repository",
        (yargs) => {
            return yargs.positional("file", {
                describe: "file to add in staging area",
                type: "string"
            });
        },
        (argv) => {
            addRepo(argv.file);
        }
    )

    .command(
        "login",
        "log in to your account",
        {},
        async () => {
            await loginUser();
        }
    )

    .command(
        "pull",
        "pull the repo",
        {},
        pullRepo
    )

    .command(
        "push",
        "push the repo",
        {},
        pushRepo
    )

    .command(
        "commit <message>",
        "save the repo",
        (yargs) => {
            return yargs.positional("message", {
                describe: "write the commit message",
                type: "string"
            });
        },
        async (argv) => {
            await commitRepo(argv.message);
        }
    )

    .command(
        "revert <commitId>",
        "revert back to previous code",
        (yargs) => {
            return yargs.positional("commitId", {
                describe: "revert back to this id",
                type: "string"
            });
        },
        async (argv) => {
            await revertRepo(argv.commitId);
        }
    )

    .demandCommand(1, "At least one command required")
    .help()
    .parse();