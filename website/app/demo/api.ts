import axios from 'axios';
// GitHub repository details
const owner = "RoyceAroc"; // e.g., "octocat"
const repo = "utd-warehouse";  // e.g., "hello-world"
const branch = "main"; // Specify the branch (default: main)

// Personal Access Token (optional for private repos or higher rate limits)
const token = "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"; // Replace with your token or set to null for public repos

export type Commit = {
    sha : string,
    author : string, 
    message : string,
    url: string
}
export type GitFile = {
    sha: string,
    filename: string,
    raw_url : string,
    blob_url : string
}
export async function getCommits(debug_print = false) : Promise<Commit[]> {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(url, { headers });
        const commits = response.data;
        const commit_list : Commit[] = commits.map((commit: { sha: any; commit: { author: { name: any; }; message: any; }; url : string; }) => {
            return {commit : commit.sha, author : commit.commit.author.name, message : commit.commit.message, url : commit.url}
        })

        return commit_list;
    } catch (error:any) {
        console.error("Error fetching commits:", error.response?.data || error.message);
        return []
    }
}

  

export async function getCommitFiles(commitSha: string, debug_print : boolean = false) : Promise<GitFile[]> {
    try {
        const commitUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const commitResponse = await axios.get(commitUrl, { headers });
            const treeSha = commitResponse.data.commit.tree.sha;

            const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`;
            const treeResponse = await axios.get(treeUrl, { headers });

            // Create array of promises for parallel file content fetching
            const filePromises = treeResponse.data.tree
                .filter((item: any) => item.type === 'blob') // Only process files, not directories
                .map(async (item: any) => {
                    const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${item.path}?ref=${commitSha}`;
                    try {
                        const fileResponse = await axios.get(fileUrl, { headers });
                        let content = fileResponse;
                        return {
                            filename: item.path,
                            status: 'unchanged',
                            changes: 0,
                            type: item.type,
                            content: content
                        };
                    } catch (error) {
                        console.error(`Error fetching content for ${item.path}:`, error);
                        return {
                            filename: item.path,
                            status: 'unchanged',
                            changes: 0,
                            type: item.type,
                            content: undefined
                        };
                    }
                });

            // Wait for all file content requests to complete
            const files = await Promise.all(filePromises);

            if (debug_print) {
                files.forEach((file: GitFile) => {
                    console.log(`Filename: ${file.filename}`);
                    console.log(`Status: ${file.status}`);
                    console.log(`Changes: ${file.changes}`);
                    console.log(`Type: ${file.type}`);
                    console.log(`Content length: ${file.content?.length || 0} characters`);
                    console.log("----");
                });
            }

            return files;
    } catch (error : any) {
        console.error("Error fetching commit files:", error.response?.data || error.message);
        return []
    }
}
