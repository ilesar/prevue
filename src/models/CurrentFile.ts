import * as path from "path";
import * as vscode from "vscode";

export class CurrentFile {
    private static _instance: CurrentFile | undefined;
    private _window: vscode.TextEditor | undefined;

    public static getInstance(): CurrentFile {
        if (CurrentFile._instance === undefined) {
            CurrentFile._instance = new CurrentFile();
        }

        return CurrentFile._instance;
    }

    public get path(): string {
        if (this._window === undefined) {
            throw new Error("No active window!");
        }

        return this._window.document.fileName;
    }

    public get filename(): string {
        return path.basename(this.path);
    }

    public refresh(): void {
        this._window = vscode.window.activeTextEditor as vscode.TextEditor;

        if (this._window === undefined || this._window.document === undefined) {
            vscode.window.showErrorMessage("Open a Vue SFC file!");
            return;
        }

        if (this.filename.includes(".vue") === false) {
            vscode.window.showErrorMessage("Only .vue files are accepted");
            return;
        }
    }
}
