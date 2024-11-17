import { simpleGit, SimpleGit, CleanOptions, SimpleGitOptions } from 'simple-git';
import path from 'path';

const working_dir = process.cwd()
console.log(working_dir);
const as_list = working_dir.split("/").slice(0, -1)
as_list.push("git_dir")
console.log(as_list);
const dir_as_string = as_list.join("/")

const options: Partial<SimpleGitOptions> = {
    baseDir: dir_as_string,
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
    };
    
const git: SimpleGit = simpleGit(options).clean(CleanOptions.FORCE);

export const getLogs = async () => {
    const result = await git.log()
    console.log("worked");
    console.log(result); 
    return result.all
}
