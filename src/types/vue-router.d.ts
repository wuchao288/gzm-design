import 'vue-router'

declare module 'vue-router' {
    interface RouteLocationNormalizedLoaded {
        query: Record<string, string>
    }
}