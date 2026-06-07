"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed...');
    // Create Services
    const services = [
        { name: 'IV Injection', basePrice: 699, baseDistance: 4, extraPerKm: 12, taxRate: 0.18 },
        { name: 'IM Injection', basePrice: 400, baseDistance: 4, extraPerKm: 12, taxRate: 0.18 },
        { name: 'Catheterization', basePrice: 1000, baseDistance: 4, extraPerKm: 15, taxRate: 0.18 },
        { name: 'Wound Dressing', basePrice: 800, baseDistance: 4, extraPerKm: 12, taxRate: 0.18 }
    ];
    for (const s of services) {
        await prisma.service.create({ data: s });
    }
    // Create a dummy nurse
    await prisma.user.create({
        data: {
            role: 'NURSE',
            name: 'Sarah Jenkins',
            email: 'sarah@nursego.com',
            phone: '9876543210',
            password: 'hashed_password_placeholder', // Dummy
            experience: 5,
            rating: 4.9,
            isVerified: true
        }
    });
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map