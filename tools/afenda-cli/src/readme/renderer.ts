import { renderTemplate } from './templates';

import type { ReadmeCanonModel } from '../types';

/**
 * Render a Canon README model into markdown content for the autogen block.
 * Pure function — no I/O, no side effects.
 */
export function renderReadme(
  model: ReadmeCanonModel,
  signature: string
): string {
  const relatedDocs =
    model.identity.name === 'afenda-ui'
      ? [{ path: './erp-architecture.ui.md', label: 'erp-architecture.ui.md — ERP app shell, nav SSOT, forms governance spec' }]
      : undefined;

  return renderTemplate({
    name: model.identity.name,
    description: model.identity.description,
    packageType: model.identity.packageType,
    workspace: model.install.workspace,
    peerDeps: model.install.peerDeps,
    binNames: model.binNames,
    exports: model.exports,
    sourceFiles: model.sourceFiles,
    scripts: model.scripts,
    dependencies: model.dependencies,
    peerDependencies: model.peerDependencies,
    relatedPackages: model.relatedPackages,
    relatedDocs,
    ...(model.structure !== undefined ? { structure: model.structure } : {}),
    keyExports: model.keyExports,
    signature,
  });
}
