// UI Component type definitions

import { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Button component types
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

// Input component types
export interface InputProps extends BaseComponentProps, React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

// Textarea component types
export interface TextareaProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  autoFocus?: boolean;
  autoComplete?: string;
}

// Select component types
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

// Modal component types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

// Toast component types
export interface ToastProps extends BaseComponentProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

// Card component types
export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  avatar?: ReactNode;
  action?: ReactNode;
}

export interface CardBodyProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface CardFooterProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Badge component types
export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
}

// Avatar component types
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  fallback?: ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// Loading component types
export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'spinner' | 'dots' | 'bars' | 'pulse';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

// Divider component types
export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  textPosition?: 'left' | 'center' | 'right';
}

// Tooltip component types
export interface TooltipProps extends BaseComponentProps {
  content: string | ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
}

// Popover component types
export interface PopoverProps extends BaseComponentProps {
  trigger: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  triggerType?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  arrow?: boolean;
  offset?: number;
}

// Tabs component types
export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

// Accordion component types
export interface AccordionItem {
  key: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface AccordionProps extends BaseComponentProps {
  items: AccordionItem[];
  defaultOpenKeys?: string[];
  openKeys?: string[];
  onChange?: (keys: string[]) => void;
  variant?: 'default' | 'bordered' | 'separated';
  size?: 'sm' | 'md' | 'lg';
  multiple?: boolean;
}

// Form component types
export interface FormProps extends BaseComponentProps {
  onSubmit?: (data: any) => void;
  onReset?: () => void;
  initialValues?: Record<string, any>;
  validationSchema?: any;
  layout?: 'horizontal' | 'vertical' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  layout?: 'horizontal' | 'vertical';
  labelWidth?: string | number;
}

// Table component types
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: string | ((record: T) => string);
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
  };
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

// Pagination component types
export interface PaginationProps extends BaseComponentProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  size?: 'sm' | 'md' | 'lg';
  simple?: boolean;
  disabled?: boolean;
}

// Menu component types
export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
  onClick?: () => void;
}

export interface MenuProps extends BaseComponentProps {
  items: MenuItem[];
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelect?: (keys: string[]) => void;
  mode?: 'horizontal' | 'vertical' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

// Dropdown component types
export interface DropdownProps extends BaseComponentProps {
  trigger: ReactNode;
  menu: MenuItem[];
  placement?: 'top' | 'bottom' | 'left' | 'right';
  triggerType?: 'hover' | 'click' | 'contextMenu';
  disabled?: boolean;
  arrow?: boolean;
}

// Switch component types
export interface SwitchProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
}

// Checkbox component types
export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  value?: string | number;
}

export interface CheckboxGroupProps extends BaseComponentProps {
  options: Array<{ label: string; value: string | number; disabled?: boolean }>;
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  onChange?: (values: (string | number)[]) => void;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
}

// Radio component types
export interface RadioProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  value?: string | number;
}

export interface RadioGroupProps extends BaseComponentProps {
  options: Array<{ label: string; value: string | number; disabled?: boolean }>;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
}

// Slider component types
export interface SliderProps extends BaseComponentProps {
  value?: number | number[];
  defaultValue?: number | number[];
  onChange?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  range?: boolean;
  marks?: Record<number, string>;
  tooltip?: boolean;
  vertical?: boolean;
}

// DatePicker component types
export interface DatePickerProps extends BaseComponentProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  format?: string;
  showTime?: boolean;
  showToday?: boolean;
  allowClear?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// TimePicker component types
export interface TimePickerProps extends BaseComponentProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (time: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  format?: string;
  showSecond?: boolean;
  allowClear?: boolean;
  size?: 'sm' | 'md' | 'lg';
} 