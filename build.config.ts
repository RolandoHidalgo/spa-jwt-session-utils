import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: "compatible",
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
    esbuild: {
      minify: false,
    },
  }

})
