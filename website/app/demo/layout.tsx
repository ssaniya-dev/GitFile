import { getCommits } from "./api";
import React from 'react';
import CommitsTable from './CommitsTable';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  let commits = await getCommits();

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <div style={{
          width: "50%",
          padding: "20px",
          boxSizing: "border-box"
        }}>
          <div style={{ overflowY: 'auto', maxHeight: '45vh', marginTop: '5vh' }}>
            <CommitsTable commits={commits} />
          </div>
          <div style={{ maxHeight: '10vh', marginTop: '4vh' }}>
            Click on a revision version from above to display the files
          </div>
          <div id='hackutd' style={{ overflowY: 'auto', maxHeight: '30vh', marginTop: '2vh' }}>
          </div>
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