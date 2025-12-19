# glb-pipeline-tool
A 3-D onchain pipeline tool that analyzes your .glb file, compresses it with Draco, extracts the metadata and then uploads to IPFS via Pinata.

## Features
- Load any .glb + show size in MB
- Detect existing Draco compression
- Apply max Draco compression + save new file
- Extract vertex count, materials, metadata
- Upload to Pinata IPFS + get permanent CID

## Quick Start
```bash
npm install 
node index.js          # ← runs full pipeline (analyze → compress → extract → IPFS)
