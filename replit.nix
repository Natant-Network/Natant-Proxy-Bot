{ pkgs }: {
  deps = [
    pkgs.yarn
    pkgs.nodejs_18
    pkgs.nodePackages.typescript-language-server
  ];
}