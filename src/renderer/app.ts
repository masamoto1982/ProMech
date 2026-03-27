import { renderFlexibleCombo } from './components/flexibleCombo';

const scopePresets = ['前', '後', '前後', '左', '右', '左右', '左前', '右前', '左後', '右後'];
const remarksPresets = ['純正', '社外', '新品', '中古', '純正/新品', '社外/新品', '純正/中古', '社外/中古'];

const mount = (): void => {
  const scopeContainer = document.getElementById('scope-combo');
  const taskContainer = document.getElementById('task-combo');
  const remarksContainer = document.getElementById('remarks-combo');
  const unitContainer = document.getElementById('unit-combo');

  if (!scopeContainer || !taskContainer || !remarksContainer || !unitContainer) return;

  renderFlexibleCombo(scopeContainer, {
    inputId: 'scopeInput',
    datalistId: 'scopeList',
    presets: scopePresets,
    placeholder: '範囲'
  });

  renderFlexibleCombo(taskContainer, {
    inputId: 'taskInput',
    datalistId: 'taskList',
    presets: ['板金', '塗装', 'バンパー交換', 'ヘッドライト', 'オイル交換'],
    placeholder: '作業または部品'
  });

  renderFlexibleCombo(remarksContainer, {
    inputId: 'remarksInput',
    datalistId: 'remarksList',
    presets: remarksPresets,
    placeholder: '備考'
  });

  renderFlexibleCombo(unitContainer, {
    inputId: 'unitInput',
    datalistId: 'unitList',
    presets: ['式', '個', '台', '時間', '本'],
    placeholder: '単位'
  });
};

document.addEventListener('DOMContentLoaded', mount);
