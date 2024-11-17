"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FakeGetCommits , Commit, FakeGetCommitFiles, GitFile} from '@/utils/api';
import { Card } from '@mui/material';

export default function Page(){
  const [chosenCommit, chooseCommit] = React.useState<string >("") //chooses by sha
  const [files, setFiles] = React.useState<GitFile[]>([])
  const [commits, setCommits] = React.useState<Commit[]>([])

  React.useEffect(()=>{
    FakeGetCommits().then(val => {  
        setCommits(val)

    })
  }, [])
  React.useEffect( () =>{
    if (chosenCommit != ""){
      FakeGetCommitFiles(chosenCommit).then(
        files => {setFiles(files)
          console.log(files);
          
        }
      )
    }
  }, [chosenCommit])
  return (
    <div className='flex flex-col grow h-screen'>
      <div style={{flex:0.7}} className='flex flex-col justify-end text-white'>
        <div style={{flex : 1}}></div>
        <div style={{flex:9}} className='flex flex-row'>

          {files.length != 0  ? <div className='grow flex flex-row flex-wrap'>
            <Files fileList={files} />
          </div> : <div className='grow flex flex-row flex-wrap justify-center items-center'>
            {/* <div></div> */}
            Select a commit to the right
            </div>}
          <Commits onCommitChosen={(commit:string) => {
            chooseCommit(commit)
            }} commits={commits} chosenCommit={chosenCommit}/>
        </div>
      </div>
      <div style={{ flex: 0.3 }}>
        <iframe
          src="https://ssh.gitfile.tech/terminal/"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Terminal"
        />
      </div>
    </div>
  )
}
// export default async function Page() {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//       <div style={{
//         flex: 0.7, display: "flex",  boxSizing : "border-box"
//       }} >
//            {/* <Box sx={{ minWidth: "100%"}}> */}

//            {/* <FormControl style={{ color: "white", backgroundColor: "white", borderRadius: "8px" }} fullWidth> */}
//           {/* <ObsoleteSelect /> */}
//           <div className='flex flex-row h-full'>
//           <div className='grow'>
//             Files
//           </div>
//           <div className='shrink' >

//           <Commits />
//           </div>
//           </div>
// {/* </FormControl> */}
//         {/* </Box> */}


//       </div>
      // <div style={{ flex: 0.3 }}>
      //   <iframe
      //     src="https://ssh.gitfile.tech/terminal/"
      //     style={{
      //       width: "100%",
      //       height: "100%",
      //       border: "none",
      //     }}
      //     title="Terminal"
      //   />
      // </div>
//     </div>
//   );
// }

const Commits = ({onCommitChosen, commits, chosenCommit} : {onCommitChosen: (commit: string)=>void, commits : Commit[], chosenCommit : string}) =>{
  // const [commits, setCommits] = React.useState<Commit[]>([])

  return <div className='flex flex-col  text-white'>
    <div className='flex justify-center my-4'>
      Commit History
    </div>
    {
      commits.map(
        (commit, index) => {
          return <button className={`border m-2 px-4 py-2 ${chosenCommit == commit.sha ? "bg-slate-200 text-black" : ""}`} key={index} onClick={()=>onCommitChosen(commit.sha)}>
            {commit.sha}
          </button>
        }
      )
    }
  </div>
}

const Files = ({fileList} : {fileList : GitFile[]})=>{
  return fileList.map((file, index) => {
      return <div className='w-36 h-36 flex flex-col items-center my-4'>
        <div key={index} className='w-24 h-24 border flex justify-center items-center'> File Icon</div>
        <div className='shrink py-2'>{file.filename}</div>
      </div> 
    })

}

const ObsoleteSelect = () =>{
  return <>
    <InputLabel id="demo-simple-select-label" style={{ color: "black" }}>Commit Timestamp</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    style={{ color: "black", backgroundColor: "white" }}
    label="Commit"
    // onChange={handleChange}
  >
    <MenuItem value={10} style={{ color: "black" }}>December 11</MenuItem>
    <MenuItem value={20} style={{ color: "black" }}>December 12</MenuItem>
    <MenuItem value={30} style={{ color: "black" }}>December 13</MenuItem>
  </Select>
  </>
}