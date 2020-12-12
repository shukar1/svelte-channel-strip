import { fromEvent } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export function pressing(node) {
  let mousedown$ = fromEvent(node, 'mousedown');
  let mouseup$ = fromEvent(node, 'mouseup');

  let pressing$ = mousedown$.pipe(
    switchMap(() => {
      node.classList.add('pressing');
      node.dispatchEvent(new CustomEvent('pressing'));
      return mouseup$.pipe(
        tap(() => {
          node.classList.remove('pressing');
          node.dispatchEvent(new CustomEvent('stoppedpressing'));
        })
      );
    })
  );

  const unsub = pressing$.subscribe();

  return {
    destroy() {
      unsub.unsubscribe();
    }
  };
}
