export type ToolCategory = 'css' | 'converters' | 'utilities' | 'tailwind';

export interface ToolCategoryConfig {
  name: string;
  icon: string;
  slug: string;
  description: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  icon: string;
  isNew?: boolean;
  isBeta?: boolean;
  keywords?: string[];
}

export interface ToolPageProps {
  params: {
    slug?: string;
  };
}

// Shared types for tool components
export interface CodeOutputProps {
  code: string;
  language: 'css' | 'typescript' | 'javascript' | 'html' | 'json' | 'jsx' | 'tsx' | 'text';
  title?: string;
  showLineNumbers?: boolean;
}

export interface CopyButtonProps {
  text: string;
  className?: string;
  onCopy?: () => void;
}

export interface TabOption {
  id: string;
  label: string;
  icon?: string;
}

export interface TabSwitcherProps {
  options: TabOption[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  showAlpha?: boolean;
}
