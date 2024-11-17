const axios = require('axios');

// GitHub repository details
const owner = "Buchimi"; // e.g., "octocat"
const repo = "some-repo";  // e.g., "hello-world"
const branch = "main"; // Specify the branch (default: main)

// Personal Access Token (optional for private repos or higher rate limits)
const token = "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"; // Replace with your token or set to null for public repos
type Commit = {
    sha : string,
    author : string, 
    message : string,
    url: string
}
type GitFile = {
    sha: string,
    filename: string,
    raw_url : string,
    blob_url : string
}
export async function getCommits(debug_print = false) : Promise<Commit[] | undefined> {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(url, { headers });
        const commits = response.data;

        if (debug_print){
            console.log(commits);
        }
        
        const commit_list : Commit[] = commits.map((commit: { sha: any; commit: { author: { name: any; }; message: any; }; url : string; }) => {
            console.log(`Commit: ${commit.sha}`);
            console.log(`Author: ${commit.commit.author.name}`);
            console.log(`Message: ${commit.commit.message}`);
            console.log("----");
            return {commit : commit.sha, author : commit.commit.author.name, message : commit.commit.message, url : commit.url}
        })

        return commit_list
    } catch (error:any) {
        console.error("Error fetching commits:", error.response?.data || error.message);
    }
}

export async function getCommitFiles(commitSha: string, debug_print : boolean = false) : Promise<GitFile[] | undefined> {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(url, { headers });
        const files = response.data.files;
        if (debug_print){
            files.forEach((file : any) => {
                console.log(`Filename: ${file.filename}`);
                console.log(`Status: ${file.status}`);
                console.log(`Changes: ${file.changes}`);
                console.log(file)
                console.log("----");
            });
        }
        
        return files.map((file : any) : GitFile => {
            return {
                sha : file.sha,
                filename : file.filename,
                raw_url : file.raw_url,
                blob_url : file.blob_url
            }
        })

    } catch (error : any) {
        console.error("Error fetching commit files:", error.response?.data || error.message);
    }
}
