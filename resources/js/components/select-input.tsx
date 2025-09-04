// components/select-input.tsx
import { useEffect, useState } from 'react';
import ReactSelect, { SingleValue, MultiValue, ActionMeta } from 'react-select';
import { cn } from '@/lib/utils';
import InputError from './input-error';

interface Option {
    value: string | number;
    label: string;
    [key: string]: any;
}

interface SelectInputProps {
    options: Option[];
    value?: string | number | string[] | number[];
    onChange?: (value: any) => void;
    onBlur?: () => void;
    placeholder?: string;
    isMulti?: boolean;
    isSearchable?: boolean;
    isClearable?: boolean;
    isDisabled?: boolean;
    className?: string;
    error?: string;
    name?: string;
}

export function SelectInput({
    options,
    value,
    onChange,
    onBlur,
    placeholder = "Select",
    isMulti = false,
    isSearchable = true,
    isClearable = true,
    isDisabled = false,
    className,
    error,
    name,
}: SelectInputProps) {
    const [selectedValue, setSelectedValue] = useState<Option | Option[] | null>(null);

    // Convert value to selected option(s)
    useEffect(() => {
        if (value === null || value === undefined || value === '') {
            setSelectedValue(null);
            return;
        }

        if (isMulti) {
            const values = Array.isArray(value) ? value : [value];
            const selected = options.filter(option => values.includes(option.value));
            setSelectedValue(selected);
        } else {
            const selected = options.find(option => option.value === value);
            setSelectedValue(selected || null);
        }
    }, [value, options, isMulti]);

    const handleChange = (
        newValue: SingleValue<Option> | MultiValue<Option>,
        actionMeta: ActionMeta<Option>
    ) => {
        if (isMulti) {
            const values = (newValue as MultiValue<Option>).map(option => option.value);
            onChange?.(values);
        } else {
            const singleValue = newValue as SingleValue<Option>;
            onChange?.(singleValue?.value || '');
        }
    };

    const handleBlur = () => {
        onBlur?.();
    };

    // Custom styles for Tailwind integration
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            minHeight: '40px',
            border: error
                ? '1px solid rgb(239 68 68)'
                : state.isFocused
                    ? '1px solid rgb(59 130 246)'
                    : '1px solid rgb(209 213 219)',
            borderRadius: '0.375rem',
            boxShadow: state.isFocused
                ? '0 0 0 1px rgb(59 130 246)'
                : 'none',
            '&:hover': {
                borderColor: error ? 'rgb(239 68 68)' : 'rgb(156 163 175)',
            },
            backgroundColor: isDisabled ? 'rgb(249 250 251)' : 'white',
        }),
        valueContainer: (provided: any) => ({
            ...provided,
            padding: '2px 8px',
        }),
        input: (provided: any) => ({
            ...provided,
            margin: '0',
            padding: '0',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        indicatorsContainer: (provided: any) => ({
            ...provided,
            padding: '0 8px',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: 'rgb(156 163 175)',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'rgb(17 24 39)',
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 50,
            border: '1px solid rgb(209 213 219)',
            borderRadius: '0.375rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? 'rgb(59 130 246)'
                : state.isFocused
                    ? 'rgb(243 244 246)'
                    : 'white',
            color: state.isSelected ? 'white' : 'rgb(17 24 39)',
            '&:hover': {
                backgroundColor: state.isSelected ? 'rgb(59 130 246)' : 'rgb(243 244 246)',
            },
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: 'rgb(243 244 246)',
            borderRadius: '0.25rem',
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: 'rgb(17 24 39)',
            fontSize: '0.875rem',
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: 'rgb(107 114 128)',
            '&:hover': {
                backgroundColor: 'rgb(239 68 68)',
                color: 'white',
            },
        }),
    };

    return (
        <div className={cn("w-full", className)}>
            <ReactSelect
                name={name}
                options={options}
                value={selectedValue}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                isMulti={isMulti}
                isSearchable={isSearchable}
                isClearable={isClearable}
                isDisabled={isDisabled}
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
            />
            {error && <InputError message={error} />}
        </div>
    );
}
