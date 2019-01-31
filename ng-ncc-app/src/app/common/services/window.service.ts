// https://juristr.com/blog/2016/09/ng2-get-window-ref/
// This service provides a reference to the JS window object, if there is one.
// As Angular is intended for environments other than web browsers, there might not be a window object available -
// so we want a window object wrapper.

import { Injectable } from '@angular/core';

function _window(): any {
    // return the global native browser window object
    return window;
}

@Injectable()
export class WindowService {
    get nativeWindow(): any {
        return _window();
    }
}
