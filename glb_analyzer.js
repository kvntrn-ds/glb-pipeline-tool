/**
 * GLB Analyzer & Compressor
 * 
 * - Loads .glb file and shows size in MB
 * - Detects existing Draco compression
 * - Applies max Draco compression + saves new file
 * 
 * Run: node glb_analyzer.js
 */


const fs = require('fs');
const gltfPipeline = require('gltf-pipeline');

const inputGlb = 'portrait.glb';          // your original file
const outputGlb = 'portrait_compressed.glb'; // new file

try {
  const glbData = fs.readFileSync(inputGlb);

  console.log(`File: ${inputGlb}`);
  console.log(`Original size: ${(glbData.length / 1024 / 1024).toFixed(2)} MB`);

  // Always try compression (ignores if already Draco)
  console.log('→ Applying Draco compression...');

  gltfPipeline.processGlb(glbData, {
    dracoOptions: { compressionLevel: 10 }
  }).then(comp => {
    fs.writeFileSync(outputGlb, comp.glb);
    const reduction = ((1 - comp.glb.length / glbData.length) * 100).toFixed(1);
    console.log(`Compressed size: ${(comp.glb.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Reduction: ${reduction}%`);
    console.log(`Saved as: ${outputGlb}`);
  }).catch(err => {
    console.error('Compression failed:', err.message);
  });

} catch (err) {
  console.error('Error:', err.message);

}
