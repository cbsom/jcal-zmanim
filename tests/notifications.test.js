import { jDate, findLocation, getNotifications } from '../dist/index.js';

describe("Chometz Notifications", () => {
    const jerusalem = findLocation('Jerusalem');

    test('Sof Zman Eating and Burn Chometz on Nissan 14 (Erev Pesach not on Shabbos)', () => {
        // Nissan 14, 5786 is Wed, April 1, 2026.
        const erevPesach = new jDate(5786, 1, 14);
        const notifications = getNotifications(erevPesach, { hour: 8, minute: 0, second: 0 }, jerusalem, true);
        
        const hasEating = notifications.dayNotes.some(n => n.includes("Sof Zman Eating Chometz"));
        const hasBurn = notifications.dayNotes.some(n => n.includes("Sof Zman Burn Chometz"));
        
        expect(hasEating).toBe(true);
        expect(hasBurn).toBe(true);
        
        console.log('Nissan 14, 5786 Day Notes:', notifications.dayNotes);
    });

    test('Sof Zman Burn Chometz on Nissan 13 (Erev Pesach on Shabbos)', () => {
        // Nissan 14, 5785 is Shabbos, April 12, 2025.
        // So Nissan 13 is Friday, April 11, 2025.
        const nissan13 = new jDate(5785, 1, 13);
        const notifications = getNotifications(nissan13, { hour: 8, minute: 0, second: 0 }, jerusalem, true);
        
        const hasEating = notifications.dayNotes.some(n => n.includes("Sof Zman Eating Chometz"));
        const hasBurn = notifications.dayNotes.some(n => n.includes("Sof Zman Burn Chometz"));
        
        expect(hasEating).toBe(false); // Eating is on the 14th
        expect(hasBurn).toBe(true); // Burning is on the 13th (Friday)
        
        console.log('Nissan 13, 5785 Day Notes:', notifications.dayNotes);
    });

    test('Sof Zman Eating Chometz on Nissan 14 (Erev Pesach on Shabbos)', () => {
        const nissan14 = new jDate(5785, 1, 14);
        const notifications = getNotifications(nissan14, { hour: 8, minute: 0, second: 0 }, jerusalem, true);
        
        const hasEating = notifications.dayNotes.some(n => n.includes("Sof Zman Eating Chometz"));
        const hasBurn = notifications.dayNotes.some(n => n.includes("Sof Zman Burn Chometz"));
        
        expect(hasEating).toBe(true);
        expect(hasBurn).toBe(false); // Burning was on the 13th
        
        console.log('Nissan 14, 5785 Day Notes:', notifications.dayNotes);
    });
});
