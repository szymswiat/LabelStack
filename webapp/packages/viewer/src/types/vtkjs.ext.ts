interface ManipulatorOptions {
  button: number;
  scrollEnabled?: boolean;

  scale?: number;
}

interface ModifierOptions {
  control?: boolean;
  shift?: boolean;
  alt?: boolean;
}

enum MouseButtonType {
  NONE = 0,
  LEFT = 1,
  MIDDLE = 2,
  RIGHT = 3
}

export { ManipulatorOptions, ModifierOptions, MouseButtonType };
