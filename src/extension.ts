import * as path from "path";
import * as vscode from "vscode";
import { Preview } from "./models/Preview";
import { CurrentFile } from "./models/CurrentFile";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("prevue.show", () => {
            const currentFile = CurrentFile.getInstance();
			const preview: Preview = Preview.getInstance();

            currentFile.refresh();
            preview.renderWebView(currentFile.filename);
            preview.show();
        })
    );
}
