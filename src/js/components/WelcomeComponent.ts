import { Component } from "../tools/Component";
import { store } from "../store";
import { login } from "../store/actions";

export interface IWelcomeComponentState {
  nickname: string;
}

export class WelcomeComponent extends Component<IWelcomeComponentState> {
  get templateOptions() {
    return {
      show: Number(this.state?.nickname?.length) < 1,
    };
  }

  template = `
    <?if(show){?>
      <main class="app-container sign-in">
        <h1 class="h3 mb-3 fw-normal">Enter your nickname</h1>
        <div class="form-floating">
          <input type="text" class="form-control" id="js-nickname-input" placeholder="Guest">
          <label for="js-nickname-input">Nickname</label>
        </div>
        <div class="form-floating">
            <button class="js-submit-btn w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
        </div>
      </main>
    <?}?>
  `;

  private submitByEnter = (ev: Event | KeyboardEvent): void => {
    if (ev instanceof KeyboardEvent && ev.code == "Enter") {
      this.submit();
    }
  };

  private submit = (): void => {
    const input = document.querySelector("#js-nickname-input") as HTMLInputElement;
    const nickname = input.value.trim();

    if (!nickname) {
      alert("Enter your nickname");
      return;
    }

    store.dispatch(login(nickname));
  };

  events = {
    "click@.js-submit-btn": this.submit,
    "keyup@#js-nickname-input": this.submitByEnter,
  };
}
