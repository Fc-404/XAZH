import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

import Inspect from 'vite-plugin-inspect'
import inject from "@rollup/plugin-inject"

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // inject(),
    AutoImport({
      imports: ['vue'],

      resolvers: [],

      dts: path.resolve(pathSrc, 'auto-imports.d.ts')
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],

      dts: path.resolve(pathSrc, 'components.d.ts')
    }),
    Inspect(),
  ],
})
