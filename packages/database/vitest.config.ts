import { defineProject, mergeConfig } from 'vitest/config';

import { integrationPreset } from 'afena-vitest-config/presets/integration';

export default mergeConfig(integrationPreset, defineProject({}));
