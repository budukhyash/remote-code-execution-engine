import rimraf from "rimraf";
import { exec } from "child_process";

export const deleteFolder = (path) => {

    return new Promise((resolve, reject) => {
        rimraf(path, (err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log(`Deleted folder ${path}`)
                resolve(`Deleted folder ${path}`);
            }
        });
    })

}

export const execute = (command) => {

    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                let status = {stdout:stdout,stderr:stderr};
                resolve(status);
            }
        })
    })

}