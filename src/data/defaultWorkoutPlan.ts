import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_WORKOUT_PLAN = {
  id: 'default-push-pull-legs',
  name: 'برنامه پوش/پول/لگ (رایگان)',
  duration: 4, // هفته
  startDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  days: [
    {
      day: 'شنبه',
      muscles: ['سینه', 'سرشانه', 'سه سر'],
      totalSets: 20,
      exercises: [
        { name: 'پرس سینه هالتر', sets: 4, reps: 10 },
        { name: 'بالا سینه دمبل', sets: 3, reps: 12 },
        { name: 'قفسه سینه دستگاه', sets: 3, reps: 15 },
        { name: 'نشر جانب دمبل', sets: 4, reps: 15 },
        { name: 'پشت بازو سیم‌کش', sets: 4, reps: 12 }
      ]
    },
    {
      day: 'یکشنبه',
      muscles: ['زیربغل', 'جلوبازو', 'کول'],
      totalSets: 20,
      exercises: [
        { name: 'لت از جلو', sets: 4, reps: 12 },
        { name: 'زیربغل قایقی', sets: 4, reps: 12 },
        { name: 'فیله کمر', sets: 3, reps: 15 },
        { name: 'جلوبازو هالتر ایستاده', sets: 4, reps: 10 },
        { name: 'جلوبازو دمبل چکشی', sets: 3, reps: 12 }
      ]
    },
    {
      day: 'دوشنبه',
      muscles: ['چهارسر', 'همسترینگ', 'ساق'],
      totalSets: 22,
      exercises: [
        { name: 'اسکوات پا', sets: 4, reps: 10 },
        { name: 'پرس پا دستگاه', sets: 4, reps: 12 },
        { name: 'جلوران دستگاه', sets: 3, reps: 15 },
        { name: 'پشت ران دستگاه', sets: 4, reps: 12 },
        { name: 'ساق پا ایستاده', sets: 5, reps: 20 }
      ]
    },
    { day: 'سه‌شنبه', muscles: [], totalSets: 0, exercises: [] }, // استراحت
    {
      day: 'چهارشنبه',
      muscles: ['سرشانه', 'کول', 'شکم'],
      totalSets: 20,
      exercises: [
        { name: 'پرس سرشانه دمبل', sets: 4, reps: 10 },
        { name: 'نشر خم دمبل', sets: 4, reps: 15 },
        { name: 'شراگ دمبل', sets: 4, reps: 15 },
        { name: 'کرانچ شکم', sets: 4, reps: 20 },
        { name: 'پلانک', sets: 3, reps: 60 } // ثانیه
      ]
    },
    {
      day: 'پنجشنبه',
      muscles: ['سینه', 'پشت', 'بازو'],
      totalSets: 18,
      exercises: [
        { name: 'پارالل (دیپ)', sets: 3, reps: 10 },
        { name: 'بارفیکس', sets: 3, reps: 8 },
        { name: 'فلای سینه دستگاه', sets: 3, reps: 15 },
        { name: 'جلوبازو لاری', sets: 3, reps: 12 },
        { name: 'پشت بازو هالتر خوابیده', sets: 3, reps: 12 }
      ]
    },
    { day: 'جمعه', muscles: [], totalSets: 0, exercises: [] } // استراحت
  ]
};
