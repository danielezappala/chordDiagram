declare module 'react-json-view' {
  import * as React from 'react';
  export interface ReactJsonViewProps<T = unknown> {
    src: T;
    name?: string | false;
    collapsed?: boolean;
    enableClipboard?: boolean;
    displayDataTypes?: boolean;
    displayObjectSize?: boolean;
    onEdit?: (edit: { updated_src?: T }) => void;
    onAdd?: (add: { updated_src?: T }) => void;
    onDelete?: (del: { updated_src?: T }) => void;
    style?: React.CSSProperties;
  }
  const ReactJson: React.FC<ReactJsonViewProps>;
  export default ReactJson;
}