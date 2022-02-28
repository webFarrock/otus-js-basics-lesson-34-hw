import { Component } from "../tools/Component";
import { store } from "../store";
import { logout } from "../store/actions";
import { MessageType, sendMessage } from "../api/messages";

export interface IChatComponentState {
  nickname: string;
  messages: MessageType[];
}

export class ChatComponent extends Component<IChatComponentState> {
  get templateOptions() {
    const show = this.state?.nickname && this.state.nickname.length > 0 ? true : false;

    return {
      show,
      nickname: this.state?.nickname,
      messages: this.state?.messages || [],
    };
  }

  private logout = (): void => {
    store.dispatch(logout());
  };

  private sendByEnter = (ev: Event | KeyboardEvent): void => {
    if (ev instanceof KeyboardEvent && ev.code == "Enter") {
      this.send();
    }
  };

  private send = (): void => {
    const btn = document.querySelector(".js-send-message") as HTMLButtonElement;
    if (btn.disabled) return;

    const input = document.querySelector(".js-message-value") as HTMLInputElement;
    const messageText = input.value.trim();

    if (!messageText) return;

    const message: MessageType = {
      nickname: this.state?.nickname,
      message: messageText,
    };

    btn.disabled = true;
    sendMessage(message);
  };

  events = {
    "click@.js-logout-btn": this.logout,
    "click@.js-send-message": this.send,
    "keyup@.js-message-value": this.sendByEnter,
  };

  template = `
    <?if(show){?>
      <h1 class="h3 mb-3 fw-normal">Hello, <?nickname?> 
        <button class="js-logout-btn btn btn-lg btn-danger" type="submit">Logout</button>
      </h1>
      <div class="input-group message-input sticky-top">
        <input type="text" class="js-message-value form-control" placeholder="Enter your message...">
        <button class="js-send-message btn btn-primary" type="button">Send</button>
      </div>

      <div class="list-group message-list">
        <?for(let index in messages) {?>
          <div class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1"><?messages[index]["nickname"]?></h5>
              <small><?messages[index]["date"]?></small>
            </div>
            <p class="mb-1"><?messages[index]["message"]?></p>
          </div>
        <?}?>
      </div>
    <?}?>    
  `;
}
