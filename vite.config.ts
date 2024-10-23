import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'


// https://vitejs.dev/config/
export default defineConfig({
    base: '/editor',
    plugins: [
        vue(),
        // 自动按需引入组件
        AutoImport({
            resolvers: [
                ArcoResolver({
                    // importStyle: 'less',
                }),
            ],
            imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
            eslintrc: {
                enabled: true,
            },
        }),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'gzip',
            ext: '.gz',
          }),
        Components({
            directoryAsNamespace: true,
            resolvers: [
                // 自动引入arco
                ArcoResolver({
                    // importStyle: 'less',
                    resolveIcons: true,
                }),
            ],
        }),
        UnoCSS(),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
            // 指定symbolId格式
            symbolId: 'icon-[dir]-[name]',
        })
    ],
    build: {
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
            drop_console: true,
            drop_debugger: true,
            }
        },
        rollupOptions: {
            output: {
              // 分包
              manualChunks(id) {
                if (id.includes('node_modules')) {
                  var re= id.toString().split('node_modules/.pnpm/')[1].split('/')[0].toString()
                  if(re.includes("arco-design+web-vue")){
                    return "arco-design+web-vue"
                  }
                  else if(re.includes("vue")){
                    return "vuejs"
                  }else if(re.includes("lodash")){
                    return "lodash"
                  }else if(re.includes("leafer")){
                    return "leaferjs"
                  }else if(re.includes("mockjs")){
                    return "mockjs"
                  }else if(re.includes("jsbarcode")){
                    return "jsbarcode"
                  }else if(re.includes("pako")){
                    return "pako"
                  }else if(re.includes("axios")){
                    return "axios"
                  }else if(re.includes("arco-design")){
                    return "arcodesign"
                  }else if(re.includes("tinymce")){
                    return "tinymce"
                  }else if(re.includes("ag-psd")){
                    return "ag-psd"
                  }
                  return "vendor"
                }
                if(id.includes('/src/components')){
                    return 'cuscomponents'
                } 
              }
            }
          }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    
    server: {
        hmr: { overlay: false },
        host: 'localhost',
        port: 5174,
        proxy: {
            '/api': {
            target: 'http://localhost:5690',//'http://localhost:9292',
            changeOrigin: true,
            rewrite: (path) => path.replace(new RegExp('^'), '')
            },
            '/resources': {
            target: 'http://localhost:5690',//'http://localhost:9292',
            changeOrigin: true,
            rewrite: (path) => path.replace(new RegExp('^'), ''),
            },
            '/file': {
            target: 'http://localhost:5690',//'http://localhost:9292',
            changeOrigin: true,
            rewrite: (path) => path.replace(new RegExp('^'), ''),
            }
        },
    }
    
})
