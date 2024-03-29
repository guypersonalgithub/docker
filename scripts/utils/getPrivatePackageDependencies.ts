import { detectPackages } from "./detectPackages";

type getPrivatePackageDependenciesArgs = {
  dependencies: Record<string, string>;
  privatePackages: string[];
  localPackage: string;
  projectAbsolutePath: string;
};

export const getPrivatePackageDependencies = ({
  dependencies,
  privatePackages,
  localPackage,
  projectAbsolutePath,
}: getPrivatePackageDependenciesArgs) => {
  for (const dependency in dependencies) {
    if (dependency.includes(localPackage)) {
      const dependencyFolder = dependency.replace(`${localPackage}/`, "");
      privatePackages.push(`packages/${dependencyFolder}`);
      detectPackages({
        workspace: `packages/${dependencyFolder}`,
        existingPrivatePackages: privatePackages,
        projectAbsolutePath,
      });
    }
  }
};
