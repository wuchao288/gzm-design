import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
   
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
            minify: 'terser',
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
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
            port: 5173,
            proxy: {
              '/api': {
                target: 'http://localhost:9292',
                changeOrigin: true,
                rewrite: (path) => path.replace(new RegExp('^'), '')
              },
              '/resources': {
                target: 'http://localhost:9292',
                changeOrigin: true,
                rewrite: (path) => path.replace(new RegExp('^'), ''),
              },
              '/file': {
                target: 'http://localhost:9292',
                changeOrigin: true,
                rewrite: (path) => path.replace(new RegExp('^'), ''),
              }
            },
        }
    
})
