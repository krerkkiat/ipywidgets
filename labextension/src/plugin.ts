// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  IWidgetExtension, IDocumentContext, IDocumentModel, IDocumentRegistry
} from 'jupyterlab/lib/docregistry';

import {
  IDisposable, DisposableDelegate
} from 'phosphor/lib/core/disposable';

import {
  Token
} from 'phosphor/lib/core/token';

import {
  INotebookModel
} from 'jupyterlab/lib/notebook/notebook/model';

import {
  NotebookPanel
} from 'jupyterlab/lib/notebook/notebook/panel';

import {
  JupyterLabPlugin, JupyterLab
} from 'jupyterlab/lib/application';

import {
  Application
} from 'phosphide/lib/core/application';

import {
  WidgetManager, WidgetRenderer
} from './index';

import {
  IKernel
} from 'jupyter-js-services';

const WIDGET_MIMETYPE = 'application/vnd.jupyter.widget';

export
const IIPyWidgetExtension = new Token<IIPyWidgetExtension>('jupyter.extensions.widgetManager');

export
interface IIPyWidgetExtension extends IPyWidgetExtension {};

/**
 * The widget manager provider.
 */
export
const widgetManagerProvider: JupyterLabPlugin<IIPyWidgetExtension> = {
  id: 'jupyter.extensions.widgetManager',
  provides: IIPyWidgetExtension,
  requires: [IDocumentRegistry],
  activate: activateWidgetExtension
};

export
class IPyWidgetExtension implements IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(nb: NotebookPanel, context: IDocumentContext<INotebookModel>): IDisposable {
    let wManager = new WidgetManager(context, nb.content.rendermime);
    let wRenderer = new WidgetRenderer(wManager);

    nb.content.rendermime.addRenderer(WIDGET_MIMETYPE, wRenderer, 0);
    return new DisposableDelegate(() => {
      if (nb.rendermime) {
        nb.rendermime.removeRenderer(WIDGET_MIMETYPE);
      }
      wRenderer.dispose();
      wManager.dispose();
    });
  }
}

/**
 * Activate the widget extension.
 */
function activateWidgetExtension(app: JupyterLab, registry: IDocumentRegistry) {
  let extension = new IPyWidgetExtension();
  registry.addWidgetExtension('Notebook', extension);
  return extension;
}
