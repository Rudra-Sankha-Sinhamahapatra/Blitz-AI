export interface Step {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed' | 'error';
  }
  
  export interface File {
    id: string;
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: File[];
    language?: string;
    isOpen?: boolean;
  }
  
  export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }
  
  export interface Theme {
    primary: string;
    secondary: string;
    accent: string;
  }