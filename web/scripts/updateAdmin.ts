import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdmin() {
  try {
    // 更新henryni710@gmail.com为管理员
    const updatedUser = await prisma.user.upsert({
      where: {
        email: 'henryni710@gmail.com'
      },
      update: {
        isAdmin: true
      },
      create: {
        email: 'henryni710@gmail.com',
        name: 'henry1',
        password: '$2b$10$placeholder', // 需要实际的密码哈希
        isAdmin: true
      }
    });

    console.log('管理员用户更新成功:', updatedUser);
  } catch (error) {
    console.error('更新管理员用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();
