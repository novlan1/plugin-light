export function fixUniDirVitePlugin() {
  return {
    name: 'fix-uni-dir-plugin',
    config: (input: any) => {
      const originChunkFileNames = input.build.rollupOptions.output.chunkFileNames;

      function chunkFileNames(...args: any) {
        let result = originChunkFileNames(...args);
        result = result.replace(/\.\.-/g, '');
        return result;
      }

      input.build.rollupOptions.output.chunkFileNames = chunkFileNames;
      return input;
    },
  };
}
