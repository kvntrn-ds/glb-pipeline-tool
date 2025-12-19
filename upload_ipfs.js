const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');  // ← this fixes the boundary issue

const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3YTZhNzllYS05ZjA0LTRjODgtYWQ5OC1iNmZhNzE1OTA1ZDQiLCJlbWFpbCI6Imt2bnRybnpAaG90bWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTJhMGU1ZWJkNzllMDE0ZDMzNDMiLCJzY29wZWRLZXlTZWNyZXQiOiIxYTgxMTAzNGNlNDk3YjdlZjY3MDNlZjA0YTI0MDdjNDE3Yjk1OWYyNGQ0MzI1NDRkNjJkMmE5NzM0MGY4YmUyIiwiZXhwIjoxNzk3NjQ4MTk5fQ.YTr7-22C9EZH3z7w63VZpfZwFjzAztb_4VLQ2z5lTNQ ';  // ← your Pinata JWT
const fileToUpload = 'portrait_compressed.glb';  // ← your file

const upload = async () => {
  const data = new FormData();
  data.append('file', fs.createReadStream(fileToUpload));

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      ...data.getHeaders()  // ← important for FormData
    },
    body: data
  });

  const result = await res.json();

  if (result.IpfsHash) {
    console.log('SUCCESS!');
    console.log('IPFS CID:', result.IpfsHash);
    console.log('Gateway URL:', `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    console.log('Direct link:', `ipfs://${result.IpfsHash}`);
  } else {
    console.log('Upload succeeded but no hash returned:', result);
  }
};

upload();