import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
 '\\.[jt]sx?$': 'ts-jest',
  
  },
   transformIgnorePatterns: [
        '/node_modules/(?!with-local-tmp-dir/dist/)'
    ]
};
export default config;

