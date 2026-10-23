# V0.7 art and dependency provenance

## Human base and animation

- Creator: Quaternius.
- Human: Universal Base Characters / SuperHero Male; authored skinned glTF topology and 65-bone humanoid skeleton.
- Animations: Universal Animation Library Standard. Selected clips: Idle_Loop, Walk_Loop, Sprint_Loop, Jump_Loop, Pistol_Idle_Loop, Sword_Idle, Sword_Attack, Punch_Jab.
- Hairstyles: Hair_Buzzed and Hair_SimpleParted, origin-at-zero glTF exports.
- Author pages: https://quaternius.com/packs/universalbasecharacters.html and https://quaternius.com/packs/universalanimationlibrary.html
- License: CC0 1.0, retained at `assets/source/QUATERNIUS-LICENSE.txt`.
- Base mirror bytes: https://raw.githubusercontent.com/programasweights/avatar/main/public/assets/character.glb ; license in the same repository's assets directory. The creator's official pages independently identify the packs as CC0.
- Animation/hair mirror: https://github.com/NafisRayan/Animate-Rigged-Humanoid-No-Blender ; source paths `Universal Animation Library[Standard]/Universal Animation Library[Standard]/Unreal-Godot/UAL1_Standard.glb` and `Universal Base Characters[Standard]/Universal Base Characters[Standard]/Hairstyles/Origin at 0/glTF (Godot)/`.
- Processing: selected attribute extraction; target-rest quaternion retargeting; 20 Hz sampled quaternion tracks with interpolation; in-place locomotion; 8-bit skin weights with exact 255 sum; vertex-cluster NPC LOD; per-outfit material groups and new clothing UVs. No third-party source code from the mirror repositories was executed.
- Original base `quaternius-character.glb` is included for future art editing. The untrimmed 7.6 MB animation source is excluded from the small distribution; processed clips are included in `rig-v7.json` and fully embedded at build time.

## Shirt texture

- Created in this session with the built-in image generation tool, then resized to 512×512 JPEG for the runtime UV texture.
- Original generated file: `generated_images/exec-4eefdc52-55f5-4867-941f-3b1c2f7c8c2a.png` in the creation workspace; runtime file: `assets/tommy-fabric-v7.jpg`.
- Prompt: “Use case: stylized-concept. Asset type: production game clothing fabric texture, square seamless all-over print for a blue short-sleeved Hawaiian shirt worn by a comic-styled 1980s Miami male character. Create a flat perfectly orthographic fabric swatch filling the entire image edge to edge: medium turquoise blue base, elegantly hand-inked dark navy palm fronds and small ivory hibiscus blossoms. Subtle tasteful hand-painted variation, crisp readable shapes suited to low polygon toon game characters, restrained colors, not childish. No garment silhouette, no body, no folds, no baked shadows, no buttons, no labels, no border, no text, no watermark. Dense repeating small botanical motifs, visually seamless at every edge. This is an actual UV texture map, not a character illustration or game screenshot. One square texture.”
- Selected character posters were generated in V0.5 and carried forward without replacing them with screenshots. They are illustrations separate from the actual 3D models.

## Rendering, world and audio

- Three.js r160.1, MIT; local `three.min.js` bundle and license included. Runtime loads no CDN resources.
- All other sandbox code, world generation, meshes, textures, toon material classification, UI silhouettes and synthesized radio arrangements were authored for this project.
- Commercial pop recordings and extracted GTA meshes/textures are not bundled. The player can import their local music files through the existing radio interface.

## V0.8 additions

- Shared static atlas is generated at startup from the existing local procedural textures. NPC vertex colors preserve the existing clothing palette; no new extracted character models were added.
- The tracked tank, vehicle-card SVG silhouettes and loading-page skyline are authored in `src-v8/vehicles-ui.js`, `loading.html` and `interface.css` for this project.
- Additional implementation references and unintegrated candidates are documented in OPEN_SOURCE.md. Existing MIT and CC0 notices are retained.

## V0.9 additions

- Island coast fields, local street grids, atlas UI, beach props, boardwalk, casino exterior and sphinx are original procedural work in `src-v9/`; no reference-game meshes or textures were extracted.
- Tommy's current palm pattern is generated locally by `palmPrint9()` with Canvas drawing; the previous V0.7 texture remains in the source assets. Hair is a sculpted variant of the licensed CC0 base.
- Clothing seam clipping interpolates weights from the existing CC0 topology, retaining quantized totals of 255. Runtime topology changes do not constitute new scanned or commercially licensed character assets.

## V0.10 additions

- Warm timber grain, mottled foliage, sand shader variation, surface effects and sole masks are generated locally with Canvas or deterministic shader functions. No remote resources or new extracted reference-game assets were introduced.
- Spherical wave geometry/normals, shore foam, lightweight sky approximation and pooled interaction meshes are authored in src-v10/coast-water.js and effects.js. No planar reflection pass or third-party water shader is bundled.
- Bay cafe, boardwalk planks, shore props, layered vegetation instances, road facilities and signal models/logic are original procedural additions. Existing Three.js MIT and Quaternius CC0 notices remain.
- Protagonists retain the processed Quaternius mesh/skeleton with further tailoring, facial shaping, lightweight IK and pilot pose changes; this is not a new official GTA character asset set.


V0.11: wardrobe texture painting, continuous neck seams, weighted shoe shells, pocket places and offshore headland silhouettes are original procedural additions in src-v11. Existing Quaternius CC0 anatomy / animation and Three.js MIT licensing are preserved. No new third-party character or GTA-extracted resources were added.
