/**
 * Test workflow definitions
 */

export const simpleWorkflow = {
  id: 'test-workflow',
  name: 'Test Workflow',
  steps: [
    { id: 'step1', name: 'First Step', action: 'test-action' },
    { id: 'step2', name: 'Second Step', action: 'test-action' },
  ],
};

export const conditionalWorkflow = {
  id: 'conditional-workflow',
  name: 'Conditional Workflow',
  steps: [
    { id: 'step1', name: 'Check Condition', action: 'check' },
    { id: 'step2a', name: 'Path A', action: 'path-a', condition: 'conditionA' },
    { id: 'step2b', name: 'Path B', action: 'path-b', condition: 'conditionB' },
  ],
};
