import 'lucide-react-native';

declare module 'lucide-react-native' {
  export interface LucideProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    className?: string;
    style?: any;
    [key: string]: any;
  }
}
