import {
  replaceAllPolyfill,
  genMoveComponents,
  findSubPackages,
} from './helper';
import type { IMovingComponents } from './types';

replaceAllPolyfill();

export function getMovingComponents({
  usingComponentPages,
  subPackageRoots,
  globalCompsValues,
  MOVE_COMPONENT_MIN_DISABLE_LIST,
  MOVE_COMPONENT_MIN_USE_TIMES,
  outputDir,
}: {
  usingComponentPages: Record<string, Array<string>>,
  subPackageRoots: Array<string>,
  globalCompsValues: Array<string>,
  MOVE_COMPONENT_MIN_DISABLE_LIST: Array<string>,
  MOVE_COMPONENT_MIN_USE_TIMES: number,
  outputDir: string,
}) {
  const replaceRefList: Array<Array<string>> = [];

  const movingComponents: IMovingComponents = [];

  Object.keys(usingComponentPages).forEach((componentName) => {
    const subPackages = findSubPackages(
      [...usingComponentPages[componentName as keyof typeof usingComponentPages]],
      subPackageRoots,
    );

    // 已经在分包中
    const isAlreadyInSubPackage = subPackageRoots.find(root => componentName.indexOf(`${root}/`) === 0);
    const isGlobalDisable = !!globalCompsValues.find(item => (item as string).includes(componentName));
    const isCustomDisable = !!MOVE_COMPONENT_MIN_DISABLE_LIST.find(item => componentName.includes(item));

    if (isCustomDisable) {
      console.log('[Dispatch Vue] custom.disable.componentName', componentName);
    }

    if (!isGlobalDisable
      && !isAlreadyInSubPackage
      && !isCustomDisable
      && subPackages.length
      && subPackages.length <= MOVE_COMPONENT_MIN_USE_TIMES
    ) {
      subPackages.forEach((subPackage) => {
        if (subPackage && componentName.indexOf(subPackage) !== 0) { // 仅存在一个子包引用且未在该子包
          const {
            sourceRef,
            targetRef,
          } = genMoveComponents({
            component: componentName,
            subPackage,
            outputDir,
          });

          replaceRefList.push([sourceRef, targetRef, subPackage]);

          movingComponents.push({
            sourceRef,
            targetRef,
            subPackage,
          });
        }
      });
    }
  });

  return {
    replaceRefList,
    movingComponents,
  };
}
