import { defineProject, mergeConfig } from 'vitest/config';

import { unitPreset } from 'afena-vitest-config/presets/unit';

export default mergeConfig(unitPreset, defineProject({}));
