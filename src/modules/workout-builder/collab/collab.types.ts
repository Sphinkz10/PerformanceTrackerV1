export interface RemoteCursor { userId: string; x: number; y: number; color: string }
export interface CollabState { cursors: RemoteCursor[]; lockedNodes: Record<string, string> }
