import { EMPTY, fromEvent, of, race } from 'rxjs';
import { catchError, filter, map, switchMap, take, timeout } from 'rxjs/operators';

export function press(node, longPressTimeout = 350) {

  let mousedown$ = fromEvent(node, 'mousedown');
  let mouseup$ = fromEvent(node, 'mouseup');
  let mousemove$ = fromEvent(node, 'mousemove');

  let press$ = mousedown$.pipe(
    filter(e => !e.button),
    switchMap((event) => {
      return race(
        mousemove$.pipe(take(1), switchMap(() => EMPTY)),
        mouseup$.pipe(
          take(1),
          map(e => {
            return {
              name: 'normalpress',
              detail: e
            };
          }),
          timeout(longPressTimeout),
          catchError(_ => {
            return of({
              name: 'longpress',
              detail: event
            });
          })
        ));
    })
  );

  const unsub = press$.subscribe({
    next: value => {
      node.dispatchEvent(new CustomEvent(value.name, {
        detail: value.detail
      }));
    }
  });

  return {
    destroy() {
      unsub.unsubscribe();
    }
  };
}
