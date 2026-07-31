/*
 * toastlite v0.1.0
 * A tiny, zero-dependency toast notification library.
 * Works as a global (window.Toast), CommonJS, or AMD module.
 */
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.Toast = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TYPES = ['success', 'error', 'warning', 'info'];

  var DEFAULT_OPTIONS = {
    type: 'info',
    duration: 3000,
    position: 'top-right',
    progressBar: true,
    closable: true,
    clickToDismiss: true,
  };

  var ICONS = {
    success: '\u2714',
    error: '\u2716',
    warning: '\u26A0',
    info: '\u2139',
  };

  var POSITIONS = [
    'top-right',
    'top-left',
    'top-center',
    'bottom-right',
    'bottom-left',
    'bottom-center',
  ];

  var containers = {};

  function getContainer(position) {
    if (!containers[position]) {
      var el = document.createElement('div');
      el.className = 'toast-container toast-container--' + position;
      document.body.appendChild(el);
      containers[position] = el;
    }
    return containers[position];
  }

  function removeContainerIfEmpty(position) {
    var container = containers[position];
    if (container && container.children.length === 0) {
      container.remove();
      delete containers[position];
    }
  }

  function dismiss(toastEl) {
    if (!toastEl || toastEl.classList.contains('toast--leaving')) return;
    clearTimeout(toastEl._toastTimer);
    toastEl.classList.add('toast--leaving');
    toastEl.addEventListener('transitionend', function () {
      toastEl.remove();
      removeContainerIfEmpty(toastEl._toastPosition);
    }, { once: true });
  }

  function createToast(message, options) {
    var opts = Object.assign({}, DEFAULT_OPTIONS, options || {});
    if (TYPES.indexOf(opts.type) === -1) opts.type = 'info';
    if (POSITIONS.indexOf(opts.position) === -1) opts.position = 'top-right';

    var animation = opts.position.indexOf('left') === 0
      ? 'left'
      : opts.position.indexOf('right') === 0
        ? 'right'
        : opts.position.indexOf('bottom') === 0
          ? 'up'
          : 'down';

    var container = getContainer(opts.position);
    var toastEl = document.createElement('div');
    toastEl.className = 'toast toast--' + opts.type;
    toastEl.setAttribute('data-animation', animation);
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    toastEl._toastPosition = opts.position;

    var icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = ICONS[opts.type];
    toastEl.appendChild(icon);

    var body = document.createElement('div');
    body.className = 'toast-body';

    var title = document.createElement('p');
    title.className = 'toast-title';
    title.textContent = opts.title || opts.type.charAt(0).toUpperCase() + opts.type.slice(1);
    body.appendChild(title);

    if (message) {
      var msg = document.createElement('p');
      msg.className = 'toast-message';
      msg.textContent = message;
      body.appendChild(msg);
    }
    toastEl.appendChild(body);

    if (opts.closable) {
      var closeBtn = document.createElement('button');
      closeBtn.className = 'toast-close';
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Dismiss notification');
      closeBtn.textContent = '\u00D7';
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        dismiss(toastEl);
      });
      toastEl.appendChild(closeBtn);
    }

    if (opts.progressBar) {
      var bar = document.createElement('div');
      bar.className = 'toast-progress';
      bar.style.animationDuration = opts.duration + 'ms';
      toastEl.appendChild(bar);
    }

    if (opts.clickToDismiss) {
      toastEl.addEventListener('click', function () {
        dismiss(toastEl);
      });
    }

    container.appendChild(toastEl);

    if (opts.duration > 0) {
      toastEl._toastTimer = setTimeout(function () {
        dismiss(toastEl);
      }, opts.duration);
    }

    return toastEl;
  }

  function toast(message, options) {
    return createToast(message, options);
  }

  TYPES.forEach(function (type) {
    toast[type] = function (message, options) {
      return createToast(message, Object.assign({}, options, { type: type }));
    };
  });

  toast.dismiss = dismiss;
  toast.defaults = DEFAULT_OPTIONS;

  return toast;
});
