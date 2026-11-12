const assert = require('node:assert/strict');
const test = require('node:test');
const { createCardSearchSheet } = require('../src/data/cardSearchSheet.ts');

function fixture() {
  const calls = [];
  const sheet = {
    async present(index, animated) {
      calls.push(['present', index, animated]);
    },
    async dismiss(animated) {
      calls.push(['dismiss', animated]);
    },
  };
  const controller = createCardSearchSheet();
  controller.attach(sheet);
  return { calls, sheet, controller };
}

test('sheet stays collapsed on focus, hides for navigation, and restores on return', async () => {
  const { calls, controller } = fixture();
  await controller.setFocused(true);
  await controller.setFocused(true);
  assert.deepEqual(calls, [['present', 0, false]]);
  await controller.hide();
  await controller.setFocused(false);
  await controller.restore();
  assert.deepEqual(calls, [
    ['present', 0, false],
    ['dismiss', false],
  ]);
  await controller.setFocused(true);
  assert.deepEqual(calls.at(-1), ['present', 0, false]);
  assert.equal(calls.length, 3);
});

test('same-screen intents can restore a programmatically hidden sheet', async () => {
  const { calls, controller } = fixture();
  await controller.setFocused(true);
  await controller.hide();
  controller.didDismiss();
  await controller.restore();
  assert.deepEqual(calls, [
    ['present', 0, false],
    ['dismiss', false],
    ['present', 0, false],
  ]);
});

test('blur during native presentation waits for it before dismissing', async () => {
  const { calls, sheet, controller } = fixture();
  let finishPresent;
  sheet.present = () =>
    new Promise((resolve) => {
      finishPresent = resolve;
    });
  const presenting = controller.setFocused(true);
  await Promise.resolve();
  const leaving = controller.setFocused(false);
  assert.deepEqual(calls, []);
  finishPresent();
  await Promise.all([presenting, leaving]);
  assert.deepEqual(calls, [['dismiss', false]]);
});

test('rapid focus changes reconcile the latest state, not stale queued requests', async () => {
  const { calls, controller } = fixture();
  await Promise.all([
    controller.setFocused(true),
    controller.setFocused(false),
  ]);
  assert.deepEqual(calls, []);
  await Promise.all([
    controller.setFocused(true),
    controller.restore(),
    controller.restore(),
  ]);
  assert.deepEqual(calls, [['present', 0, false]]);
});

test('native failure does not poison subsequent transitions', async () => {
  const { calls, sheet, controller } = fixture();
  const present = sheet.present;
  sheet.present = async () => {
    throw new Error('not ready');
  };
  await assert.rejects(controller.setFocused(true), /not ready/);
  sheet.present = present;
  await controller.restore();
  assert.deepEqual(calls, [['present', 0, false]]);
});

test('detaching cancels queued work and stale native completions cannot mark a new sheet visible', async () => {
  const { calls, sheet, controller } = fixture();
  let finishPresent;
  sheet.present = () =>
    new Promise((resolve) => {
      finishPresent = resolve;
    });
  const stale = controller.setFocused(true);
  await Promise.resolve();
  controller.attach(null);
  controller.attach({
    async present() {
      calls.push('new present');
    },
    async dismiss() {
      calls.push('new dismiss');
    },
  });
  finishPresent();
  await stale;
  await controller.setFocused(true);
  assert.deepEqual(calls, ['new present']);
  const queuedHide = controller.hide();
  controller.attach(null);
  await queuedHide;
  assert.deepEqual(calls, ['new present']);
});
