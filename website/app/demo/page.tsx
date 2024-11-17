import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default async function Page() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{
        flex: 0.7, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
           <Box sx={{ minWidth: 360 }}>

           <FormControl style={{ color: "white", backgroundColor: "white", borderRadius: "8px" }} fullWidth>
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
</FormControl>
        </Box>


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
  );
}
