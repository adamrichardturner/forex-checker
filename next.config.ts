import path from 'node:path'

import type { NextConfig } from 'next'

const stylesPath = path.join(process.cwd(), 'src/styles')

const nextConfig: NextConfig = {
  sassOptions: {
    // Next/docs historically use includePaths; Dart Sass modern API uses loadPaths.
    includePaths: [stylesPath],
    loadPaths: [stylesPath],
  },
}

export default nextConfig
