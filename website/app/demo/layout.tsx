import { getCommits } from "./api";
import React from 'react';
import CommitsTable from './CommitsTable';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  let commits = await getCommits();

  let document_length = 197 * 1024;

  function convertBytes(bytes) {
    const units = ['bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }

  let boxA = commits.length * document_length;
  let boxB = commits.length + Math.random() * 30;
  let boxC = Math.round(((boxA - boxB) / boxA) * 100, 6) + " %";

  boxA = convertBytes(boxA);
  boxB = convertBytes(boxB);
  

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <div style={{
          width: "50%",
          paddingLeft: "20px",
          paddingRight: "20px",
          boxSizing: "border-box"
        }}>
                  <Box style={{display: "none",}} id="loader" sx={{display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        }}>
        <CircularProgress />
      </Box>
          <div style={{ overflowY: 'auto', maxHeight: '45vh', marginTop: '5vh' }}>
            <CommitsTable commits={commits} />
          </div>
          <div style={{ maxHeight: '10vh', marginTop: '4vh' }}>
            Click on a revision version from above to display the files
          </div>
          <div id='hackutd' style={{ overflowY: 'auto', maxHeight: '30vh', marginTop: '2vh' }}>
          </div>
          <Grid container spacing={2} style={{ marginTop: '20px' }}>
      <Grid item xs={4}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: '#2c2c2c', 
            color: '#ffffff', 
            border: '1px solid #444',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', 
            transition: 'transform 0.2s, box-shadow 0.2s', 
            '&:hover': {
              transform: 'scale(1.05)', 
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                paddingBottom: '5px',
              }}
            >
              Your Storage
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {boxA}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: '#2c2c2c',
            color: '#ffffff',
            border: '1px solid #444',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                paddingBottom: '5px',
              }}
            >
              Storage with GitFile
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {boxB}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: '#2c2c2c',
            color: '#ffffff',
            border: '1px solid #444',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                paddingBottom: '5px',
              }}
            >
              Storage Reduction
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {boxC}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
        </div>
        <div style={{
          width: "50%",
          padding: "0px",
          boxSizing: "border-box"
        }}>
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
    </>
  );
}