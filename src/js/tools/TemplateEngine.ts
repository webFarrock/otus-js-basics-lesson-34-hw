export interface ITemplateEngine {
  render(): string;
}

export class TemplateEngine implements ITemplateEngine {
  constructor(private template: string, private options: Record<string, unknown> = {}) {}

  collectCode = (line: string, js = false) => {
    const reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
    const code: string[] = [];

    if (js) {
      code.push(line.match(reExp) ? line + "\n" : "r.push(" + line + ");\n");
    } else {
      code.push(line != "" ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : "");
    }

    return code;
  };

  render(): string {
    const re = /<\?([^?>]+)?\?>/g;

    let code: string[] = ["let r=[];\n"];
    let cursor = 0;
    let match: RegExpExecArray | null = null;

    code.push(`const {${Object.keys(this.options).join(", ")}} = this;`);

    do {
      match = re.exec(this.template);
      if (!match) break;

      code = [
        ...code,
        ...this.collectCode(this.template.slice(cursor, match.index)),
        ...this.collectCode(match[1], true),
      ];
      cursor = match.index + match[0].length;
    } while (match);

    code = [...code, ...this.collectCode(this.template.substr(cursor, this.template.length - cursor))];

    code.push('return r.join("");');
    return new Function(code.join("").replace(/[\r\t\n]/g, "")).apply(this.options);
  }
}
