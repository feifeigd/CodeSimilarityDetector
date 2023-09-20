
import fs from "node:fs";
import crypto from "crypto";

const algorithmType = {
    SHA256: "SHA256",
    SHA1: "SHA1",
    MD5: "MD5",
}

export function hashFile(filePath: string, algorithm: string){
    return new Promise((resolve, reject)=>{
        if(!fs.existsSync(filePath)){
            reject("the file does not exist, make sure your file is correct!");
            return;
        }
        if(!algorithmType.hasOwnProperty(algorithm)){
            reject("nonsupport algorithm, make sure algorithm is [SHA256, SHA1, MD5]");
            return;
        }

        let hash = crypto.createHash(algorithm.toLowerCase());
        let stream = fs.createReadStream(filePath);

        stream.on("data", (data)=>{
            hash.update(data);
        });
        stream.on("end", ()=>{
            const final = hash.digest("hex");
            resolve(final);
        });
        stream.on("error", (err)=>{
            reject(err);
        });
    });
}
