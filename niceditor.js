// File: niceditor.js
/*!
 * niceditor.js – A lightweight, dependency-free WYSIWYG editor
 * Version: 1.0.0
 * Author: Dein Name
 * License: MIT
 * Repository: https://github.com/deinuser/niceditor.js
 */
(function(window, document) {
  'use strict';

  /**
   * NicEditor – transforms a <textarea> into a simple rich-text editor.
   */
  class NicEditor {
    /**
     * @param {string|HTMLElement} target
     *   A CSS selector for the <textarea>, or the element itself.
     */
    constructor(target) {
      this.textarea = (typeof target === 'string')
        ? document.querySelector(target)
        : target;
      if (!this.textarea || this.textarea.tagName !== 'TEXTAREA') {
        console.error(`NicEditor Error: <textarea> not found for "${target}".`);
        return;
      }
      this._init();
    }

    /** Builds the editor UI and wires up events. */
    _init() {
      // hide original textarea
      this.textarea.style.display = 'none';

      // wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'nic-editor';

      // toolbar
      const toolbar = this._createToolbar();
      wrapper.appendChild(toolbar);

      // content area
      const content = document.createElement('div');
      content.className = 'nic-content';
      content.contentEditable = 'true';
      content.innerHTML = this.textarea.value.trim();
      wrapper.appendChild(content);

      // insert editor before textarea
      this.textarea.parentNode.insertBefore(wrapper, this.textarea);

      // sync on input
      content.addEventListener('input', () => {
        this.textarea.value = content.innerHTML;
      });

      // sync on form submit
      const form = this.textarea.form;
      if (form) {
        form.addEventListener('submit', () => {
          this.textarea.value = content.innerHTML;
        });
      }
    }

    /** Constructs the toolbar with formatting buttons. */
    _createToolbar() {
      const toolbar = document.createElement('div');
      toolbar.className = 'nic-toolbar';

      const buttons = [
        { cmd: 'bold',                icon: '<b>B</b>',       title: 'Bold' },
        { cmd: 'italic',              icon: '<i>I</i>',       title: 'Italic' },
        { cmd: 'underline',           icon: '<u>U</u>',       title: 'Underline' },
        { cmd: 'insertUnorderedList', icon: '&#8226; List',    title: 'Unordered List' },
        { cmd: 'insertOrderedList',   icon: '1. List',         title: 'Ordered List' },
        { cmd: 'createLink',          icon: '&#128279;',      title: 'Insert Link', prompt: true }
      ];

      buttons.forEach(cfg => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = cfg.icon;
        btn.title = cfg.title;
        btn.addEventListener('click', () => {
          this._execCommand(cfg.cmd, cfg.prompt);
        });
        toolbar.appendChild(btn);
      });

      return toolbar;
    }

    /**
     * Executes a formatting command.
     * @param {string} cmd        document.execCommand identifier
     * @param {boolean} promptURL if true, ask user for URL
     */
    _execCommand(cmd, promptURL) {
      if (promptURL) {
        const url = window.prompt('Enter the URL:', 'https://');
        if (url) document.execCommand(cmd, false, url);
      } else {
        document.execCommand(cmd, false, null);
      }
      // re-focus editor
      const content = this.textarea.previousSibling.querySelector('.nic-content');
      if (content) content.focus();
    }
  }

  // expose globally
  window.NicEditor = NicEditor;

})(window, document);