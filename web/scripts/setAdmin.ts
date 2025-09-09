import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdminUser() {
  try {
    // 查找邮箱为 henryni710@gmail.com 的用户
    const user = await prisma.user.findUnique({
      where: {
        email: 'henryni710@gmail.com'
      }
    });

    if (user) {
      // 如果用户存在，设置为管理员
      await prisma.user.update({
        where: {
          email: 'henryni710@gmail.com'
        },
        data: {
          isAdmin: true
        }
      });
      console.log('✅ 用户 henryni710@gmail.com 已设置为管理员');
    } else {
      console.log('❌ 用户 henryni710@gmail.com 不存在，请先注册账户');
      
      // 显示所有现有用户
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true
        }
      });
      
      console.log('\n当前数据库中的用户：');
      allUsers.forEach(user => {
        console.log(`- ${user.email} (${user.name}) - 管理员: ${user.isAdmin ? '是' : '否'}`);
      });
    }
  } catch (error) {
    console.error('设置管理员权限时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminUser();
