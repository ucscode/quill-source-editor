/**
 * @module QuillSourceEditor
 * A module that adds a source code button to the Quill toolbar
 *
 * @author Uchenna Ajah <ucscode> 
 * @version 2.0.0
 * @link: https://github.com/ucscode/quill-source-code-editor
 * @copyright (c) 2023
*/

"use strict";

/**
 * CodeJar.js
 * highlight.js is a JavaScript library for syntax highlighting code snippets on websites, supporting over 200 programming languages and markup formats.
 * 
 * @link https://medv.io/codejar/
 */	
import { CodeJar } from './codejar.js';

/**
 * SourceEditor Class
 */
const SourceEditor = (function(e) {
	
	if( !window.Quill ) throw new ReferenceError("Quill is not defined" );
	
	/**
	 * SourceEditor Icon
	 */
	Quill.import('ui/icons')['source-editor'] = e.icon;
	
	return e;
	
})(class {
	
	static icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 -12 200 215' xmlns:xlink='http://www.w3.org/1999/xlink'><g><path d='M81 21c2,-1 4,-2 6,-2l63 0c13,0 24,10 24,22l0 36c0,4 -3,7 -8,7 -4,0 -8,-3 -8,-7l0 -36c0,-4 -3,-7 -8,-7l-55 0 0 36c0,4 -4,7 -8,7l-40 0 0 80c0,4 3,7 8,7l24 0c4,0 8,3 8,7 0,4 -4,7 -8,7l-24 0c-13,0 -24,-9 -24,-21l0 -87c0,-2 1,-4 2,-5l48 -44zm-23 42l21 0 0 -19 -21 19zm98 38l32 29c3,3 3,7 0,10l-32 29c-3,3 -8,3 -11,0 -3,-3 -3,-7 0,-10l26 -24 -26 -24c-3,-3 -3,-7 0,-10 3,-3 8,-3 11,0zm-32 10c3,-3 3,-7 0,-10 -3,-3 -8,-3 -11,0l-32 29c-3,3 -3,7 0,10l32 29c3,3 8,3 11,0 3,-3 3,-7 0,-10l-26 -24 26 -24z'/></g></svg>";
	
	config = {
		indent: true, 
		highlight: null
	}
	
	sourceMode = false;
	
	constructor(QuillInstance, config) {
		
		if( typeof config.highlight !== 'function' ) {
			if( config.highlight == undefined ) config.highlight = function(){};
			else throw new TypeError('A syntax highlighting function is required');
		};
		
		this.setConfig(config);
		this.quill = QuillInstance;
		this.toolbar = this.quill.theme.modules.toolbar;
		
		this.button = this.toolbar.container.querySelector('.ql-formats .ql-source-editor');
		if( !this.button ) this.createButton();
		this.button.addEventListener('click', this.onClick.bind(this));
		
		this.createCodeBlock();
		
	}
	
	/**
	 * Make changes to default configuration!
	 */
	setConfig(config) {
		for( let x in this.config ) {
			if( config[x] === undefined ) continue;
			this.config[x] = config[x];
		};
	}
	
	/**
	 * Create a source editor button if user did not already add it to the toolbar
	 */
	createButton() {
		
		// The container
		let span = document.createElement('span');
		span.classList.add('ql-formats');
		
		// The button
		this.button = document.createElement('button');
		this.button.type = 'button';
		this.button.classList.add('ql-source-editor');
		this.button.innerHTML = Quill.import('ui/icons')['source-editor'];
		
		// Add button to toolbar
		span.appendChild( this.button );
		this.toolbar.container.appendChild( span );
		
	}
	
	/**
	 * The block for previewing code
	 */
	createCodeBlock() {
		
		/**
		 * Create a new container 
		 * The container will hold the block for editing source code
		 */
		this.codeBlock = this.quill.addContainer('ql-source-editor', this.quill.root);
		
		/**
		 * Hide the block
		 * Since we'll only be needing it when in source mode
		 */
		this.codeBlock.classList.add('ql-hidden');
		
		/**
		 * Within the code block shall be our source editor
		 * Which we will create dynamically
		 */
		let editor = document.createElement('div');
		editor.classList.add('ql-source-block', 'language-html');
		
		/**
		 * Append editor to the code block
		 */
		this.codeBlock.appendChild( editor );
		
		/**
		 * Activate Code Jar
		 * CodeJar will convert the block into a code editor block
		 * Hence, with the CodeJar API, we can have full control over the source code manipulation
		 */ 
		this.jar = CodeJar(editor, editor => {
			editor.textContent = editor.textContent
			this.config.highlight(editor)
		});
		
		/**
		 * Add inner css stylesheet
		 */
		this.innerCSS();
		
	}
	
	/**
	 * Insert Internal Stylesheet for CodeBlock
	 */
	innerCSS() {
		
		/**
		 * Create style element
		 */
		let style = document.createElement('style');
		style.type = 'text/css';
		
		/**
		 * Create Text Node
		 */
		let css = `
			.ql-source-editor .ql-source-block { 
				padding: 0.5rem;
				font-family: "Courier New";
				font-size: 0.76rem;
			}
		`;
		style.appendChild( document.createTextNode(css) );
		
		/**
		 * Append style to <head/>
		 */
		document.head.appendChild(style);
		
	}
	
	/**
	 * Handle Click Event for the source editor button
	 */
	onClick() {
		!this.sourceMode ? this.showCode() : this.showEditor();
	}
	
	/**
	 * Show the Source Code
	 */
	showCode() {
		
		// Enable Source Mode
		this.sourceMode = true;
		
		// Disable Quill Editor
		this.quill.enable(false);
		
		// Get Editor Source Code
		let sourceCode = this.prettyPrint( this.quill.root.innerHTML );
		
		// Hide Quill Editor
		this.quill.root.classList.add('ql-hidden');
		this.codeBlock.classList.remove('ql-hidden');
		
		this.jar.updateCode( sourceCode );
		
	}
	
	/**
	 * Show the Quill Editor
	 */
	showEditor() {
		
		// Disable Source Mode
		this.sourceMode = false;
		
		// Enable Quill Editor
		this.quill.enable(true);
		
		// Hide Quill Editor
		this.quill.root.classList.remove('ql-hidden');
		this.codeBlock.classList.add('ql-hidden');
		
		// Get Quill Editor Content
		this.#visualCode();
		
	}
	
	#visualCode() {
		
		let HTML = this.jar.toString(); 
		
		this.quill.clipboard.dangerouslyPasteHTML( HTML );
		
	}
	
	/**
	 * Simultate PHP's htmlspecialchars function
	 *
	 * This function was used in version 1 but became deprecated after `CodeJar` was added in version 2
	 *
	 * @deprecated
	 */
	htmlspecialchars( value, reverse = false ) {
		
		/** Entity Converter */
		const entities = [
			['<', '&lt;'],
			['>', '&gt;'],
			['\'', '&apos;'],
			['"', '&quot;']
		];
		
		!reverse ? entities.unshift(['&', '&amp;']) : null;
		
		for( let entity of entities ) {
			let from = entity[ !reverse ? 'shift' : 'pop' ]();
			let to = entity[0];
			let regex = new RegExp(`${from}`, 'ig');
			value = value.replace( regex, to );
		};
		
		return value;
		
	}
	
	/**
	 * Indent HTML Code
	 * By default, Quill.js does not indent syntax.
	 */
	prettyPrint(str) {
		if( !this.config.indent ) return str.trim();
		let div = document.createElement('div');
		div.innerHTML = str.trim();
		return this.#formatHTML(div, 0).innerHTML.trim();
	}
	
	/**
	 * Format HTML Syntax
	 */
	#formatHTML(node, level) {

		let indentBefore = new Array(level++ + 1).join('  ');
		let	indentAfter  = new Array(level - 1).join('  ');
		let textNode;

		for (let i = 0; i < node.children.length; i++) {

			textNode = document.createTextNode('\n' + indentBefore);
			node.insertBefore(textNode, node.children[i]);

			this.#formatHTML(node.children[i], level);

			if (node.lastElementChild == node.children[i]) {
				textNode = document.createTextNode('\n' + indentAfter);
				node.appendChild(textNode);
			};
			
		}

		return node;
		
	}
	
});

export default SourceEditor;
