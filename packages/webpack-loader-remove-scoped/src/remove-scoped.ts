

export function removeScoped(this: any, source: string) {
  const reg = /(?<=<style[\s\S]*?)scoped(?=[\s\S]*?<\/style>)/g;

  const newSource = source.replace(reg, '');

  return newSource;
}


