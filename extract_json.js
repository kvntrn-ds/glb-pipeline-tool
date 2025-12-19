/**
 * GLB JSON Extractor
 * 
 * - Extracts vertex count, material names, texture info
 * - Saves full glTF JSON + clean summary.json
 * 
 * Run: node extract_json.js
 */


const fs = require('fs');
const { glbToGltf } = require('gltf-pipeline');

const inputGlb = 'portrait.glb';  // ← your file

const glbData = fs.readFileSync(inputGlb);

glbToGltf(glbData).then(result => {
  const gltf = result.gltf;

  // Extract first mesh (most .glb have one)
  const mesh = gltf.meshes[0];
  const primitive = mesh.primitives[0];

  // Vertices (POSITION)
  const positionAccessor = gltf.accessors[primitive.attributes.POSITION];
  const positionBufferView = gltf.bufferViews[positionAccessor.bufferView];
  const positionBuffer = gltf.buffers[positionBufferView.buffer];
  // Note: full binary extraction is complex — for now, log counts
  console.log(`Mesh name: ${mesh.name || 'Unnamed'}`);
  console.log(`Vertices: ${positionAccessor.count}`);
  console.log(`Faces: ${primitive.indices ? gltf.accessors[primitive.indices].count / 3 : 'unknown'}`);

  // Save full glTF JSON (human-readable metadata)
  fs.writeFileSync('portrait_metadata.json', JSON.stringify(gltf, null, 2));
  console.log('Full glTF JSON saved as portrait_metadata.json');

  // Simple summary
  const summary = {
    mesh_name: mesh.name || 'Unnamed',
    vertex_count: positionAccessor.count,
    face_count: primitive.indices ? gltf.accessors[primitive.indices].count / 3 : 'strip',
    materials: mesh.primitives.map(p => gltf.materials[p.material]?.name || 'None')
  };
  fs.writeFileSync('portrait_summary.json', JSON.stringify(summary, null, 2));
  console.log('Summary saved as portrait_summary.json');
  console.log(summary);
}).catch(err => {
  console.error('Extraction failed:', err);

});
