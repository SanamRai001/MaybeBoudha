export const PLAYCANVAS_VERSION = '2.22.4'
export const PLAYCANVAS_TAG_COMMIT =
  'b5b983982a9860d21e0c1dafb2f85f72e2c01afb'

export const PLAYCANVAS_MODULE_URL =
  'https://cdn.jsdelivr.net/npm/playcanvas@2.22.4/+esm'

export const PLAYCANVAS_SPZ_PARSER_URL =
  'https://cdn.jsdelivr.net/gh/playcanvas/engine@b5b983982a9860d21e0c1dafb2f85f72e2c01afb/scripts/esm/parsers/spz-parser.mjs'

export const PLAYCANVAS_CAMERA_CONTROLS_URL =
  'https://cdn.jsdelivr.net/npm/playcanvas@2.22.4/scripts/esm/camera-controls.mjs'

export const PLAYCANVAS_ZSTD_GLUE_URL =
  'https://cdn.jsdelivr.net/gh/playcanvas/engine@b5b983982a9860d21e0c1dafb2f85f72e2c01afb/examples/assets/wasm/zstd/zstd.wasm.js'

export const PLAYCANVAS_ZSTD_WASM_URL =
  'https://cdn.jsdelivr.net/gh/playcanvas/engine@b5b983982a9860d21e0c1dafb2f85f72e2c01afb/examples/assets/wasm/zstd/zstd.wasm.wasm'

export type RendererCandidate = 'spark' | 'playcanvas'

export function rendererCandidateFromSearch(search: string): RendererCandidate {
  return new URLSearchParams(search).get('renderer') === 'playcanvas'
    ? 'playcanvas'
    : 'spark'
}
