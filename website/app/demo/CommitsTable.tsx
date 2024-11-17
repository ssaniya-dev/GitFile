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
      };
      return mimeTypes[extension] || 'application/octet-stream';
    }




    let bullets = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: left;">Filename</th>
          <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: left;">Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  for (let j = 0; j < y.length; j++) {
    

    const token = "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"; 


    await fetch("https://main-server.gitfile.tech/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: y[j].content.data.git_url
      })
    }).then(async res => {
      let json = await res.json();

      const base64String = json.content;

      let mimeType = getMimeType(y[j].content.data.name);

      const byteString = atob(base64String);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: mimeType });

      bullets += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${y[j].content.data.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          <button 
            style="
              background-color: #5c84e0; 
              color: white; 
              border: none; 
              padding: 5px 10px; 
              border-radius: 5px; 
              cursor: pointer;
              transition: background-color 0.3s ease;
            "
            onclick="window.open('${URL.createObjectURL(blob)}', '_blank')"
          >
            Open
          </button>
        </td>
      </tr>
    `;
    })

  
    
  }
  
  bullets += `
      </tbody>
    </table>
  `;
  
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
    <table style={{ width: "100%", textAlign: 'center' }}>
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
