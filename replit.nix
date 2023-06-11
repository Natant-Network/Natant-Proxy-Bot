{ pkgs }: {
  deps = [
    pkgs.yarn
    pkgs.nodejs
    pkgs.yarn
    pkgs.nodePackages.typescript-language-server
  ];
}