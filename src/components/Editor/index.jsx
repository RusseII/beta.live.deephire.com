import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editoroverride.css';
/*
 * Editor component with custom toolbar and content containers
 */
const CustomHeart = () => <span>♥</span>;
// Add sizes to whitelist and register them
const Size = Quill.import('formats/size');
Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
Quill.register(Font, true);

// Returns an array of content headings
function parseTableOfContents(notes) {
  // Get first <ul></ul>
  const regex = /<ul>([\s\S]*?)<\/ul>/g;
  // Get matches starting with <li> and text between the closing <li> (no negative lookbehinds)
  const innerTagRegex = /((<li>))(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+(?=(<\/li>))/g;
  const unorderedListTags = notes.match(regex);
  if (unorderedListTags && unorderedListTags.length > 0) {
    var unorderedListHtml = unorderedListTags[0].match(innerTagRegex);
    return unorderedListHtml.map(match => match.replace('<li>', '').replace('&nbsp;', ''));
  } else {
    return false;
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    let { notes } = props;
    this.quillRef = null;
    this.reactQuillRef = null;
    this.state = { editorHtml: notes, tableOfContents: parseTableOfContents(notes) };
  }

  handleChange = html => {
    this.setState({ editorHtml: html });
  };

  static modules = {
    toolbar: {
      container: '#toolbar',
      handlers: {
        insertHeart: navigateToContents,
      },
    },
  };

  static formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
  ];

  render() {
    let { editorHtml, tableOfContents } = this.state;
    return (
      <div style={{ position: 'relative', backgroundColor: 'white' }}>
        <div style={{ height: '40vh' }}>
          <div className="text-editor">
            <CustomToolbar tbc={tableOfContents} />
            <ReactQuill
              ref={el => {
                this.reactQuillRef = el;
              }}
              theme="snow"
              value={editorHtml}
              onChange={this.handleChange}
              placeholder={'i am quill'}
              modules={Editor.modules}
              formats={Editor.formats}
            />
          </div>
        </div>
      </div>
    );
  }
}

function navigateToContents(content = 'Job Search Activities') {
  const delta = this.quill.getContents();
  const quillText = this.quill.getText();
  console.log(quillText);
  var contentIndex = delta.ops.findIndex(node => node?.insert.indexOf(`<TOC: ${content}`));
  console.log(contentIndex);

  var tableOfContentsPosition = quillText.indexOf(`<TOC: ${content}`);
  console.log(tableOfContentsPosition);
  var bounds = this.quill.getBounds(contentIndex);
  console.log(bounds);
  this.quill.setSelection(tableOfContentsPosition, tableOfContentsPosition + 1);
  this.quill.container.scrollTop = 300;
  console.log(this.quill.container);
  // Move to location
}

function insertHeart() {
  const cursorPosition = this.quill.getSelection().index;
  const delta = this.quill.getContents();
  console.log(delta);
  this.quill.insertText(cursorPosition, '♥');
  var bounds = this.quill.getBounds(2000, 2001);
  console.log(bounds);
  console.log(this.quill.container);
  this.quill.container.scrollTop = bounds.top;
}

/*
 * Custom toolbar component including the custom heart button and dropdowns
 */
const CustomToolbar = ({ tbc }) => (
  <div id="toolbar" style={{ height: '3em' }}>
    <select className="ql-font">
      <option value="arial" selected>
        Arial
      </option>
      <option value="comic-sans">Comic Sans</option>
      <option value="courier-new">Courier New</option>
      <option value="georgia">Georgia</option>
      <option value="helvetica">Helvetica</option>
      <option value="lucida">Lucida</option>
    </select>
    <select className="ql-size">
      <option value="extra-small">Size 1</option>
      <option value="small">Size 2</option>
      <option value="medium" selected>
        Size 3
      </option>
      <option value="large">Size 4</option>
    </select>
    <select className="ql-align" />
    <select className="ql-color" />
    <select className="ql-background" />
    <button className="ql-clean" />
    <button className="ql-insertHeart">
      <CustomHeart />
    </button>
  </div>
);

export default Editor;
