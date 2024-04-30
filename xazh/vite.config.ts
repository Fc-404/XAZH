import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// import inject from "@rollup/plugin-inject"
const pathSrc = path.resolve(__dirname, 'src')
const serverSrc = path.resolve(pathSrc, 'config', 'server.vite.ts')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // inject(),
    AutoImport({
      imports: ['vue'],

      resolvers: [],

      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],

      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
  ],
})
