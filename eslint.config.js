import tseslint from 'typescript-eslint';
import { LintGolem } from '@magik_io/lint_golem';
export default tseslint.config(
  ...new LintGolem({
    rootDir: __dirname,
    tsconfigPaths: 'tsconfig.json',
  }).config
);
