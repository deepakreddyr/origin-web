import React, { PureComponent, RefObject } from 'react';

interface SingleOtpInputProps {
  focus?: boolean;
  shouldAutoFocus?: any;
  placeholder?: string;
  separator?: React.ReactNode;
  isLastChild?: boolean;
  inputStyle?: React.CSSProperties | string;
  focusStyle?: React.CSSProperties | string;
  errorStyle?: React.CSSProperties | string;
  disabledStyle?: React.CSSProperties | string;
  isDisabled?: boolean;
  hasErrored?: boolean;
  isInputNum?: boolean;
  isInputSecure?: boolean;
  className?: string;
  index: number;
  value?: string;
  onChange?: any; // Your custom handler
  onKeyDown: any;
  onInput: any;
  onFocus?: any;
  onPaste: any;
  onBlur: any;
}

class SingleOtpInput extends PureComponent<SingleOtpInputProps> {
  private input: RefObject<HTMLInputElement>;

  constructor(props: SingleOtpInputProps) {
    super(props);
    this.input = React.createRef();
  }

  componentDidMount() {
    const { focus, shouldAutoFocus } = this.props;
    const inputEl = this.input.current;

    if (inputEl && focus && shouldAutoFocus) {
      inputEl.focus();
    }
  }

  componentDidUpdate(prevProps: SingleOtpInputProps) {
    const { focus } = this.props;
    const inputEl = this.input.current;

    if (prevProps.focus !== focus && inputEl && focus) {
      inputEl.focus();
      inputEl.select();
    }
  }

  private isStyleObject = (obj: unknown): obj is React.CSSProperties => typeof obj === 'object' && obj !== null;

  private getClasses = (...classes: (string | boolean | React.CSSProperties | undefined)[]) =>
    classes.filter((c) => typeof c === 'string').join(' ');

  private getType = (): string => {
    const { isInputSecure, isInputNum } = this.props;

    if (isInputSecure) {
      return 'password';
    }

    if (isInputNum) {
      return 'tel';
    }

    return 'text';
  };

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange, index } = this.props;
    const value = event.target.value;

    // If there's a custom onChange handler, call it with value and index
    if (onChange) {
      onChange(value, index);
    }
  };

  render() {
    const {
      placeholder,
      separator,
      isLastChild,
      inputStyle,
      focus,
      isDisabled,
      hasErrored,
      errorStyle,
      focusStyle,
      disabledStyle,
      className,
      isInputNum,
      index,
      value,
      ...rest
    } = this.props;

    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          aria-label={`${
            index === 0 ? 'Please enter verification code. ' : ''
          }${isInputNum ? 'Digit' : 'Character'} ${index + 1}`}
          autoComplete="off"
          style={{
            width: '1em',
            textAlign: 'center',
            ...(this.isStyleObject(inputStyle) && inputStyle),
            ...(focus && this.isStyleObject(focusStyle) && focusStyle),
            ...(isDisabled && this.isStyleObject(disabledStyle) && disabledStyle),
            ...(hasErrored && this.isStyleObject(errorStyle) && errorStyle)
          }}
          placeholder={placeholder}
          className={this.getClasses(
            inputStyle,
            focus && focusStyle,
            isDisabled && disabledStyle,
            hasErrored && errorStyle
          )}
          type={this.getType()}
          maxLength={1}
          ref={this.input}
          disabled={isDisabled}
          value={value || ''}
          onChange={this.handleChange} // Use the custom handler for onChange
          {...rest}
        />
        {!isLastChild && separator}
      </div>
    );
  }
}

export default SingleOtpInput;
