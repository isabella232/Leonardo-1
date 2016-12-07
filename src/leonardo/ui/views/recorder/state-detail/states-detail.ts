import Utils from '../../../ui-utils';

export default class RecorderStateDetail {
  viewNode: any;
  openState: boolean = false;
  curState;
  onCancelBinded: EventListener = this.onCancel.bind(this);
  onSaveBinded: EventListener = this.onSave.bind(this);

  constructor() {
    this.viewNode = Utils.getElementFromHtml(`<div id="leonardo-state-detail" class="leonardo-state-detail-recorder"></div>`);
  }

  get() {
    return this.viewNode;
  }

  render() {
    if (this.viewNode.innerHTML) {
      this.viewNode.querySelector('.leonardo-states-detail-cancel').removeEventListener('click', this.onCancelBinded, false);
      this.viewNode.querySelector('.leonardo-states-detail-save').removeEventListener('click', this.onSaveBinded, false);
    }

    let html;

    //TODO congratulate ourselves on being awesome!!
    if (this.curState.recorded) {
      html = `<div class="leonardo-states-detail-header">Add mocked response for <strong>${this.curState.name}</strong></div>`;
    }
    else {
      html = `<h1 class="leonardo-states-detail-header"/>Add new state</h1>
              <div>State name: <input class="leonardo-states-detail-state-name"/></div>`;
    }

    html += `<div>Option name: <input class="leonardo-states-detail-option-name" value="${this.curState.options[0].name}"/></div>
              <div>Status code: <input class="leonardo-states-detail-status" value="${this.curState.options[0].status}"/></div>
              <div>Delay: <input class="leonardo-states-detail-delay" value="0"/></div>
              <div>Response: <textarea class="leonardo-states-detail-json">${this.getResString(this.curState.options[0].data)}</textarea></div>
              <button class="leonardo-button leonardo-states-detail-save">Save</button>
              <button class="leonardo-button leonardo-states-detail-cancel" >Cancel</button>`;

    this.viewNode.innerHTML = html;
    this.viewNode.querySelector('.leonardo-states-detail-cancel').addEventListener('click', this.onCancelBinded, false);
    this.viewNode.querySelector('.leonardo-states-detail-save').addEventListener('click', this.onSaveBinded, false);
  }

  open(state) {
    this.curState = state;
    this.render();
    this.openState = true;
    this.viewNode.style.display = '';
  }

  close(state?) {
    if (state && this.curState !== state) {
      this.open(state);
      return;
    }
    this.openState = false;
    this.viewNode.style.display = 'none';
  }

  toggle(state) {
    if (this.openState) {
      this.close(state);
      return;
    }
    this.open(state);
  }
  
  private getResString(resopnse: string): string {
    let resStr: string;
    try {
      resStr = JSON.stringify(resopnse, null, 4);
    }
    catch(e){
       resStr = typeof resopnse === 'string' ? resopnse : resopnse.toString();
    }
    return resStr;
  }

  private onCancel() {
    this.close();
  }

  private onSave() {
    const statusVal: string = this.viewNode.querySelector(".leonardo-states-detail-status").value;
    const delayVal: string = this.viewNode.querySelector(".leonardo-states-detail-delay").value;
    const jsonVal: string = this.viewNode.querySelector(".leonardo-states-detail-json").value;
    const optionNameVal: string = this.viewNode.querySelector(".leonardo-states-detail-option-name").value;
    this.curState.activeOption.status = statusVal;
    this.curState.activeOption.delay = delayVal;
    this.curState.activeOption.name = optionNameVal;
    if(!this.curState.recorded){
      this.curState.name = this.viewNode.querySelector('.leonardo-states-detail-state-name').value || this.curState.name;
    }
    try {
      this.curState.activeOption.data = JSON.parse(jsonVal);
    }
    catch (e) {
      this.curState.activeOption.data = jsonVal;
    }

    Leonardo.addOrUpdateSavedState(this.curState);
    this.close();
  }
}
