/* Local, synthetic educational example. No upload, network, or persistent storage. */
(function () {
  'use strict';

  const demo = document.querySelector('[data-workflow-demo]');
  if (!demo) return;

  const stages = Array.from(demo.querySelectorAll('[data-workflow-stage]'));
  const steps = demo.querySelector('[data-workflow-steps]');
  const controls = demo.querySelector('[data-workflow-controls]');
  const previous = demo.querySelector('[data-workflow-back]');
  const next = demo.querySelector('[data-workflow-next]');
  const position = demo.querySelector('[data-workflow-position]');
  const status = demo.querySelector('[data-workflow-status]');
  const proof = demo.querySelector('[data-workflow-proof]');
  const actions = Array.from(demo.querySelectorAll('[data-workflow-action]'));
  if (stages.length !== 4 || !steps || !controls || !previous || !next || !position || !status || !proof) return;

  let stage = 0;
  const reviewed = { duplicate: false, term: false, followup: false };
  const labels = ['View dataset', 'Review exceptions', 'Preview output', 'Start again'];
  const initialLabels = new Map(actions.map(button => [button, button.textContent]));
  const completedLabels = { duplicate: 'One record kept', term: 'Source value used', followup: 'Assigned to Operations' };
  const messages = {
    duplicate: 'One DEMO-A record retained. S-01 and its duplicate S-03 remain in the source references.',
    term: 'DEMO-A corrected to 12 months using sample source S-01.',
    followup: 'Operations owns the follow-up. The DEMO-B asset register is still missing.'
  };

  function text(selector, value) {
    const element = demo.querySelector(selector);
    if (element) element.textContent = value;
  }

  function renderReview() {
    text('[data-workflow-extracted-term]', reviewed.term ? '12 months' : '6 months');
    text('[data-workflow-term-state]', reviewed.term ? 'Checked against S-01' : 'Check against source');
    text('[data-workflow-document-state]', reviewed.followup ? 'Missing · Operations follow-up' : 'Asset register missing');
    text('[data-workflow-record-count]', reviewed.duplicate ? '2 working records · duplicate source reference retained' : '3 imported entries · 2 unique buildings');
    demo.querySelector('[data-workflow-duplicate-row]').hidden = reviewed.duplicate;
    text('[data-workflow-duplicate-state]', reviewed.duplicate ? 'Reviewed · S-01 and S-03 retained as references' : 'Decision pending');
    text('[data-workflow-term-review]', reviewed.term ? 'Checked · 12 months from S-01' : 'Source check pending');
    text('[data-workflow-followup-state]', reviewed.followup ? 'Open · Operations to request the register' : 'Open · owner needed');
    text('[data-workflow-output-count]', reviewed.duplicate ? '2 unique building records; S-03 retained as a duplicate source reference.' : '3 imported entries; duplicate DEMO-A record still needs review.');
    text('[data-workflow-output-term]', reviewed.term ? '12 months · checked against S-01.' : 'Unverified · check the extracted term against S-01.');
    text('[data-workflow-output-followup]', reviewed.followup ? 'Open · Operations to request the missing asset register before circulation.' : 'Open · asset register missing; assign an owner before circulation.');
    actions.forEach(button => {
      const done = reviewed[button.dataset.workflowAction];
      button.setAttribute('aria-disabled', String(done));
      button.textContent = done ? completedLabels[button.dataset.workflowAction] : initialLabels.get(button);
    });
  }

  function showStage(index, focusHeading = true) {
    stage = Math.max(0, Math.min(index, stages.length - 1));
    stages.forEach((panel, index) => { panel.hidden = index !== stage; });
    Array.from(steps.children).forEach((item, index) => {
      if (index === stage) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    previous.disabled = stage === 0;
    next.textContent = labels[stage] + ' →';
    position.textContent = 'Step ' + (stage + 1) + ' of ' + stages.length;
    status.textContent = '';
    if (focusHeading) stages[stage].querySelector('h3').focus();
  }

  actions.forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.workflowAction;
      if (!(key in reviewed) || reviewed[key]) return;
      reviewed[key] = true;
      renderReview();
      status.textContent = messages[key];
    });
  });

  demo.querySelectorAll('[data-workflow-trace]').forEach(button => {
    button.addEventListener('click', () => {
      showStage(2, false);
      proof.open = true;
      proof.querySelector('summary').focus();
    });
  });

  previous.addEventListener('click', () => showStage(stage - 1));
  next.addEventListener('click', () => {
    if (stage === stages.length - 1) {
      Object.keys(reviewed).forEach(key => { reviewed[key] = false; });
      proof.open = false;
      renderReview();
      showStage(0);
    } else {
      showStage(stage + 1);
    }
  });

  // Static source-to-output content remains readable if enhancement is unavailable.
  renderReview();
  showStage(0, false);
  steps.hidden = false;
  controls.hidden = false;
  status.hidden = false;
  demo.querySelectorAll('[data-workflow-action], [data-workflow-trace]').forEach(button => { button.hidden = false; });
  demo.querySelectorAll('[data-workflow-static]').forEach(element => { element.hidden = true; });
  demo.setAttribute('data-enhanced', '');
})();
