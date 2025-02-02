declare module 'translate-google' {
    function Translate(text: string, options: { to: string }): Promise<string>;
    export = Translate;
}