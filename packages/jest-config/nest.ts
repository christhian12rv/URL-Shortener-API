import type { Config } from 'jest';
import { config as baseConfig } from './base';
import path from 'path';

export const config = {
  ...baseConfig,
  // rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@repo/shared/(.*)$': path.join(__dirname, '../shared/src/$1'),
    '^@repo/eslint-config/(.*)$': path.join(__dirname, '../eslint-config/$1'),
    '^@repo/jest-config/(.*)$': path.join(__dirname, '../jest-config/$1'),
    '^@repo/typescript-config/(.*)$': path.join(
      __dirname,
      '../typescript-config/$1',
    ),
  },
} as const satisfies Config;
