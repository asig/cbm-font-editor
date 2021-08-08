/*
 * Copyright (c) 2021 Andreas Signer <asigner@gmail.com>
 *
 * This file is part of cbm-font-editor.
 *
 * cbm-font-editor is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * cbm-font-editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with cbm-font-editor.  If not, see <http://www.gnu.org/licenses/>.
 */

const Utils = {
    installKeyHandler: (handler) => {
        const oldHandler = document.body.onkeydown
        document.body.onkeydown = handler
        return oldHandler
    },

    getKeyHandler: () => {
        return document.body.onkeydown
    },

    isMac: () => {
        return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    },

    isCtrlModifierPressed(evt) {
        return (Utils.isMac() && (evt.metaKey && !evt.ctrlKey && !evt.altKey))
         || (!Utils.isMac() && (!evt.metaKey && evt.ctrlKey && !evt.altKey));
    },

    noModifierPressed(evt) {
        return !evt.metaKey && !evt.ctrlKey && !evt.altKey;
    },

    keyEventToString(evt) {
        var res = ""
        if (evt.shiftKey) {
            res += "SHIFT|"
        }
        if (evt.metaKey) {
            res += "META|"
        }
        if (evt.ctrlKey) {
            res += "CTRL|"
        }
        if (evt.altKey) {
            res += "ALT|"
        }
        res += evt.key
        return res
    }
}

export default Utils;

