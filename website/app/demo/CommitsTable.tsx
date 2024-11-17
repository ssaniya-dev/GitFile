'use client'

import React from 'react';
import { getCommitFiles } from "./api";
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface CommitRowProps {
  commit: string
  author: string
  message: string
}

const CommitRow = ({ commit, author, message }: CommitRowProps) => {
  const handleClick = async () => {
    let z = document.getElementById("loader");

if (z) {
  z.style.display = "flex";
}
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
      <tr >
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

    if (z) {
      z.style.display = "none";
    }
  };

  return (
    <tr onClick={handleClick}
    style={{
      backgroundColor: "#2c2c2c", 
      transition: "background-color 0.3s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#444444")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2c2c2c")}
  >
    <td style={{ padding: "10px", borderBottom: "1px solid #555555" }}>
      {commit.slice(0, 7)}
    </td>
    <td style={{ padding: "10px", borderBottom: "1px solid #555555" }}>
      {author}
    </td>
    <td style={{ padding: "10px", borderBottom: "1px solid #555555" }}>
      {message}
    </td>
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
    <div>
    <table style={{ width: "100%", textAlign: 'center',  borderRadius: "8px", overflow: "hidden" }}>
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
   

    </div>
  );
}

export default CommitsTable;
