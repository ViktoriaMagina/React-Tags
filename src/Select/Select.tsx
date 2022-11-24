import React from "react";
// @ts-ignore  
import styles from "./Select.module.css";
export type SelectOptions = {
  label: string;
  value: string | number;
};
type SingleSelectProps = {
  value?: SelectOptions;
  onChange: (value: SelectOptions | undefined) => void;
  multiple?: false;
};
type MultipleSelectProps = {
  value: SelectOptions[];
  onChange: (value: SelectOptions[]) => void;
  multiple: true;
};
type SelectProps = {
  options: SelectOptions[];
} & (MultipleSelectProps | SingleSelectProps);

const Select = ({ value, multiple, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHighighted, setIsHighighted] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null)
  const ListRef = React.useRef<HTMLUListElement>(null)
  React.useEffect(()=> {
    function handlerKeyboard(e: KeyboardEvent){
        if(e.target !== containerRef.current) return
        switch (e.code){
            case "Enter":
            case "Space":
                setIsOpen(prev => !prev)
                if(isOpen) {
                  isOptionSelect(options[isHighighted])
                  changeOption(options[isHighighted])
                }
                break
            case "ArrowUp":
                case "ArrowDown":{
                    if(!isOpen){
                        setIsOpen(true)
                        break
                    }
                    const newValue = isHighighted + (e.code === "ArrowDown" ? 1 : -1)
                    if(newValue >= 0 && newValue < options.length){
                        setIsHighighted(newValue)
                    }
                }
        }
    }
    containerRef.current?.addEventListener("keydown", handlerKeyboard)
    return ()  => {
        containerRef.current?.removeEventListener("keydown", handlerKeyboard)
    }
  }, [isOpen, isHighighted, options, value])
  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }
  function isOptionSelect(option: SelectOptions) {
    return multiple ? value.includes(option) : value === option;
  }
  function changeOption(optionItem: SelectOptions) {
    if (multiple) {
      console.log(value)
      console.log(optionItem)
      if (value.find(option => option.value === optionItem.value)) {
        onChange(value.filter((option) => option.value !== optionItem.value));
      } else {
        onChange([...value, optionItem]);
      }
    } else {
      if (optionItem !== value) onChange(optionItem);
    }
  }
  React.useEffect(() => {
    if (isOpen) {
      setIsHighighted(0);
    }
  }, [isOpen]);
  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <div className={styles.value}>
        {multiple
          ? value.map((item, index) => (
              <button
                className={styles["option-badge"]}
                onClick={(e) => {
                  e.stopPropagation();
                  changeOption(item);
                }}
                key={index}
              >
                {item.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
              
            ))
          : value?.label}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul
        ref={ListRef}
        className={
          isOpen ? `${styles.options} ${styles.open}` : `${styles.options}`
        }
      >
        {options.map((optionItem, index) => {
          return (
            <li
              id={`option-${index}`}
              onMouseEnter={() => setIsHighighted(index)}
              onClick={() => {
                changeOption(optionItem);
                setIsOpen(false);
              }}
              className={`${styles.option} 
                       ${isOptionSelect(optionItem) ? `${styles.selected}` : ""}
                        ${index === isHighighted ? `${styles.highighted}` : ""}
                        `}
              key={index}
            >
              {optionItem.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Select;
