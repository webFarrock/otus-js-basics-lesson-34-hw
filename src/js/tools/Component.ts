import { TemplateEngine } from "./TemplateEngine";

export abstract class Component<TState = Record<string, never>> {
  protected state?: Partial<TState>;

  protected events: {
    [key: string]: (ev: Event | KeyboardEvent) => void;
  } = {};

  abstract templateOptions: Record<string, unknown>;
  abstract template: string;

  constructor(protected el: HTMLElement, state?: Partial<TState>) {
    this.el = el;
    if (state) {
      this.state = { ...this.state, ...state };
    }

    setTimeout(() => {
      this.el.innerHTML = this.render();
      this.subscribeToEvents();
      this.onMount(this.el);
    }, 0);
  }

  render(): string {
    return new TemplateEngine(this.template, this.templateOptions).render();
  }

  setState(obj: Partial<TState>) {
    this.state = { ...this.state, ...obj };
    this.el.innerHTML = this.render();
    this.subscribeToEvents();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  protected onMount(el: HTMLElement): void {}

  private subscribeToEvents(): void {
    Object.entries(this.events).forEach(([key, fn]) => {
      const [eventName, selector] = key.split("@");
      if (eventName && selector) {
        const elems = this.el.querySelectorAll(selector);
        elems.forEach((el) => {
          el.addEventListener(eventName, fn);
        });
      }
    });
  }
}
