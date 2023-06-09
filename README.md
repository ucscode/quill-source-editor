# Quill Source Editor
Inline source code editing module for Quill.js editor

Quill Source Editor is a versatile module that allows users to switch between normal view and code view. With just a click of a button, users can see the HTML code behind their content and make any necessary edits. This is particularly useful for users who want to see the markup of their content or make advanced edits.

The module uses CodeJar, a lightweight and customizable code editor, to render the HTML code in real-time. This means that users can see the changes they make to the code as they type, and easily switch back to normal view to see the final result.

Quill Source Editor is a module that adds a button to the Quill toolbar, allowing users to switch between normal view and code view. This feature provides users with the ability to analyze the HTML markup behind their content, make direct changes to the code, and see the new result immediately.

# Why use Quill Source Editor?

Quill Source Editor is useful for several reasons. One of the most important is that it allows users to edit the HTML code behind their content directly. For example, Quill Image uses data URL to render images, which can be quite long and space-consuming because it's encoded in base64. If you have multiple images, this can affect the performance of the website when the content is rendered in front-end. With Quill Source Editor, you can replace the data URL with a regular HTTP URL that points to an image and also add specific attributes like width="100%" since Quill does not directly allow resizing of images.

# Installation
To use Quill Source Editor, you need to download the quill-source-editor.js file and the CodeJar.js library and include them in your project. Then, you can import the QuillSourceEditor module and register it with Quill.js.

```js
import QuillSourceEditor from "./quill-source-editor.js";

Quill.register("modules/sourceEditor", QuillSourceEditor);

const config = {
	theme: "snow",
	modules: {
		toolbar: [...],
		sourceEditor: {
			indent: true,
			highlight: hljs.highlightElement
		}
	}
}

let quill = new Quill('#element', config);
```
The `hljs.highlightElement` function is used for syntax highlighting, but you can replace it with `Prism.highlightElement` or any other highlighting function of your choice.

# Usage
By default, Quill Source Editor adds a button to the toolbar that allows users to switch between the WYSIWYG view and the code view. The button is positioned as the last button on the toolbar, but you can also add it to a specific position by including "source-editor" as a button in the toolbar configuration.

```js
modules: {
	toolbar: [
		['bold', 'italic'],
		['link', 'image', "source-editor"]
	]
};
```
# Benefits
Quill Source Editor provides several benefits for users who need to edit the HTML source code of their content directly. For example, they can:

- Add specific attributes to elements, such as width="100%", that Quill.js does not support by default
- Analyze and edit their code directly to make changes more efficiently

# Contributing
If you'd like to contribute to Quill Source Editor, please feel free to open a pull request or issue on GitHub.

# License
Quill Source Editor is licensed under the MIT License. See LICENSE.md for more information.

# Acknowledgements
Quill Source Editor is built on top of Quill and CodeJar, two excellent open-source libraries. Thank you to the maintainers and contributors of these projects for their hard work and dedication to the open-source community.
