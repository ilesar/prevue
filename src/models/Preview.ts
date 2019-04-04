import * as path from "path";
import * as vscode from "vscode";
import { Nonce } from "../helpers/Nonce";

export class Preview {
    private static _instance: Preview | undefined;

    private _window: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static getInstance(): Preview {
        if (Preview._instance === undefined) {
            Preview._instance = new Preview();
        }

        return Preview._instance;
    }

    private constructor() {
        this._window = vscode.window.createWebviewPanel(
            "Prevue",
            "Prevue Preview",
            vscode.ViewColumn.Two,
            {
                enableScripts: true
            }
        );

        this._window.onDidDispose(
            () => this.dispose(),
            null,
            this._disposables
        );
    }

    public renderWebView(filename: string): any {
        const title = filename.substring(0, filename.length - 4);

        this._window.title = `📕${title} preview`;
        this._window.webview.html = this._getHtmlForWebview(title);
    }

    public show(): any {
        throw new Error("Method not implemented.");
    }

    private dispose(): void {
        this._window.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }

        Preview._instance = undefined;
    }

    private _getHtmlForWebview(title: string): string {
        const config = vscode.workspace.getConfiguration("prevue");

        const nonce = Nonce.generate();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">

                <!--
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
                -->
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
                
            </head>
            <body>

                <style>
                    .preview {
                        background: white; width: 100%; height: calc(100vh - 8px);
                        background-image:
                            linear-gradient(45deg, #DDD 25%, transparent 25%), 
                            linear-gradient(-45deg, #DDD 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #DDD 75%),
                            linear-gradient(-45deg, transparent 75%, #DDD 75%);
                            background-size:20px 20px;    
                            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                    }
                </style>
                <iframe class="preview" src="http://${config.storybookHost}:${
            config.storybookPort
            }/iframe.html?id=${title
                .replace(/[\W_]+/g, "-")
                .toLowerCase()}--default" frameBorder="0">                
            </body>
            </html>`;
    }
}
