export interface FlexibleComboConfig {
  inputId: string;
  datalistId: string;
  presets: string[];
  placeholder?: string;
}

export const renderFlexibleCombo = (container: HTMLElement, config: FlexibleComboConfig): void => {
  container.innerHTML = `
    <label for="${config.inputId}">${config.placeholder ?? '入力または候補選択'}</label>
    <input id="${config.inputId}" list="${config.datalistId}" class="flex-combo" autocomplete="off" />
    <datalist id="${config.datalistId}">
      ${config.presets.map((v) => `<option value="${v}"></option>`).join('')}
    </datalist>
  `;
};
