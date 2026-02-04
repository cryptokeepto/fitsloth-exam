
import { calculateBMI, getBMICategory } from './src/services/bmiService';

console.log('--- REPRO START ---');
try {
  const bmi = calculateBMI(70, 170);
  console.log(`BMI for 70kg, 170cm: ${bmi}`);
  console.log(`Category: ${getBMICategory(bmi)}`);
  
  const bmi2 = calculateBMI(70, 1.7); // What if height is passed in meters?
  console.log(`BMI for 70kg, 1.7cm (oops meters?): ${bmi2}`);

} catch (e) {
  console.error(e);
}
console.log('--- REPRO END ---');
