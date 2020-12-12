export interface Block {
  id: number | string;
  title: string;
  subtitle: string;
  start: number;
  end: number;
  width: number;
  left: number;
  earlyEnd: boolean;
  hoverRight: boolean;
  hoverLeft: boolean;
  hovering: boolean;
  gripping: boolean;
  dragging: boolean;
  pressing: boolean;
  meta?: {
    backgroundColor: string;
  }
}
