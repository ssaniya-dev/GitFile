'use client'

import React from 'react'
import { getCommitFiles } from "./api";

interface CommitRowProps {
  commit: string
  author: string
  message: string
}

const CommitRow = ({ commit, author, message }: CommitRowProps) => {
  const handleClick = async () => {
    const commitId = commit.slice(0, 7);
    let y = await getCommitFiles(commitId);

    const element = document.getElementById('hackutd');

    function getMimeType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            'txt': 'text/plain',
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'json': 'application/json',
            'html': 'text/html',
            'csv': 'text/csv',
            // Add more mime types as needed
        };
        return mimeTypes[extension] || 'application/octet-stream';  // Default to binary stream if unknown
    }
  
   /* // Create a Blob from the content with dynamic MIME type
    const mimeType = getMimeType(fileData.filename);
    const blob = new Blob([fileData.content], { type: mimeType });
    
    // Create a download link for the file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileData.filename;
    
    // Trigger the download
    link.click();*/

    console.log(y);

    let bullets = `<ul>`;
    for (let i=0; i<y.length; i++ ){
      let fileData = y[i];
      const mimeType = getMimeType(fileData.filename);
      const blob = new Blob([fileData.content], { type: mimeType });

      bullets += `<li> ${y[i].filename} - <a href="${URL.createObjectURL(blob)}">Link</a> </li>`
    }

    bullets += `</ul>`
    if (element) {
      element.innerHTML = bullets;
    }
  };

  return (
    <tr 
      style={{ height: "30px", cursor: "pointer" }} 
      onClick={handleClick}
    >
      <td style={{ fontSize: "12px" }}>{commit.slice(0, 7)}</td>
      <td style={{ fontSize: "12px" }}>{author}</td>
      <td style={{ fontSize: "12px" }}>{message}</td>
    </tr>
  )
}

interface CommitsTableProps {
  commits: Array<{
    commit: string;
    author: string;
    message: string;
  }>;
}

const CommitsTable = ({ commits }: CommitsTableProps) => {
  return (
    <table style={{ width: "100%", textAlign: 'center'}}>
      <thead>
        <tr>
          <th>Commit ID</th>
          <th>Author</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {commits.map((commit, index) => (
          <CommitRow
            key={index}
            commit={commit.commit}
            author={commit.author}
            message={commit.message}
          />
        ))}
      </tbody>
    </table>
  );
}

export default CommitsTable;
