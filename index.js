const fs = require('fs');
const gltfPipeline = require('gltf-pipeline');
const fetch = require('node-fetch');
const FormData = require('form-data');

const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3YTZhNzllYS05ZjA0LTRjODgtYWQ5OC1iNmZhNzE1OTA1ZDQiLCJlbWFpbCI6Imt2bnRybnpAaG90bWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTJhMGU1ZWJkNzllMDE0ZDMzNDMiLCJzY29wZWRLZXlTZWNyZXQiOiIxYTgxMTAzNGNlNDk3YjdlZjY3MDNlZjA0YTI0MDdjNDE3Yjk1OWYyNGQ0MzI1NDRkNjJkMmE5NzM0MGY4YmUyIiwiZXhwIjoxNzk3NjQ4MTk5fQ.YTr7-22C9EZH3z7w63VZpfZwFjzAztb_4VLQ2z5lTNQ ';  // ← paste your Pinata JWT (keep secret!)

async function fullPipeline(inputFile) {
  console.log(`Starting pipeline on ${inputFile}\n`);

  // 1. Load + stats
  const data = fs.readFileSync(inputFile);
  console.log(`1. Original size: ${(data.length / 1024 / 1024).toFixed(2)} MB`);

  // 2. Compress with Draco
  console.log('2. Compressing with Draco...');
  const { glb: compressed } = await gltfPipeline.processGlb(data, {
    dracoOptions: { compressionLevel: 10 }
  });
  const compressedFile = inputFile.replace('.glb', '_compressed.glb');
  fs.writeFileSync(compressedFile, compressed);
  console.log(`   Saved: ${compressedFile} (${(compressed.length / 1024 / 1024).toFixed(2)} MB)`);

  // 3. Extract JSON summary
  console.log('3. Extracting JSON metadata...');
  const { gltf } = await gltfPipeline.glbToGltf(compressed);
  const summary = {
    file: compressedFile,
    vertex_count: gltf.accessors?.find(a => a.type === 'VEC3')?.count || 0,
    materials: gltf.materials?.map(m => m.name || 'Unnamed') || []
  };
  fs.writeFileSync('summary.json', JSON.stringify(summary, null, 2));
  console.log('   Saved: summary.json');

  // 4. Upload to IPFS
  console.log('4. Uploading to Pinata IPFS...');
  const form = new FormData();
  form.append('file', fs.createReadStream(compressedFile));

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      ...form.getHeaders()
    },
    body: form
  });

  const result = await res.json();
  if (result.IpfsHash) {
    console.log('\nSUCCESS! Your 3D model is on-chain ready');
    console.log(`CID: ${result.IpfsHash}`);
    console.log(`Gateway: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    console.log(`IPFS link: ipfs://${result.IpfsHash}`);
  } else {
    console.log('Upload failed:', result);
  }
}

// Run on your file
fullPipeline('portrait.glb');  // ← change to your filename if needed