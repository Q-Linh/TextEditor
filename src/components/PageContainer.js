import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions'
import { EditorState, RichUtils, AtomicBlockUtils, SelectionState, convertToRaw, convertFromRaw, CompositeDecorator } from 'draft-js';

import Editor from 'draft-js-plugins-editor';
import { mediaBlockRenderer } from './entities/mediaBlockRenderer'
import basicTextStylePlugin from './plugins/basicTextStylePlugin';
import addLinkPlugin from './plugins/addLinkPlugin';
import createHighlightPlugin from './plugins/highlightPlugin';
import {InlineStyles} from './inlineStyles/InlineStyles'
import {
  styleMap,
  getBlockStyle,
  BLOCK_TYPES,
  BlockStyleControls
} from "./blockStyles/BlockStyles";
import StyleButton from "./blockStyles/BlockStyles"
import { convertToHTML } from 'draft-convert';







const highlightPlugin = createHighlightPlugin();

class PageContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
    }

    this.plugins = [
      highlightPlugin,
      basicTextStylePlugin,
    ];

  }

  componentDidMount() {
    // Load editor data (raw js object) from local storage
    const rawEditorData = this.getSavedEditorData();
    if (rawEditorData !== null) {
      const contentState = convertFromRaw(rawEditorData);
      this.setState({
        editorState: EditorState.createWithContent(contentState)
      });
    }
  }

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    //console.log('content state', convertToRaw(contentState));
    this.setState({
      editorState
    });
  }

  saveContent = (content) => {
    localStorage.setItem('editorData', JSON.stringify(convertToRaw(content)));
  }

  getSavedEditorData() {
    const savedData = localStorage.getItem('editorData');

    return savedData ? JSON.parse(savedData) : null;
  }

  toggleInlineStyle = (style) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style))
  }

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  exportHTML = () => {
    this.setState({ convertedHTML: convertToHTML(this.state.editorState.getCurrentContent()) });
  };

  updateHTML = (e) => {
    e.preventDefault();
    this.setState({ convertedHTML: e.target.value });
  };

  exportJS = () => {
    const raw = convertToRaw(this.state.editorState.getCurrentContent());
    this.setState({ convertedJS: JSON.stringify(raw, null, 2) });
  };

  updateJS = (e) => {
    e.preventDefault();
    this.setState({ convertedJS: e.target.value });
  };

  onURLChange = (e) => this.setState({urlValue: e.target.value});

  focus = () => this.refs.editor.focus();

  onAddImage = (e) => {
    e.preventDefault();
    const editorState = this.state.editorState;
    const urlValue = window.prompt('Paste Image Link')
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {src: urlValue});
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity}, 'create-entity');
    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '),
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  render() {
    return(
      <div>
        <div className="editorContainer">
          <div className="aboveEditor">

            <span className="noteTitle">
              <input type="text" placeholder="Title" name="noteTitle" className="noteTitle"/>
            </span>
            <span className="noteTag">
              <input type="text" placeholder="Tags" name="noteTag" className="noteTag"/>
            </span>

          </div>

          <div className="tool-bar">

            <InlineStyles editorState={this.state.editorState} onToggle={this.toggleInlineStyle}/>

            <BlockStyleControls
              editorState={this.state.editorState}
              onToggle={this.toggleBlockType}
              />

            <button className="inline styleButton" onClick={this.onAddImage}>
              <i className="material-icons">photo</i>
            </button>

          </div>

          <div className="editors">
            <Editor

              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}

              editorState={this.state.editorState}

              onChange= { this.onChange }
              plugins={this.plugins}
              handleKeyCommand={this.handleKeyCommand}
              blockRendererFn={mediaBlockRenderer}
              blockStyleFn={getBlockStyle}
              ref="editor"
              />
          </div>
          <div className="belowEditor">
            <button className="btHTML" onClick={this.exportHTML}>
              HTML
            </button>
            <button className="btJS" onClick={this.exportJS}>
              JS
            </button>
          </div>
        </div>
        <div className="flexArea1">
          <p>HTML:</p>
          <textarea onChange={this.updateHTML} value={this.state.convertedHTML}/>
        </div>
        <div className="flexArea2">
          <p>JS:</p>
          <textarea onChange={this.updateJS} value={this.state.convertedJS}/>
        </div>
      </div>
    )
  }
}

export default PageContainer;
