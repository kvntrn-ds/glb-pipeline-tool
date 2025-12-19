A 3-D onchain pipeline tool that analyzes your .glb file, compresses it with Draco, extracts the metadata and then uploads to IPFS via Pinata.
# GLB → On-Chain Pipeline Tool

Node.js toolkit for preparing 3D assets for web3 gaming and NFTs

## Files

| File                        | Description |
|-----------------------------|-------------|
| `glb_analyzer.js`           | Analyzes .glb size, detects Draco compression, applies max compression + saves new file |
| `extract_json.js`           | Extracts vertex count, materials, metadata + saves summary.json |
| `upload_ipfs.js`            | Uploads compressed .glb to Pinata IPFS + prints CID |
| `index.js`                  | Full pipeline — one command runs analyze → compress → extract → IPFS |
| `portrait.glb`              | Original model (118 MB) |
| `portrait_compressed.glb`   | Compressed version |
| `portrait_summary.json`     | Example metadata output |
| `package.json`              | Project dependencies (gltf-pipeline, node-fetch, form-data) |
| `LICENSE`                   | MIT License |
| `README.md`                 | This file |

## Quick Start
```bash
npm install
node index.js
