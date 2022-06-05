// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode_1 = require('vscode');
// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
function activate(ctx) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "Wordcount" is now active!');
    // create a new word counter
    var wordCounter = new WordCounter();
    var controller = new WordCounterController(wordCounter);
    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(wordCounter);
}
exports.activate = activate;
var WordCounter = (function () {
    function WordCounter() {
    }
    WordCounter.prototype.updateWordCount = function () {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        // Get the current text editor
        var editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        var doc = editor.document;
        var wordCount = this._getWordCount(doc);
        // Update the status bar
        this._statusBarItem.text = wordCount !== 1 ? "$(pencil) " + wordCount + " Characters" : '$(pencil) 1 Character';
        this._statusBarItem.show();

    };
    WordCounter.prototype._getWordCount = function (doc) {
        var docContent = doc.getText();
        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/\s/g, '');
        //docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        var wordCount = 0;
        if (docContent != "") {
            wordCount = docContent.length;
            //wordCount = docContent.split(" ").length;
        }
        return wordCount;
    };
    WordCounter.prototype.dispose = function () {
        this._statusBarItem.dispose();
    };
    return WordCounter;
})();
exports.WordCounter = WordCounter;
var WordCounterController = (function () {
    function WordCounterController(wordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();
        // subscribe to selection change and editor activation events
        var subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from.apply(vscode_1.Disposable, subscriptions);
    }
    WordCounterController.prototype._onEvent = function () {
        this._wordCounter.updateWordCount();
    };
    WordCounterController.prototype.dispose = function () {
        this._disposable.dispose();
    };
    return WordCounterController;
})();
//# sourceMappingURL=extension.js.map