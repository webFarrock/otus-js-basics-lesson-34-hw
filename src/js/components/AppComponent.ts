import { Component } from "../tools/Component";
import { WelcomeComponent, IWelcomeComponentState } from "./WelcomeComponent";
import { ChatComponent, IChatComponentState } from "./ChatComponent";
import { store } from "../store";

export class AppComponent extends Component {
  private welcomeComponent?: Component<IWelcomeComponentState>;
  private chatComponent?: Component<IChatComponentState>;

  get templateOptions() {
    return {};
  }

  async update() {
    const { nickname, messages } = store.getState();
    this.welcomeComponent?.setState({ nickname });
    this.chatComponent?.setState({ nickname, messages });
  }

  protected onMount() {
    const chatState: IChatComponentState = {
      nickname: "",
      messages: [],
    };
    this.chatComponent = new ChatComponent(document.getElementById("component-chat") as HTMLElement, chatState);

    const welcomeState: IWelcomeComponentState = {
      nickname: "",
    };
    this.welcomeComponent = new WelcomeComponent(
      document.getElementById("component-welcome") as HTMLElement,
      welcomeState
    );

    this.render();
  }

  template = `
    <div class="app-container">
      <main class="sign-in" id="component-welcome"></main>
      <main class="chat-container" id="component-chat"></main>
    </div>  
  `;
}
