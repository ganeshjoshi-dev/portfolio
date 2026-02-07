declare module 'turndown' {
  interface TurndownRule {
    filter: string | string[] | ((node: HTMLElement) => boolean);
    replacement?: (content: string, node: HTMLElement, options: TurndownService.Options) => string;
  }

  class TurndownService {
    constructor(options?: TurndownService.Options);
    turndown(html: string): string;
    addRule(name: string, rule: TurndownRule): this;
    use(plugins: ((service: TurndownService) => void)[]): this;
  }

  namespace TurndownService {
    interface Options {
      headingStyle?: 'setext' | 'atx';
      hr?: string;
      bulletListMarker?: '-' | '+' | '*';
      codeBlockStyle?: 'indented' | 'fenced';
      fence?: string;
      emDelimiter?: '_' | '*';
      strongDelimiter?: '__' | '**';
      linkStyle?: 'inlined' | 'referenced';
      preformattedCode?: boolean;
    }
  }

  export = TurndownService;
}
