import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const currentDate = new Date();
          return value > currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be after the current date and time`;
        },
      },
    });
  };
}
