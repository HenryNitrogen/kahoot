export async function verifyRecaptcha(token: string): Promise<boolean> {
  // 暂时关闭 reCAPTCHA 验证
  console.log('reCAPTCHA verification bypassed - feature temporarily disabled');
  return true;
}
