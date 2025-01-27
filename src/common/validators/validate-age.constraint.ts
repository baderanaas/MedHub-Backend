import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { differenceInYears } from 'date-fns';

@ValidatorConstraint({ name: 'ValidateAge', async: false })
export class ValidateAgeConstraint implements ValidatorConstraintInterface {
  validate(dateOfBirth: Date, args: ValidationArguments) {
    const { minAge, maxAge } = args.constraints[0];
    const currentDate = new Date();
    const age = differenceInYears(currentDate, dateOfBirth);
    return age >= minAge && age <= maxAge;
  }

  defaultMessage(args: ValidationArguments) {
    return `The age must be between ${args.constraints[0].minAge} and ${args.constraints[0].maxAge} years old.`;
  }
}
