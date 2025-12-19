const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');  

const PINATA_JWT = ' ';  // ← your Pinata JWT
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
