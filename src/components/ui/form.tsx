import type { HTMLInputTypeAttribute, ReactNode } from 'react'
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'
import { Checkbox } from '@ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@ui/field'
import { Input } from '@ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@ui/select'
import { Textarea } from '@ui/textarea'
import {
  Controller,

} from 'react-hook-form'

interface SharedProps {
  disabled?: boolean
  type?: HTMLInputTypeAttribute
  placeholder?: string
}
type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = SharedProps & {
  name: TName
  label: ReactNode
  description?: ReactNode
  control: ControllerProps<TFieldValues, TName, TTransformedValues>['control']
}

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean
  controlFirst?: boolean
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>['render']
    >[0]['field']
    & SharedProps & {
      'aria-invalid': boolean
      'id': string
    },
  ) => ReactNode
}

type FormControlFunc<
  ExtraProps extends Record<string, unknown> = Record<never, never>,
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps,
) => ReactNode

function FormBase<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  children,
  control,
  label,
  name,
  description,
  disabled,
  controlFirst,
  horizontal,
  ...rest
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const labelElement = (
          <>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </>
        )
        const control = children({
          ...field,
          ...rest,
          'id': field.name,
          'aria-invalid': fieldState.invalid,
        })
        const errorElem = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        )

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? 'horizontal' : undefined}
          >
            {controlFirst
              ? (
                  <>
                    {control}
                    <FieldContent>
                      {labelElement}
                      {errorElem}
                    </FieldContent>
                  </>
                )
              : (
                  <>
                    <FieldContent>{labelElement}</FieldContent>
                    {control}
                    {errorElem}
                  </>
                )}
          </Field>
        )
      }}
    />
  )
}

export const FormInput: FormControlFunc = (props) => {
  return <FormBase {...props}>{field => <Input {...field} />}</FormBase>
}

export const FormTextarea: FormControlFunc = (props) => {
  return <FormBase {...props}>{field => <Textarea {...field} />}</FormBase>
}

export const FormSelect: FormControlFunc<{ children: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange}>
          <SelectTrigger
            aria-invalid={field['aria-invalid']}
            id={field.id}
            onBlur={onBlur}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  )
}

export const FormCheckbox: FormControlFunc = (props) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={value} onCheckedChange={onChange} />
      )}
    </FormBase>
  )
}
