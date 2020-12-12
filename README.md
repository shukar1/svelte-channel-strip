# Channel Strip
### Made with Svelte 3


### API
```
cols: { title: string, children?: [self] }
events: {
    id: string | number;
    title: string;
    subtitle?: string;
    start: number;
    end: number;
    meta: {
        backgroundColor: tailwind based
    }
}
```

### Events

```
positionUpdate: { id, start?: number, end?: number } = event.detail
swap: [id, id2] = event.detail
longpress: {id, source: MouseEvent} = event.detail;
normalpress: {id, source: MouseEvent} = event.detail;
ctx: {id, source: MouseEvent} = event.detail; (a.k.a contextmenu)
```
