import fs from "fs";
import { client } from "./config/redis.js";
import { deleteFolder, execute } from "./utils.js"
import "./config/rabbitmq.js";

const extensions = {
    cpp: "cpp",
    c: "c",
    java: "java",
    python3: "txt",
};

const runCode = async (apiBody, ch, msg) => {
    try {
        client.set(apiBody.folder.toString(), 'Processing');
        const command = `python3 run.py ../temp/${apiBody.folder}/source.${extensions[apiBody.lang]} ${apiBody.lang} ${apiBody.timeOut}`;
        await fs.promises.writeFile(`/temp/${apiBody.folder}/output.txt`, "");
        console.log("Output.txt created !")

        const output = await execute(command);
        const data = await fs.promises.readFile(`/temp/${apiBody.folder}/output.txt`, "utf-8");
        let result = {
            output: data,
            stderr: output.stderr,
            status: output.stdout,
            submission_id: apiBody.folder,
        };

        console.log(result);
        deleteFolder(`../temp/${apiBody.folder}`);
        client.setex(apiBody.folder.toString(), 3600, JSON.stringify(result));
        ch.ack(msg);
    } catch (error) {
        console.log("Error")
    }

}

export const createFiles = async (apiBody, ch, msg) => {
    try {
        await fs.promises.mkdir(`/temp/${apiBody.folder}`);
        await fs.promises.writeFile(`/temp/${apiBody.folder}/input.txt`, apiBody.input);
        await fs.promises.writeFile(`/temp/${apiBody.folder}/source.${extensions[apiBody.lang]}`, apiBody.src);
        runCode(apiBody, ch, msg);
    } catch (error) {
        console.log(error)
    }
};
