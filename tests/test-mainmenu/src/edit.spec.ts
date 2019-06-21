// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { expect } from 'chai';

import { CommandRegistry } from '@phosphor/commands';

import { Widget } from '@phosphor/widgets';

import { WidgetTracker } from '@jupyterlab/apputils';

import { EditMenu, IEditMenu } from '@jupyterlab/mainmenu';

import { delegateExecute } from './util';

class Wodget extends Widget {
  state: string;
}

describe('@jupyterlab/mainmenu', () => {
  describe('EditMenu', () => {
    let commands: CommandRegistry;
    let menu: EditMenu;
    let tracker: WidgetTracker<Wodget>;
    let wodget: Wodget;

    beforeAll(() => {
      commands = new CommandRegistry();
    });

    beforeEach(() => {
      wodget = new Wodget();
      menu = new EditMenu({ commands });
      tracker = new WidgetTracker<Wodget>({ namespace: 'wodget' });
      void tracker.add(wodget);
    });

    afterEach(() => {
      menu.dispose();
      tracker.dispose();
      wodget.dispose();
    });

    describe('#constructor()', () => {
      it('should construct a new edit menu', () => {
        expect(menu).to.be.an.instanceof(EditMenu);
        expect(menu.menu.title.label).to.equal('Edit');
      });
    });

    describe('#undoers', () => {
      it('should allow setting of an IUndoer', () => {
        const undoer: IEditMenu.IUndoer<Wodget> = {
          tracker,
          undo: widget => {
            widget.state = 'undo';
            return;
          },
          redo: widget => {
            widget.state = 'redo';
            return;
          }
        };
        menu.undoers.add(undoer);
        void delegateExecute(wodget, menu.undoers, 'undo');
        expect(wodget.state).to.equal('undo');
        void delegateExecute(wodget, menu.undoers, 'redo');
        expect(wodget.state).to.equal('redo');
      });
    });

    describe('#clearers', () => {
      it('should allow setting of an IClearer', () => {
        const clearer: IEditMenu.IClearer<Wodget> = {
          tracker,
          noun: 'Nouns',
          clearCurrent: widget => {
            widget.state = 'clearCurrent';
            return;
          },
          clearAll: widget => {
            widget.state = 'clearAll';
            return;
          }
        };
        menu.clearers.add(clearer);
        void delegateExecute(wodget, menu.clearers, 'clearCurrent');
        expect(wodget.state).to.equal('clearCurrent');
        void delegateExecute(wodget, menu.clearers, 'clearAll');
        expect(wodget.state).to.equal('clearAll');
      });
    });
  });
});
